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

### Una sola línea de versiones, siempre creciente

Aunque son dos versiones, **comparten la misma línea de numeración y nunca se reusa un número**. No es una convención estética: la app compara la versión del manifiesto contra la del bundle que está corriendo, y cuando corre el bundle embebido esa versión es `VITE_APP_VERSION` = `package.json` del build de tienda (`evaluateManifest()` en `src/uses/otaUpdate.ts`). Los dos números se comparan entre sí, así que tienen que vivir en la misma escala.

De ahí salen las dos invariantes:

1. **Cada OTA es estrictamente mayor que el OTA anterior.** Si es igual o menor, `compareVersions(manifiesto, actual) <= 0` → la app lo ve como "up-to-date" y el bundle nunca se aplica, en silencio.
2. **Cada release de tienda es estrictamente mayor que el último OTA publicado.** Si sale con un número menor, la app recién actualizada se descarga el OTA viejo (número más alto, código más viejo) y **pisa el JS nuevo del shell con el anterior**: un downgrade silencioso. Si sale con el mismo número, no hay downgrade pero quedan dos artefactos distintos con la misma versión y ya no se sabe cuál corre un usuario.

Ejemplo, que es exactamente cómo se encadena: tienda `1.3.5` → OTA `1.3.6` → OTA `1.3.7` → tienda `1.3.8`. El release de tienda **no vuelve atrás ni repite**: toma el próximo número libre. Que sea `patch`, `minor` o `major` lo decide SemVer según el cambio (`1.3.7` → `1.4.0` si el release de tienda trae una feature); lo obligatorio es que sea mayor.

⚠️ Corolario, y es la trampa fácil: **`package.json` y la versión nativa tienen que salir iguales del mismo build de tienda.** Alimentan comparaciones distintas — `package.json` es la versión del bundle (comparación OTA) y `versionName`/`MARKETING_VERSION` es la que devuelve `App.getInfo()` (comparación de `min_native_version` y de `latest_version` del backend). Si el build de tienda va con la nativa atrasada respecto de `package.json`, `checkStoreUpdate()` compara la nativa vieja contra `latest_version` y le ofrece "ir a la tienda" a alguien que **ya tiene lo último instalado**, sin salida posible.

Estado actual (2026-08-11):

- `package.json`: `1.3.7` — realineado con la nativa para el release de tienda
- `public/ota/latest.json`: `1.3.6` — último OTA publicado
- Android: `versionName "1.3.7"` / `versionCode 24`, hoy en **Prueba interna**; producción sigue en `1.3.3` / `23` hasta que se promueva
- iOS: `MARKETING_VERSION 1.3.7` / `CURRENT_PROJECT_VERSION 6`. El build 1.3.3 (5) quedó en TestFlight sin enviarse nunca a revisión, así que 1.3.7 lo supera y no hay nada que hacer con él
- El release de tienda tomó `1.3.7` y no `1.3.6` porque `1.3.6` ya se había consumido como OTA. El **próximo OTA arranca en `1.3.8`**.

Reglas:

- `versionCode` (Android) y `CURRENT_PROJECT_VERSION` (iOS) se incrementan **SIEMPRE +1** en cada subida a consola — es obligatorio para Play Console y App Store Connect, aunque el `versionName` no cambie. Son contadores internos de las consolas, no versiones: no participan de la línea de arriba.
- **SemVer** para ambas versiones: `patch` = fixes, `minor` = features, `major` = breaking.

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
4. Con el bundle ya programado, la app avisa "Versión X disponible" por **dos vías a la vez** (redundancia deliberada, en evaluación — quedarán una o ambas según cómo se vean en uso real): un **toast accionable** (universal: cualquier pantalla, con o sin sesión; botón "Actualizar", la X pospone) y una **notificación local en la campanita** (persistente hasta actualizar, pero solo existe con sesión y su botón está en el header del inicio). En ambos casos tocar "actualizar" aplica al instante con `set()` (`applyPendingOtaUpdate()`). Cubre el caso iOS de un bundle descargado que nunca llega a aplicarse porque el proceso no muere.

