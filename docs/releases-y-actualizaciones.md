# Releases y actualizaciones

> Guía operativa para publicar cambios de esta app: cuándo alcanza con un deploy del backend,
> cuándo se empuja un bundle JS por OTA y cuándo hay que pasar por las tiendas.
> Escrita para un dev (o agente) que nunca hizo un release de esta app.
>
> Stack relevante: **Capacitor 8**, targetSdk 36 (Android 16, requisito de Google Play desde el 31/8/2026),
> OTA self-hosted con `@capgo/capacitor-updater` v8 (modo manual, sin el cloud pago de Capgo),
> manifiesto servido por GitHub Pages y bundles en GitHub Releases.

---

## Bundle ID

El ID oficial y definitivo de la app es **`ar.uba.derecho.graduados`** (decisión del 2026-07-10; el ID histórico `com.kamecode.graduados` fue eliminado del proyecto). Está unificado en:

- `capacitor.config.ts` → `appId`
- `android/app/build.gradle` → `applicationId` y `namespace` (+ paquete de `MainActivity.java` y `strings.xml`)
- iOS → `PRODUCT_BUNDLE_IDENTIFIER`

⚠️ Las fichas en Play Console y App Store Connect deben crearse con **este** ID. El bundle ID es **irreversible** una vez publicada la app: si alguna ficha se hubiera creado con otro ID, hay que darla de baja y crear una nueva con `ar.uba.derecho.graduados` — nunca adaptar el proyecto a un ID equivocado.

---

## Tabla de decisión: ¿qué tipo de cambio → qué proceso?

