# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

App móvil/web del Centro de Graduados de la Facultad de Derecho (UBA). Frontend **Ionic 6 + Vue 3 + TypeScript** sobre **Vue CLI** (webpack), empaquetada como nativa con **Capacitor** (carpetas `android/` e `ios/`). El backend es una API Laravel externa (`VUE_APP_API_URL` en `.env`, hoy `https://api.graduados.kame-code.com/api`); en este repo solo vive el frontend.

Idioma del proyecto: código, comentarios, commits y docs en **español**.

## Comandos

```bash
npm run serve          # dev server (http://localhost:8080)
npm run build          # build producción (publicPath /APP-GRADUADOS/)
npm run lint           # eslint via vue-cli-service
npm run test:unit      # jest
npm run test:unit -- --testPathPattern=tests/unit/example.spec   # un solo archivo
npm run test:unit -- -t "nombre del test"                        # un solo test
npm run test:e2e       # cypress
npm run deploy         # build + gh-pages -d dist (GitHub Pages)
```

Deploy web: GitHub Pages en `https://BOOTCOOP.github.io/APP-GRADUADOS`. El `postbuild` copia `dist/index.html` a `dist/404.html` para que las rutas SPA funcionen en Pages. En producción `publicPath` es `/APP-GRADUADOS/` (ver `vue.config.js`).

Variables de entorno (`.env`, no commiteado con valores reales): `VUE_APP_API_URL` (base de la API) y `VUE_APP_APPLICATION_NAME` (prefijo de las claves de localStorage para token y usuario).

## Arquitectura

### Modelo de acceso: app pública por defecto

Refactor reciente (commit `ea2c474`): la app se navega **sin sesión**. Solo las rutas con `meta: { auth: true }` exigen login; el guard en [src/router/index.ts](src/router/index.ts) redirige a `/login?redirect=<destino>`. Para acciones puntuales dentro de páginas públicas (ej. botón "inscribirse") se usa `useRequireAuth()` de [src/uses/requireAuth.ts](src/uses/requireAuth.ts), que valida el `?redirect=` con `safeRedirect()` (solo paths internos).

El mismo guard fuerza `complete-profile` si el usuario logueado tiene `profile_complete === false`.

⚠️ **Pendiente**: la API de producción todavía debe abrir los 11 endpoints GET públicos (courses, workshops, feeds, interests, bibliographies, slider/home) con auth opcional. El detalle está en `BACKEND-PROMPT-endpoints-publicos.md` (borrable una vez aplicado en el backend).

### Autenticación

- **Login por DNI** (no email): `POST auth/login` → `{ accessToken, user }`. Errores: 422 credenciales, 409 registro pendiente de confirmar.
- **Registro** ([src/uses/auth.ts](src/uses/auth.ts)): wizard que arranca con `check-dni` (read-only) y ramifica en Caso A (DNI en el padrón legacy → solo confirma por email enmascarado), Caso B (graduado de otra universidad → formulario completo, opcionalmente con documento vía FormData) o disputa (DNI ya usado → `auth/register/dispute` para resolución manual).
- **Sesión**: token y usuario en localStorage vía [src/utils/apitoken.ts](src/utils/apitoken.ts) y [src/utils/user.ts](src/utils/user.ts). La capa reactiva es [src/uses/currentUser.ts](src/uses/currentUser.ts) (`isLoggedIn`, `profileComplete`, `canOperate`, `typeValidationStatus`) — `user.ts` le notifica los cambios para evitar ciclo de imports; no leer localStorage directo desde componentes.

### Capa HTTP

Instancia única de axios en [src/libs/axios.ts](src/libs/axios.ts) con tres interceptores de `src/middlewares/`:
- `token.ts` — inyecta el Bearer token si existe.
- `authenticate.ts` — ante 401 **con token seteado** limpia sesión y redirige a login con `?redirect=`; un 401 anónimo se rechaza en silencio (esperable en app pública). 403 → toast.
- `validationManager.ts` — manejo de errores de validación 422.

### Estado (Vuex, no Pinia)

Vuex es el store real (Pinia está instalada pero no es el patrón dominante). Los módulos en `src/store/modules/` funcionan como **repositorios de API sin estado**: acciones namespaced que llaman axios y devuelven la promesa (ver [src/store/modules/resources/course/courses.ts](src/store/modules/resources/course/courses.ts) como ejemplo canónico). Los componentes hacen `store.dispatch('courses/fetchAll', filters)` y manejan la respuesta localmente. `ui/` tiene el toastr: `store.dispatch("ui/toastr/create", "mensaje")`.

### Vistas y componentes compartidos

- Cada feature vive en `src/views/<feature>/` (courses, activities=talleres, jobs, feeds, benefits, classifieds=avisos, bibliography, inscriptions, profile, entertainment=quizzes...). Los nombres de ruta usan el patrón `feature.index` / `feature.show`.
- Layouts globales registrados en `main.ts`: `<graduados-app>` (con header/menú) y `<graduados-blank>` — se usan como wrapper raíz de cada vista.
- `src/views/app/components/pagination/InfinitePagination.vue` es el patrón estándar de listados: recibe la acción del store y los filtros, y expone los items por slot.

### Actualizaciones OTA y force update

OTA self-hosted con `@capgo/capacitor-updater` en modo manual: al montar la app llama `notifyAppReady()` (rollback automático si un bundle crashea antes) y después chequea el manifiesto `public/ota/latest.json` servido por Pages; los zips van en GitHub Releases (tag `bundle-x.y.z`) o en `public/ota/`. Los cambios de JS se distribuyen SIEMPRE por OTA (bump de `package.json` + `npm run ota:build` + manifiesto), sin tocar la API ni las tiendas. Force update: palanca de EMERGENCIA — la app compara su versión **nativa** (no la del bundle) contra `min_version` de `GET /api/app/config` (y ante un 426 de la API) → alert bloqueante hacia la tienda; se opera subiendo `APP_MIN_VERSION` en el `.env` del server de la API y solo sirve para forzar instalaciones de tienda. **Regla de oro**: `npm run build:native` (base `/`) para Capacitor/OTA, `npm run build` (base `/APP-GRADUADOS/`) solo para Pages — nunca sincronizar un build web a Capacitor, y jamás empaquetar un bundle OTA con el `.env` local apuntando a localhost (`make-bundle.js` lo valida). Detalle completo en [docs/releases-y-actualizaciones.md](docs/releases-y-actualizaciones.md).

## Documentación de contexto

- `docs/` — notas de integración con el backend (registro, tipo de usuario, notas).
- `docs/releases-y-actualizaciones.md` — proceso de releases: tienda vs OTA vs backend, versionado, force update.
- `CHANGELOG.md` — historial de versiones.
- Los archivos `REPORTE_*.md` y `BACKEND-PROMPT-*.md` en la raíz son documentos de trabajo puntuales, no documentación permanente.

## Mantenimiento de este archivo

Si un cambio altera algo descrito acá (modelo de auth, patrón de store, comandos, pendientes), actualizá la sección correspondiente en el mismo commit. Cuando el pendiente del backend (endpoints públicos) se resuelva, eliminá esa advertencia.