Además del flujo automático, el menú lateral tiene un botón **"Buscar actualizaciones"** (solo en nativo, `applyOtaUpdateNow()` en `src/uses/otaUpdate.ts`): chequea el manifiesto, descarga si hace falta (o reusa un bundle ya descargado por el chequeo automático) y lo aplica con `set()` — **recarga la WebView al instante**, sin esperar un arranque en frío. Si no hay OTA para aplicar, el botón también consulta la **tienda** (`checkStoreUpdate()` en `src/uses/appUpdate.ts`, compara la versión nativa instalada contra `latest_version` de `GET app/config`) y, si hay shell más nuevo, ofrece ir a la tienda con un alert no bloqueante — para que funcione, el backend tiene que mantener `latest_version` y `store_urls` al día en `config/app_version.php`, y no adelantar `latest_version` hasta que la versión esté aprobada en AMBAS tiendas. Acá la interrupción es aceptable porque la pidió el usuario. Es la vía de escape para iOS (ver abajo) y sirve de diagnóstico: si dice "última versión" pero la versión del footer es vieja, el problema es la comparación de versiones; si tira error, es red/descarga.

Campo `min_native_version` del manifiesto: los shells nativos con versión menor a ese valor **ignoran el bundle**. Protege el caso "el bundle JS nuevo requiere un plugin nativo que las instalaciones viejas no tienen": esos usuarios se quedan en su bundle actual hasta que actualicen por tienda.

---

## Proceso OTA paso a paso

Para publicar cambios de solo código web (ej. de `1.1.0` a `1.1.1`):