| Tipo de cambio | Ejemplos | Proceso | Tiempo hasta el usuario |
|---|---|---|---|
| **Solo backend** | endpoints, validaciones, contenido, subir `min_version` | Deploy de la API. No se toca la app. | Inmediato |
| **Solo código web** (Vue/JS/CSS/assets del bundle) | fix de UI, feature nueva sin plugin nuevo, textos | **OTA** (ver [Proceso OTA](#proceso-ota-paso-a-paso)) | Próximo arranque en frío de la app (+ cache CDN ~10 min) |
| **Cambios nativos** | plugins Capacitor nuevos/actualizados, permisos, iconos/splash, `capacitor.config.ts`, cualquier cosa en `android/` o `ios/` | **Release de tienda** obligatorio (ver [Proceso de release de tienda](#proceso-de-release-de-tienda-paso-a-paso)) | Horas (Google) / 1-2 días (Apple) + adopción de usuarios |

Reglas asociadas:

- **Solo backend**: cuidar la **retrocompatibilidad** — hay versiones viejas de la app instaladas que siguen pegándole a la API. Si un cambio del backend rompe versiones viejas, coordinarlo con [force update](#force-update-forzar-migración-desde-el-backend).
- **Qué NO va por OTA**: todo lo de la fila "cambios nativos". Un OTA solo reemplaza los assets web del WebView; si el bundle JS nuevo llama a un plugin nativo que el shell instalado no tiene, crashea. Para ese caso existe `min_native_version` en el manifiesto (ver abajo), pero la solución real es release de tienda.
- **Nota de policy**: actualizar el JS del WebView por OTA está **permitido por Apple y Google** mientras el update no cambie el propósito/funcionalidad declarada de la app. Nada de usar OTA para colar features que la revisión de tienda no vio conceptualmente.

---

## Esquema de versionado

Hay **dos versiones** que evolucionan a ritmos distintos:

| Versión | Dónde vive | Cuándo se bumpea |
|---|---|---|
| **Nativa** (versión del shell) | `versionName` en `android/app/build.gradle` = `MARKETING_VERSION` en iOS = tag del release de tienda | En cada **release de tienda** |
| **Bundle JS** | `version` en `package.json` (expuesta al código como `VITE_APP_VERSION` vía `vite.config.ts`) | En cada **OTA**, y se **realinea con la nativa** en cada release de tienda |

Estado actual (versión unificada 1.2.0, release de tienda por Capacitor 8 / targetSdk 36):

- `package.json`: `1.2.0`
- Android: `versionName "1.2.0"` / `versionCode 15`
- iOS: `MARKETING_VERSION 1.2.0` / `CURRENT_PROJECT_VERSION 4`

Reglas:

- `versionCode` (Android) y `CURRENT_PROJECT_VERSION` (iOS) se incrementan **SIEMPRE +1** en cada subida a consola — es obligatorio para Play Console y App Store Connect, aunque el `versionName` no cambie.
- **SemVer** para ambas versiones: `patch` = fixes, `minor` = features, `major` = breaking.
- Ejemplo de vida real: release de tienda `1.1.0` → OTA `1.1.1` → OTA `1.1.2` → nuevo release de tienda `1.2.0` (y `package.json` vuelve a `1.2.0`).

---

## Builds: `build` vs `build:native` (regla de oro)

| Comando | Base (`publicPath`) | Para qué |
|---|---|---|
| `npm run build` | `/APP-GRADUADOS/` | Web en GitHub Pages. Deploy automático por push a `master` vía `.github/workflows/deploy.yml`. |
| `npm run build:native` | `/` (flag `CAPACITOR_BUILD=1`, ver `vite.config.ts`) | Shell nativo (Capacitor) y bundles OTA. |

⚠️ **NUNCA sincronizar a Capacitor un build web** (`npm run build` + `npx cap sync`): el WebView sirve desde la raíz, así que los assets con base `/APP-GRADUADOS/` dan **404** y la app queda en blanco. `tools/ota/make-bundle.js` valida esto antes de empaquetar.

---

## Cómo funciona el OTA (self-hosted, costo cero)

Plugin **`@capgo/capacitor-updater` v7** en **modo manual** (`autoUpdate: false` en `capacitor.config.ts`). No se usa el cloud pago de Capgo — es un upgrade opcional si algún día se quieren canales, estadísticas de adopción o encriptación de bundles.

Infraestructura:

- **Manifiesto**: `public/ota/latest.json`, servido por Pages en
  `https://bootcoop.github.io/APP-GRADUADOS/ota/latest.json`.
  El CDN de Pages cachea ~10 min; la app hace el fetch con cache-buster.
- **Bundles**: zips en **GitHub Releases**, con tag `bundle-x.y.z`.

Flujo en la app (al montar):

1. `notifyAppReady()` — **primero que todo**. Si un bundle nuevo crashea antes de llegar a esta llamada, el plugin hace **rollback automático** al bundle anterior en el próximo arranque. Es la red de seguridad contra bundles rotos.
2. Chequea el manifiesto (throttle de 60 min; también se chequea en `resume`).
3. Si hay versión nueva: `download()` descarga el zip y `next()` lo deja programado — se aplica en el **próximo arranque en frío** (no en caliente).

Campo `min_native_version` del manifiesto: los shells nativos con versión menor a ese valor **ignoran el bundle**. Protege el caso "el bundle JS nuevo requiere un plugin nativo que las instalaciones viejas no tienen": esos usuarios se quedan en su bundle actual hasta que actualicen por tienda.

---

## Proceso OTA paso a paso

Para publicar cambios de solo código web (ej. de `1.1.0` a `1.1.1`):

1. **Bump** de `version` en `package.json` → `1.1.1`.
2. **Build del bundle**:
   ```bash
   npm run ota:build
   ```
   Corre `build:native` y después `tools/ota/make-bundle.js`, que valida que la base sea `/` y genera `bundle-1.1.1.zip`.
3. **Publicar el zip**, por cualquiera de las dos vías:
   - **GitHub Releases** (recomendado — no engorda el repo):
     ```bash
     gh release create bundle-1.1.1 bundle-1.1.1.zip -t "OTA 1.1.1"
     ```
     Sin `gh` CLI: crear el release desde el navegador (GitHub → Releases → "Draft a new release", tag `bundle-1.1.1`, adjuntar el zip).
   - **Pages** (alternativa sin release, usada por ej. en el bundle 1.1.1): mover el zip a `public/ota/` y commitearlo — queda servido en `https://bootcoop.github.io/APP-GRADUADOS/ota/bundle-x.y.z.zip`. Contra: cada bundle suma ~7 MB al historial del repo. `make-bundle.js` excluye `ota/` del zip para que los bundles no se aniden entre sí.
4. **Editar `public/ota/latest.json`**: actualizar `version`, `url` (la del asset del release o la de Pages) y `notes`. Ajustar `min_native_version` solo si este bundle depende de algo nativo nuevo.
5. **Commit + push a `master`** → el workflow de Pages redeploya el manifiesto. Contar ~10 min de cache CDN hasta que todos los devices lo vean.

**Probar antes de publicar**: en un device, apuntar `VITE_OTA_MANIFEST_URL` a un server local que sirva un `latest.json` de prueba, y verificar el ciclo completo (descarga → arranque en frío → `notifyAppReady()` → la app funciona).

**"Arranque en frío" en Android**: deslizar la app de las apps recientes NO siempre mata el proceso (depende del fabricante) — para forzar la aplicación de un bundle pendiente durante una prueba, usar **Ajustes → Apps → Forzar cierre**. Para usuarios reales no hace falta nada: el bundle se aplica solo en su próximo arranque natural (Android mata los procesos en background con el tiempo).

Actualizar también `CHANGELOG.md` con la entrada de la versión.

---

## Proceso de release de tienda paso a paso

Obligatorio ante cualquier cambio nativo (ver tabla de decisión). Las fichas de las tiendas se crean con el ID `ar.uba.derecho.graduados` (ver [Bundle ID](#bundle-id)).

1. **Bump de versiones nativas**:
   - Android (`android/app/build.gradle`): `versionName` nuevo + `versionCode` **+1**.
   - iOS: `MARKETING_VERSION` nuevo + `CURRENT_PROJECT_VERSION` **+1**.
   - **Realinear** `version` de `package.json` con la versión nativa nueva.
2. **Build y sync**:
   ```bash
   npm run build:native
   npx cap sync
   ```
3. **Android** — dos caminos:
   - **GitHub Actions (recomendado, no requiere Android Studio)**: pestaña Actions → workflow **"Build AAB (release, para Play Store)"** → Run workflow → descargar el artifact `app-release-aab` → subir el `.aab` a **Play Console**. Requiere los secrets del repo `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` (ver comentario del workflow). El keystore es la **upload key** (Play App Signing custodia la clave final); backup del `.jks` fuera del repo — jamás commitearlo (`.gitignore` ya lo cubre).
   - **Local**: `npx cap open android` y en Android Studio: Build → Generate Signed Bundle (usa `android/keystore.properties`) → subir a Play Console.
4. **iOS** (requiere Mac con **Xcode 26+**, exigido por Capacitor 8):
   ```bash
   npx cap open ios
   ```
   En Xcode: Product → **Archive** → subir a **App Store Connect**.
5. **Tag y changelog**: tag de release con la versión nativa, entrada en `CHANGELOG.md`.
6. **Revisión de tiendas**: horas (Google) / 1-2 días (Apple).

---

## Force update: forzar migración desde el backend

⚠️ **NO es parte del ciclo normal de actualización.** Es la palanca de emergencia para obligar a los usuarios de versiones viejas a actualizar por tienda (ej. cuando el backend rompe compatibilidad o hay un bug grave en shells viejos). Para cambios de JS nunca hace falta: el OTA los distribuye solo, sin tocar nada de la API.

- **Endpoint** (implementado y verificado en producción el 2026-07-10): `GET /api/app/config` — público, sin auth — devuelve `{ "data": { "min_version", "latest_version", "store_urls": { "android", "ios" }, "message" } }`. Contrato y reglas documentados también del lado de la API en `docs/force-update.md` de su repo.
- **Administración (esquema híbrido del backend)**: la fuente de verdad son los defaults versionados en `config/app_version.php` del repo de la API — un bump "normal" de versión (salió release nueva) es un commit chico ahí y sale con el próximo deploy. Los overrides por `.env` del server (`APP_MIN_VERSION`, etc.) existen solo para **emergencias** (efecto inmediato, editar `.env` + refrescar config cache) o para que un entorno difiera de producción; después de la emergencia el valor se consolida por commit y se limpia el override.
- **En la app**: al arrancar y en `resume` (throttle 30 min, solo plataforma nativa) compara la **versión NATIVA instalada** (`App.getInfo().version` — la del APK/tienda, NO la del bundle OTA) con `min_version`. Si `instalada < min_version` → **alert bloqueante** con botón a la tienda.
- **Red de seguridad** (fase 2, EN ESPERA del lado del backend): la app ya manda el header `X-App-Version` en cada request y maneja el status **426** mostrando el mismo alert. El middleware del backend que emite el 426 no está activado — se confirma explícitamente cuando se decida (la fase 1 cubre el flujo completo).
- **La palanca operativa**: pedir el bump al equipo de la API — commit en su config si es un bump normal, override por `.env` si es emergencia (avisar explícitamente que es emergencia). Usarla con cuidado — bloquea a TODOS los usuarios por debajo del umbral hasta que instalen desde la tienda. Probado end-to-end el 2026-07-10 (con `9.9.9` de prueba).

Relación con OTA: force update empuja hacia la **tienda** (shell nativo); OTA empuja el **bundle JS**. Como `min_version` se compara contra la versión nativa, subirla solo tiene sentido cuando existe una versión de tienda más nueva que instalar.

---

## Checklist de release

Antes de dar por publicado un release (tienda u OTA):

- [ ] **Versiones sincronizadas**: `package.json` / `versionName` + `versionCode` / `MARKETING_VERSION` + `CURRENT_PROJECT_VERSION` según el esquema de versionado (OTA: solo `package.json`; tienda: todo realineado).
- [ ] **Bundle ID**: las fichas de las tiendas se crean con `ar.uba.derecho.graduados` (ver sección Bundle ID).
- [ ] **`CHANGELOG.md` actualizado** con la versión y la fecha.
- [ ] **Build correcto**: `build:native` para nativo/OTA, nunca un build web sincronizado a Capacitor.
- [ ] **OTA probado en un device real** (manifiesto local vía `VITE_OTA_MANIFEST_URL`) antes de publicar el manifiesto real.
- [ ] **make-bundle validando**: la prueba negativa (`$env:VITE_API_URL="http://localhost:8000/api"; npm run ota:build` debe abortar) confirma que el escaneo de URLs de dev sigue encontrando los `.js` del build.
- [ ] **`latest.json` consistente**: `version` = la del zip, `url` apunta al asset del release `bundle-x.y.z` (o al zip en `public/ota/`), `min_native_version` correcto.
- [ ] **Tag creado**: `bundle-x.y.z` para OTA, versión nativa para tienda.
- [ ] **Retrocompatibilidad con la API** pensada (o `min_version` del backend actualizado si se rompe).
