# Releases y actualizaciones

> Guía operativa para publicar cambios de esta app: cuándo alcanza con un deploy del backend,
> cuándo se empuja un bundle JS por OTA y cuándo hay que pasar por las tiendas.
> Escrita para un dev (o agente) que nunca hizo un release de esta app.
>
> Stack relevante: **Capacitor 7**, targetSdk 35, OTA self-hosted con `@capgo/capacitor-updater` v7
> (modo manual, sin el cloud pago de Capgo), manifiesto servido por GitHub Pages y bundles en GitHub Releases.

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
| **Bundle JS** | `version` en `package.json` (expuesta al código como `VUE_APP_VERSION` vía `vue.config.js`) | En cada **OTA**, y se **realinea con la nativa** en cada release de tienda |

Estado actual (versión unificada 1.1.0):

- `package.json`: `1.1.0`
- Android: `versionName "1.1.0"` / `versionCode 14`
- iOS: `MARKETING_VERSION 1.1.0` / `CURRENT_PROJECT_VERSION 3`

Reglas:

- `versionCode` (Android) y `CURRENT_PROJECT_VERSION` (iOS) se incrementan **SIEMPRE +1** en cada subida a consola — es obligatorio para Play Console y App Store Connect, aunque el `versionName` no cambie.
- **SemVer** para ambas versiones: `patch` = fixes, `minor` = features, `major` = breaking.
- Ejemplo de vida real: release de tienda `1.1.0` → OTA `1.1.1` → OTA `1.1.2` → nuevo release de tienda `1.2.0` (y `package.json` vuelve a `1.2.0`).

---

## Builds: `build` vs `build:native` (regla de oro)

| Comando | Base (`publicPath`) | Para qué |
|---|---|---|
| `npm run build` | `/APP-GRADUADOS/` | Web en GitHub Pages. Deploy automático por push a `master` vía `.github/workflows/deploy.yml`. |
| `npm run build:native` | `/` (flag `CAPACITOR_BUILD=1`, ver `vue.config.js`) | Shell nativo (Capacitor) y bundles OTA. |

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
3. **Publicar el zip** en GitHub Releases:
   ```bash
   gh release create bundle-1.1.1 bundle-1.1.1.zip -t "OTA 1.1.1"
   ```
4. **Editar `public/ota/latest.json`**: actualizar `version`, `url` (la del asset del release) y `notes`. Ajustar `min_native_version` solo si este bundle depende de algo nativo nuevo.
5. **Commit + push a `master`** → el workflow de Pages redeploya el manifiesto. Contar ~10 min de cache CDN hasta que todos los devices lo vean.

**Probar antes de publicar**: en un device, apuntar `VUE_APP_OTA_MANIFEST_URL` a un server local que sirva un `latest.json` de prueba, y verificar el ciclo completo (descarga → arranque en frío → `notifyAppReady()` → la app funciona).

Actualizar también `CHANGELOG.md` con la entrada de la versión.

---

## Proceso de release de tienda paso a paso

Obligatorio ante cualquier cambio nativo (ver tabla de decisión). Antes del primero de todos: resolver el [aviso del bundle ID](#️-aviso-crítico-mismatch-de-bundle-id-resolver-antes-de-la-primera-subida-a-tiendas).

1. **Bump de versiones nativas**:
   - Android (`android/app/build.gradle`): `versionName` nuevo + `versionCode` **+1**.
   - iOS: `MARKETING_VERSION` nuevo + `CURRENT_PROJECT_VERSION` **+1**.
   - **Realinear** `version` de `package.json` con la versión nativa nueva.
2. **Build y sync**:
   ```bash
   npm run build:native
   npx cap sync
   ```
3. **Android**:
   ```bash
   npx cap open android
   ```
   En Android Studio: generar **AAB firmado** (Build → Generate Signed Bundle; usa `keystore.properties`) y subirlo a **Play Console**.
4. **iOS** (requiere Mac con **Xcode 16+**):
   ```bash
   npx cap open ios
   ```
   En Xcode: Product → **Archive** → subir a **App Store Connect**.
5. **Tag y changelog**: tag de release con la versión nativa, entrada en `CHANGELOG.md`.
6. **Revisión de tiendas**: horas (Google) / 1-2 días (Apple).

---

## Force update: forzar migración desde el backend

Mecanismo para obligar a los usuarios de versiones viejas a actualizar por tienda (ej. cuando el backend rompe compatibilidad o hay un bug grave en shells viejos). El contrato del endpoint está pedido en `BACKEND-PROMPT-min-version.md`.

- **Endpoint**: `GET /api/app/config` devuelve `min_version`, `latest_version`, `store_urls` y `message`.
- **En la app**: al arrancar y en `resume` (throttle 30 min, solo plataforma nativa) compara la versión instalada con `min_version`. Si `instalada < min_version` → **alert bloqueante** con botón a la tienda.
- **Red de seguridad**: la app manda el header `X-App-Version` en cada request; si la API responde **426** a cualquier request, se muestra el mismo alert bloqueante. Cubre el caso de una app que quedó abierta o cuyo chequeo de config falló.
- **La palanca operativa** es subir `min_version` en el backend: no requiere tocar la app. Usarla con cuidado — bloquea a todos los usuarios por debajo del umbral hasta que actualicen.

Relación con OTA: force update empuja hacia la **tienda** (shell nativo); OTA empuja el **bundle JS**. Si un cambio del backend solo requiere JS nuevo, alcanza con un OTA y no hace falta tocar `min_version`.

---

## Checklist de release

Antes de dar por publicado un release (tienda u OTA):

- [ ] **Versiones sincronizadas**: `package.json` / `versionName` + `versionCode` / `MARKETING_VERSION` + `CURRENT_PROJECT_VERSION` según el esquema de versionado (OTA: solo `package.json`; tienda: todo realineado).
- [ ] **Bundle ID verificado** (solo mientras siga pendiente el mismatch — ver aviso crítico).
- [ ] **`CHANGELOG.md` actualizado** con la versión y la fecha.
- [ ] **Build correcto**: `build:native` para nativo/OTA, nunca un build web sincronizado a Capacitor.
- [ ] **OTA probado en un device real** (manifiesto local vía `VUE_APP_OTA_MANIFEST_URL`) antes de publicar el manifiesto real.
- [ ] **`latest.json` consistente**: `version` = la del zip, `url` apunta al asset del release `bundle-x.y.z`, `min_native_version` correcto.
- [ ] **Tag creado**: `bundle-x.y.z` para OTA, versión nativa para tienda.
- [ ] **Retrocompatibilidad con la API** pensada (o `min_version` del backend actualizado si se rompe).