0. **Chequeo de versión** (ver [Una sola línea de versiones](#una-sola-línea-de-versiones-siempre-creciente)): el número nuevo tiene que ser **mayor** que el `version` de `public/ota/latest.json`. Esto lo **valida `make-bundle.js`**, que aborta si no sube — no hay que verificarlo a mano.
   ```bash
   node -p "require('./public/ota/latest.json').version"  # piso: hay que superarlo
   ```
   Ojo con el orden: el manifiesto se edita en el paso 4, **después** de generar el zip. Si se toca antes, el chequeo lo lee como "ya publicada" y aborta. Para reempaquetar a propósito una versión ya publicada (ej. se perdió el zip): `OTA_ALLOW_SAME_VERSION=1 npm run ota:build`.

   El OTA **no toca** `versionName` / `MARKETING_VERSION` (el shell no cambia) ni `latest_version` del backend (ese campo anuncia la versión de **tienda**: adelantarlo manda a todos a buscar en la tienda algo que no existe).
1. **Bump** de `version` en `package.json` → `1.1.1`.
2. **Build del bundle**:
   ```bash
   npm run ota:build
   ```
   Corre `build:native` y después `tools/ota/make-bundle.js`, que valida que la versión suba, que la base sea `/` y que no haya URLs de dev embebidas, y genera `bundle-1.1.1.zip`.
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

**"Arranque en frío" en iOS**: no existe "Forzar cierre" en Ajustes; la única forma manual es el app switcher (deslizar hacia arriba desde abajo y soltar → deslizar la tarjeta de la app hacia arriba). iOS puede mantener el proceso vivo durante días, y hay una trampa de timing que hace parecer que el OTA "no funciona": si el bundle nuevo se descargó en ESTA sesión (por ej. la primera apertura después de reiniciar el teléfono), `next()` recién lo aplica en el arranque en frío SIGUIENTE — siempre se está "un reinicio atrás". Para probar o destrabar un update en iOS, usar el botón **"Buscar actualizaciones"** del menú, que aplica al instante.

Actualizar también `CHANGELOG.md` con la entrada de la versión.

---

## Proceso de release de tienda paso a paso

Obligatorio ante cualquier cambio nativo (ver tabla de decisión). Las fichas de las tiendas se crean con el ID `ar.uba.derecho.graduados` (ver [Bundle ID](#bundle-id)).

0. **Chequeo de versión** (ver [Una sola línea de versiones](#una-sola-línea-de-versiones-siempre-creciente)): la versión de tienda tiene que ser **estrictamente mayor que el último OTA publicado**, no igual y menos aún menor — si no, la app recién instalada se baja el OTA viejo y pisa el JS nuevo del shell.
   ```bash
   node -p "require('./public/ota/latest.json').version"  # piso: hay que superarlo
   ```
1. **Bump de versiones nativas** — las tres al **mismo** número:
   - Android (`android/app/build.gradle`): `versionName` nuevo + `versionCode` **+1**.
   - iOS: `MARKETING_VERSION` nuevo + `CURRENT_PROJECT_VERSION` **+1**.
   - **Realinear** `version` de `package.json` con la versión nativa nueva. No es opcional: si el build sale con `package.json` y la nativa distintas, `checkStoreUpdate()` le ofrece "ir a la tienda" a usuarios que ya tienen lo último (ver el corolario del esquema de versionado).
2. **Build y sync**:
   ```bash
   npm run build:native
   npx cap sync
   ```
3. **Android** — dos caminos (el paso a paso de lo que hace el humano en cada pantalla está en [Android: del workflow a producción](#android-del-workflow-a-producción-lo-que-hace-el-humano)):
   - **GitHub Actions (recomendado, no requiere Android Studio)**: pestaña Actions → workflow **"Build AAB (release, para Play Store)"** → Run workflow → elegir la **pista** (por defecto `internal`) → el AAB se compila y se **sube solo a Play Console**; el artifact `app-release-aab` queda igual como respaldo. Es el equivalente Android de lo que el workflow de iOS ya hace con TestFlight. Requiere los secrets `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD` y, para la subida, `PLAY_SERVICE_ACCOUNT_JSON` (ver comentario del workflow). El keystore es la **upload key** (Play App Signing custodia la clave final); backup del `.jks` fuera del repo — jamás commitearlo (`.gitignore` ya lo cubre).
   - **Local**: `npx cap open android` y en Android Studio: Build → Generate Signed Bundle (usa `android/keystore.properties`) → subir a Play Console.

  ⚠️ **A producción se llega promoviendo, nunca subiendo directo.** El AAB entra por `internal`, se verifica, y en la consola se promueve Prueba interna → Producción. El motivo no es ceremonia: Play cuenta **las pistas de prueba** para el requisito de nivel de API objetivo, así que subir directo a producción deja las pistas congeladas en un bundle viejo que sigue marcando la app como incumplidora. Pasó en agosto de 2026 — producción ya estaba en targetSdk 36 (bundle 23) y los bundles 15 y 16, activos en Prueba interna y en la cerrada Alpha con targetSdk 35, mantuvieron el aviso. Con la regla de promover, la pista interna nunca puede quedar más vieja que producción. Si igual elegís `production` en el workflow, el release entra como **borrador** y hay que publicarlo a mano.
4. **iOS** — dos caminos:
   - **GitHub Actions (recomendado, no requiere Mac)**: pestaña Actions → workflow **"Build iOS (release, para App Store)"** → Run workflow → el build se sube solo a App Store Connect. Tildando **"Además de subir, crear la versión en la ficha y mandarla a revisión"** no queda nada por hacer a mano (ver [Envío a revisión automatizado (iOS)](#envío-a-revisión-automatizado-ios)); sin tildar, el build queda en la lista de builds y la versión se arma en la consola. Usa **firma manual**: 6 secrets, `IOS_P12_BASE64` / `IOS_P12_PASSWORD` / `IOS_PROFILE_BASE64` (certificado + profile) y `ASC_API_KEY_P8` / `ASC_API_KEY_ID` / `ASC_API_ISSUER_ID` (API key de App Store Connect, **rol App Manager alcanza**: sube, edita la ficha y envía a revisión). Ver el comentario al tope del workflow.

  ⚠️ **Por qué manual y no cloud signing**: el cloud signing (que crearía certificado y profile solo) exige una API key con rol **Admin** — con App Manager falla con `Cloud signing permission error` + `No signing certificate "iOS Distribution" found`. Se eligió firma manual a propósito para no tener que emitir una credencial con permisos de administración de la cuenta: el `.p12` solo firma y la key App Manager solo opera sobre las apps (subir builds, editar fichas, enviar a revisión), así que ninguna de las dos puede administrar usuarios ni certificados.

  **Renovación**: el certificado de distribución vence al año (el actual, 8/8/2027). Para renovarlo no hace falta Mac — se genera clave privada + CSR con el OpenSSL que trae Git para Windows, se sube el CSR en developer.apple.com → Certificates, se baja el `.cer`, se crea el profile de App Store, y se arma el `.p12` combinando `.cer` + clave privada + el intermedio [WWDR G3](https://www.apple.com/certificateauthority/AppleWWDRCAG3.cer). Revocar y recrear certificados **no afecta la app publicada**: Apple re-firma los builds del App Store con su propio certificado.
   - **Local** (requiere Mac con **Xcode 26+**, exigido por Capacitor 8):
     ```bash
     npx cap open ios
     ```
     En Xcode: Product → **Archive** → subir a **App Store Connect**.
5. **Tag y changelog**: tag de release con la versión nativa, entrada en `CHANGELOG.md`.
6. **Revisión de tiendas**: horas (Google) / 1-2 días (Apple).

---

## Android: del workflow a producción (lo que hace el humano)

El workflow deja el AAB en **Prueba interna** y ahí termina la automatización: de la pista interna a producción todo pasa por la consola. Siete pasos, ninguno opcional.

1. **Correr el workflow**: Actions → **"Build AAB (release, para Play Store)"** → *Run workflow* → branch **master**, pista **`internal`**.
2. **Confirmar la versión en el log**: el paso *"Leer versión nativa"* imprime `AAB a compilar: versionName=X, versionCode=N`. Si no es la versión que se bumpeó, cortar ahí — no seguir con un número equivocado, porque el `versionCode` se consume aunque el release después se descarte.
3. **Verificar la pista interna**: Probar y publicar → Pruebas → **Prueba interna**. El resumen del canal tiene que decir *Activo · Última versión: X*, y la versión, *"Disponible para testers internos"*.
4. **Instalarla como tester interno** (pestaña *Testers* → link de descarga). No es opcional cuando el release consolida JS que hasta entonces solo viajó por OTA: es la primera vez que ese JS corre compilado dentro del shell nativo, y un OTA no puede rescatar un shell que no arranca.
5. **Promover a producción**: en la versión de la pista interna → **"Promocionar versión" → Producción** → escribir las notas ("Novedades de esta versión") → elegir el porcentaje de lanzamiento → revisar y publicar. La promoción reusa el mismo bundle: no hay build nuevo ni `versionCode` nuevo.
6. **Promover también a Prueba cerrada** si esa pista se usa; es el mismo botón. Si no se usa, dejarla **vacía** es mejor que dejarla con un bundle viejo (ver la advertencia del paso 3 del proceso de release). Que la interna quede sin versión activa después de promover no es problema: una pista sin versiones no incumple nada.
7. **Confirmar la publicación**: la revisión de Google tarda horas → *"Disponible en Google Play"*. En **Últimas versiones y app bundles** el bundle nuevo tiene que quedar **Activo** y el anterior **Inactivo**.

### Cuando algo sale mal

| Síntoma | Causa y salida |
|---|---|
| `Version code N has already been used` | El `versionCode` tiene que superar el más alto que exista en Play **contando las pistas de prueba**, no solo producción. Mirar *Últimas versiones y app bundles* y volver a bumpear. |
| 403 al subir, con los permisos ya dados en la consola | Los permisos de la cuenta de servicio tardan en propagar. Esperar y reintentar la misma corrida, sin cambiar nada. |
| Se quiere el mismo bundle en otra pista | **No** volver a correr el workflow apuntando a esa pista: Play rechaza el `versionCode` repetido y el build falla recién al final. Se usa **"Promocionar versión"**. |
| Una pista de prueba quedó con un bundle viejo | **"Pausar canal" NO desactiva el bundle** — verificado en agosto de 2026: más de una hora después de pausar, el explorador seguía marcando los bundles 15 y 16 como Activo. Lo único que saca un bundle de una pista es que una versión nueva lo supere ahí: promover el actual, o crear una versión con **"Agregar desde la biblioteca"** eligiendo un bundle ya subido. |
| El aviso de nivel de API objetivo sigue visible | Google re-evalúa con lag: puede tardar horas o días desde que la última pista quedó al día. Si pasa una semana, ticket a soporte de Play. |

---

## Envío a revisión automatizado (iOS)

**No existe "subir directo al App Store".** Apple tiene un solo canal de ingesta: todo binario que se sube aparece en la lista de builds de App Store Connect (lo que la consola muestra bajo TestFlight) y de ahí se adjunta a una versión de la ficha. Ese mismo binario es el que llega a la tienda, no se re-sube nada. Que el build esté "en TestFlight" **no** significa que se distribuyó a testers: sin grupos configurados, es solo el área de ingesta. Y la **revisión de Apple es obligatoria** — ningún flujo la saltea.

Lo que sí está automatizado es todo el trabajo de consola posterior, con el workflow **"Enviar iOS a revisión (App Store)"** ([.github/workflows/submit-ios.yml](../.github/workflows/submit-ios.yml) + el lane `submit` de [fastlane/Fastfile](../fastlane/Fastfile)):

1. Espera a que Apple termine de **procesar** el build (5-20 min; hasta 45 de tope).
2. Crea la **versión nueva** en la ficha y le adjunta ese build.
3. Carga las **"Novedades de esta versión"** en todos los idiomas de la ficha (los lee de la API, no están hardcodeados).
4. Responde el cuestionario del envío (cifrado — ya declarado en `Info.plist` con `ITSAppUsesNonExemptEncryption` — e IDFA) y **manda a revisión**.
5. Con **"Publicar automáticamente al aprobarse"**, sale a la tienda sola cuando Apple aprueba.

### Las dos variantes: elegir una, siempre

Al cerrar una versión lista para iPhone se corre con una de estas dos combinaciones. No hay una tercera, y conviene decidirla **antes** de lanzar el workflow.

| | Directo a producción | Pasando por TestFlight |
|---|---|---|
| **"Build iOS"** | `submit_for_review` **true** + `auto_release` **true** | `submit_for_review` **false** |
| **Después** | Nada. Cuando Apple aprueba, publica solo | Instalar el build desde TestFlight y probarlo; después correr **"Enviar iOS a revisión (App Store)"** con `auto_release` **true** |
| **Cuándo** | Cambios de bajo riesgo, o JS que ya se validó por OTA en Android | Cambios nativos (plugins, versión de Capacitor, permisos, deployment target) o cualquier cosa que no se pueda verificar sin instalar el binario |

En las dos, la revisión de Apple es obligatoria (1-2 días) y `auto_release: true` hace que al aprobarse salga a la tienda sin volver a entrar a la consola.

Detalles operativos de cada camino:

- **Encadenado**: el envío corre como job aparte en un runner **Linux** (no compila, solo habla con la API), así que la espera del procesamiento no paga minutos de macOS. Si ese job falla, **"Re-run failed jobs"** reintenta solo el envío sin recompilar.
- **Suelto**: los inputs de versión y build son opcionales — por defecto salen del `MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` del proyecto iOS del commit. Es también la vía para **reenviar después de un rechazo**, sin recompilar.

⚠️ **Las novedades salen de [fastlane/release-notes.txt](../fastlane/release-notes.txt)** (o del input `release_notes`, que gana). Ese archivo es texto **que van a leer los usuarios en la tienda**: se actualiza en el mismo commit que el bump de versión. A propósito no se genera desde `CHANGELOG.md`, que está escrito para devs (menciona `versionCode`, workflows, nombres de archivos) y sería un desastre publicarlo tal cual.

### Cuando la ficha queda bloqueada

Apple permite **una sola versión en trámite** por app. Mientras haya una esperando publicación manual (*Pendiente de publicación*), en revisión o esperando revisión, crear la siguiente falla — el envío corta con `You cannot create a new version of the App in the current state` sobre `/data/relationships/app`. No se puede "pisar" la pendiente con una versión más nueva: hay que liberar el cupo primero.

El síntoma en el log es reconocible: fastlane lee bien los idiomas de la ficha pero después no encuentra ninguna versión **editable**, y el stack muere en `post_app_store_version` (o sea, intentando *crear*). Los estados en trámite no cuentan como editables, de ahí la combinación.

Cómo se destraba, según el estado:

| Estado | Salida |
|---|---|
| **Pendiente de publicación** | Publicarla. Se puede **sin entrar a la consola** con el workflow **"Publicar versión pendiente (iOS)"** ([release-ios.yml](../.github/workflows/release-ios.yml) + el lane `release_pending`). Arranca en **modo diagnóstico**: la primera corrida solo lista las versiones y sus estados —útil cuando no hay acceso a App Store Connect— y publica recién al destildar "Solo diagnosticar". |
| **Esperando revisión** / **En revisión** | Cancelar el envío en la consola. La versión vuelve a editable y el workflow de envío la **renombra** a la versión nueva en vez de crear otra. |
| **Pendiente de publicación que no se quiere publicar** | Rechazo del desarrollador. Último recurso: hay reportes de versiones que quedan trabadas después de eso, sin aceptar builds nuevos ni permitir crear versiones ([fastlane#17539](https://github.com/fastlane/fastlane/issues/17539), [foro de Apple](https://developer.apple.com/forums/thread/821386)). La bandera `reject_if_possible` de `deliver` **no** sirve acá: el error explota en `verify_version`, antes de que el rechazo se ejecute. |

Publicar la pendiente casi nunca es una pérdida: si su binario ya es Capacitor 8, el usuario que la instale recibe el shell nuevo y el **OTA lo sube al JS más reciente en el primer arranque** (mientras `min_native_version` del manifiesto se lo permita). Sale en minutos en vez de esperar otra revisión.

⚠️ **La primera publicación de la ficha va a mano.** Una app que nunca se publicó necesita capturas, descripción, categorías, clasificación por edad y política de privacidad; eso se hace en la consola. El workflow automatiza los releases siguientes: reusa la metadata de la versión anterior (Apple la copia al crear la versión nueva) y solo escribe las novedades. Las capturas nunca se tocan (`skip_screenshots`).

Notas de implementación: `precheck` (el lint de ficha de fastlane) corre en nivel **warn** a propósito — sus reglas dan falsos positivos con textos en español y no debe bloquear un envío. `fastlane` se instala sin pin de versión: sigue la API de App Store Connect, que Apple cambia sin avisar, y un pin viejo falla justo cuando hay que publicar.

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

- [ ] **Versión mayor que la última publicada**: mayor que el `version` de `public/ota/latest.json`. En el OTA lo valida `make-bundle.js` (aborta si no sube); **en el release de tienda hay que mirarlo a mano** — un release de tienda que no supera al último OTA provoca un downgrade silencioso del JS. Nunca reusar un número.
- [ ] **Versiones sincronizadas**: `package.json` / `versionName` + `versionCode` / `MARKETING_VERSION` + `CURRENT_PROJECT_VERSION` según el esquema de versionado (OTA: solo `package.json`, y NO `latest_version` del backend; tienda: `package.json` y las dos nativas al mismo número).
- [ ] **Bundle ID**: las fichas de las tiendas se crean con `ar.uba.derecho.graduados` (ver sección Bundle ID).
- [ ] **`CHANGELOG.md` actualizado** con la versión y la fecha.
- [ ] **Build correcto**: `build:native` para nativo/OTA, nunca un build web sincronizado a Capacitor.
- [ ] **OTA probado en un device real** (manifiesto local vía `VITE_OTA_MANIFEST_URL`) antes de publicar el manifiesto real.
- [ ] **make-bundle validando**: la prueba negativa (`$env:VITE_API_URL="http://localhost:8000/api"; npm run ota:build` debe abortar) confirma que el escaneo de URLs de dev sigue encontrando los `.js` del build.
- [ ] **`latest.json` consistente**: `version` = la del zip, `url` apunta al asset del release `bundle-x.y.z` (o al zip en `public/ota/`), `min_native_version` correcto.
- [ ] **Tag creado**: `bundle-x.y.z` para OTA, versión nativa para tienda.
- [ ] **Retrocompatibilidad con la API** pensada (o `min_version` del backend actualizado si se rompe).
- [ ] **Ninguna pista de prueba con un bundle viejo** (solo Android): en *Últimas versiones y app bundles* el único **Activo** debe ser el release actual. Play cuenta las pistas de prueba para el requisito de nivel de API objetivo, así que una pista congelada marca la app como incumplidora aunque producción esté al día.
