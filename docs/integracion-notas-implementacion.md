# Notas de implementación — Integración onboarding api-graduados

> Documento vivo de la sesión de refactor del onboarding (login DNI + registro por pasos +
> validación de tipo + gate de inscripción). Sirve como memoria para próximas sesiones:
> mapea el estado real de la app, el plan, y el progreso.
>
> **Contratos de referencia:** [integracion-registro.md](integracion-registro.md) (Fase 1: identidad)
> y [integracion-tipo-usuario.md](integracion-tipo-usuario.md) (Fase 2: validación de tipo).

---

## 1. Stack y datos de entorno

- **Vue 3 + Ionic 6 (`@ionic/vue`) + Capacitor 7.** Build con **Vite** (antes Vue CLI). Estado con **Vuex 4**
  (módulos en `src/store`) + composables (`src/uses`). Pinia está en `package.json` pero **no se usa**.
- **Validación de forms:** `vee-validate` v4 + `@vee-validate/rules` (registro global en `src/main.ts`,
  mensajes en español via `@vee-validate/i18n`).
- **HTTP:** `axios` instancia única en `src/libs/axios.ts`. `baseURL = import.meta.env.VITE_API_URL`
  (que **ya incluye `/api`**), `withCredentials: true` (backend Laravel/Sanctum).
- **Env (`.env`):** `VITE_APPLICATION_NAME=graduados` (su valor deriva las claves de localStorage, no
  cambiarlo). `VITE_API_URL`: activa la de producción (`graduados.derecho.uba.ar/api`), con variantes
  de localhost comentadas para desarrollo.
- Scripts: `npm run serve` (dev), `npm run build`, `npm run lint`.

---

## 2. Arquitectura de autenticación (estado ORIGINAL, pre-refactor)

Mapa del flujo tal como estaba antes de esta sesión (para entender qué se cambia y por qué):

### Persistencia (localStorage, NO @ionic/storage)
- `src/utils/user.ts` — objeto `User`: `get()`, `set(data)`, `isSet()`, `refresh()`. Clave
  `GRADUADOS_USER`. `set(data)`: si `data.user` existe, separa `accessToken` (→ `ApiToken`) y guarda `user`.
  → **La respuesta de login se asume `{ accessToken, user: {...UserResource} }`.**
- `src/utils/apitoken.ts` — objeto `ApiToken`, clave `GRADUADOS_API_TOKEN` en localStorage.
- **No hay store de auth (ni Vuex ni Pinia).** Los componentes leen `User.get()` imperativamente
  (p.ej. `Menu.vue`).

### Interceptores axios (`src/libs/axios.ts`, en orden)
1. `src/middlewares/token.ts` — request: agrega `Authorization: Bearer <ApiToken.get()>` a **toda**
   petición (queda `Bearer null` si no hay token; el backend lo ignora en rutas públicas).
2. `src/middlewares/authenticate.ts` — response: **401** → `User.refresh()` + toast "Volvé a iniciar
   sesión" + redirige a login; **403** → toast "No tenés permiso". (No toca 409.)
3. `src/middlewares/validationManager.ts` — response: **422** → toast global.

### Composable de auth (`src/uses/auth.ts`)
`login(email,password)` → `POST auth/login`; `logout` → `POST auth/logout`; `register(FormData)` →
`POST auth/register`; `forgotPassword(email)` → `POST auth/forgot-password`; `changePassword(data)` →
`POST auth/reset-password`; `emailAvailable(email)` → `POST users/email-available`.

### Router (`src/router/index.ts`)
Guard global `beforeEach`: si `route.meta.auth && !ApiToken.isSet()` → redirige a `login`. Rutas de
auth: `/login`, `/registro`, `/recuperar-contrasena`, `/cambiar-contrasena/:token`, `/perfil`,
`/perfil/contrasena`. (Nota: rutas `classifieds` usan `meta.requiresAuth`, que el guard **no** lee.)

### Perfil (`src/uses/profile.ts`, `src/views/profile/Profile.vue`)
`useProfile().get()` devuelve `User.get()` (localStorage, **no** pega a la API). `update(data)` →
`PUT profile` y re-guarda con `User.set(response.data.data)`. `password(data)` → `PUT profile/password`.
Profile.vue editaba firstname/lastname/**email**/phone/**type_id** (6 opciones) y foto.

### Gate de inscripción (ORIGINAL)
100% **por-recurso**, server-driven. No usa el `user`. `src/views/activities/Detail.vue`:
`canEnrollNow()` combina `workshop.can_enroll / is_enrolled / is_full / is_ended / registration_closed`.
`src/views/courses/Detail.vue`: `course.can_enroll / is_enrolled`. Este gate por-recurso **se mantiene**;
el gate por-usuario (`can_operate`) se suma encima.

---

## 3. Qué cambia (resumen del contrato nuevo)

| Área | Antes | Ahora |
|---|---|---|
| Login | email + password | **DNI** + password; manejar `409 pending` (reenviar/cambiar mail) y `422` credenciales |
| Registro | wizard email-first, todos los datos, 6 tipos | **DNI-first** con `check-dni` → ramas **A / B / dispute**; verificación por mail |
| Tipos | 6 (incl. Alumno 1/3) | **4**: 2 Graduado UBA · 4 Otra universidad · 6 Título en trámite · 5 Otros |
| Datos personales | en el registro | **post-verificación** (`profile_complete`), `PUT profile` |
| Validación de tipo | inexistente | `type_validation_status` (null/1/2/3) + documento (type 4) + pantalla + badges |
| Gate inscripción | solo por-recurso | + gate por-usuario `can_operate` / `operability_issue` |
| Reset password | por email, pantalla in-app | por **DNI**; el reset se completa en **página web del backend** (se quita in-app) |
| email-available | usado en registro | **eliminado** |

### `UserResource` (campos que orquestan estados)
`id, email (solo lectura), firstname, lastname, fullname, phone, type_id, thumb, profile_complete,
can_operate, operability_issue, type_validation_status`.
- `type_validation_status`: `null` sin-registro · `1` pendiente · `2` aprobado · `3` rechazado.
- `can_operate=false` + `operability_issue=null` ⇒ el tipo simplemente no se inscribe (no es error).

---

## 3b. Refresh del estado del usuario (validación / can_operate)

**Problema:** el `type_validation_status` y `can_operate`/`operability_issue` los cambia el **admin**
desde el panel web, fuera de banda. El `user` era un snapshot de login en localStorage; sin refresh, la
app mostraba el estado congelado hasta re-loguear. El backend **no tenía** endpoint de lectura del
usuario (`/api/profile` era solo `PUT`).

**Solución:**
- Backend expone **`GET /api/profile`** → `UserResource` (agregado en el back; coordinar si cambia el path).
- `src/uses/profile.ts` → `me()` = `GET profile` + `persistUser` (actualiza localStorage y el ref reactivo).
- `src/uses/session.ts` → `refreshUser(force?)` con **throttle de 15s** (dedupe de request en vuelo);
  `force` saltea el throttle. No-op si no hay token. Errores de red silenciados (401 lo maneja `authenticate`).
- **Disparadores:**
  - Arranque + `resume` de la app (`@capacitor/app`) → `App.vue`, con `force`.
  - Entrar a pantallas de estado: `Home.vue`, `Profile.vue`, `TypeValidation.vue` (throttled).
  - Antes del gate de inscripción: `activities/Detail.vue`, `courses/Detail.vue` (throttled).

Como todo el estado que muestran badges y gate se lee de `useCurrentUser()` (reactivo), al refrescar se
recalcula solo. (La card de aviso de validación en Home se removió del diseño; el estado se ve en Perfil y
en la pantalla "Validá tu tipo".)

## 4. Decisiones de arquitectura de esta sesión

1. **Estado reactivo del usuario sin Pinia.** Nuevo `src/uses/currentUser.ts`: `ref` a nivel módulo,
   hidratado desde localStorage, con `setCurrentUser`/`clearCurrentUser`. `src/utils/user.ts` lo notifica
   en `set()`/`refresh()`. `useCurrentUser()` expone computeds: `user, profileComplete, canOperate,
   operabilityIssue, typeValidationStatus`. Los componentes viejos siguen usando `User.get()` sin cambios.
   (Se lee localStorage directo en currentUser para evitar ciclo de imports con user.ts.)
2. **Tipos centralizados.** `src/utils/userTypes.ts`: `USER_TYPES` (4), `isGraduateType` (2/4/6),
   `isOtherUniversity` (===4), `typeLabel`.
3. **Interceptor 422 acotado.** `validationManager.ts` ahora solo togglea toast si el 422 trae `errors`
   o `desc`. Los 422 "shape de campo" (login `{ dni: "..." }`) se manejan inline en la vista.
4. **baseURL ya trae `/api`** → endpoints relativos (`auth/register/check-dni`, `profile/type-validation`).

---

## 5. Endpoints del contrato (referencia rápida)

Auth (`/api/auth`, público salvo aclaración):
- `POST auth/register/check-dni` `{dni}` → `{case:"A", masked_email}` | `{case:"B"}` | `{case:"dispute", reason:"multiple"|"no_email"}`
- `POST auth/register` — A: `{dni}` → `{status:"claim_sent", masked_email}`; B: `{dni,email,password,password_confirmation,type_id[,documento multipart]}` → `{status:"verify_sent"}`; dispute → `{status:"dispute_required", reason}`; `409 {status:"account_exists"}`; `422 {errors}`
- `POST auth/register/resend` `{dni, email?}` → `{status:"sent", masked_email}` | `{status:"not_found"}`
- `POST auth/register/dispute` `{dni, contacto}` → `{status:"received"}`
- `POST auth/login` `{dni, password}` → `200 {accessToken, token_type, user}` | `422 {dni:"..."}` | `409 {pending:true, dni:"..."}`
- `POST auth/forgot-password` `{dni}` → `200` siempre. (Reset se completa en web del backend.)

Perfil (`/api`, autenticado):
- `GET profile` → `UserResource` (refresh del usuario; usado por `refreshUser()`).
- `PUT profile` `{firstname, lastname, phone?, birth_date?(YYYY-MM-DD), password?, password_confirmation?}` — DNI/email NO editables.
- `PUT profile/password`
- `POST profile/type-validation` (multipart `documento` requerido: pdf/jpg/jpeg/png/webp ≤5MB) → UserResource
- `PUT profile/type` `{type_id}` → UserResource (recalcula validación)

Páginas web servidas por el backend (links de mail, se abren en navegador):
`GET {host}/registro/verificar/{token}` · `GET {host}/registro/crear-contrasena/{token}` · `GET {host}/cambiar-contrasena/{token}?dni=...`

---

## 6. Progreso de implementación

Plan completo aprobado en `~/.claude/plans/memoized-stirring-thunder.md`. Orden en serie (auth acoplado).
**Estado: implementación completa (build + lint OK, smoke test de contrato OK).**

- [x] **1. Base transversal** — `src/utils/userTypes.ts` (nuevo), `src/uses/currentUser.ts` (nuevo),
  `src/utils/user.ts` (notifica al ref), `src/middlewares/validationManager.ts` (422 acotado).
- [x] **2. Servicios** — `auth.ts` (login DNI, `checkDni`, `resendRegistration`, `dispute`, `register`
  JSON/FormData; se quitaron `emailAvailable`/`changePassword`) y `profile.ts` (`typeValidation`,
  `changeType`, `update` acotado a firstname/lastname/phone/birth_date; helper `persistUser` normaliza
  respuesta `{data}` vs plano).
- [x] **3. Login.vue** — campo DNI, manejo 422 (credenciales inline) y 409 pending (card con
  reenviar/cambiar mail → `resendRegistration`).
- [x] **4. Wizard registro** (`Register.vue`, reescrito como máquina de estados) — `check-dni` → A/B/dispute,
  selector 4 tipos (`USER_TYPES`), documento opcional + "verificar luego" (type 4), pantallas "revisá tu
  mail" (A/B con masked_email) y disputa, manejo de `account_exists` (409).
- [x] **5. ForgotPassword** por DNI; se quitó `ChangePassword.vue` + ruta `/cambiar-contrasena/:token`.
- [x] **6. Regla de contraseña** — check de minúscula agregado en `FormPasswordValidation.vue`.
- [x] **7. Gate profile_complete** — guard en `router/index.ts` (redirige a `complete-profile` si
  `profile_complete === false`) + `CompleteProfile.vue` (nueva, `/completar-perfil`) + `Profile.vue`
  (email/dni read-only, birth_date YYYY-MM-DD via IonDatetime, tipo via `changeType`/`PUT profile/type`).
- [x] **8. Fase 2** — `TypeValidation.vue` (nueva, ruta `/validar-tipo`), `TypeValidationBadge.vue`
  (componente de badge null/1/2/3), reintento tras rechazo, cambio de tipo.
- [x] **9. Gate can_operate** — en `activities/Detail.vue` (`canEnrollNow()` + `enrollmentMessage`),
  `courses/Detail.vue` (`canEnroll` computed) y aviso en `home/Home.vue`.
- [x] **10. Limpieza** — se quitaron `email-available`/`notExists` y los tipos 1/3. `npm run lint` → 0 errores
  (solo warnings preexistentes). `npm run build` → OK.

### Verificado en esta sesión
- `npm install` + `npm run build` → compila todo (templates/imports/TS de los archivos nuevos). `npm run lint` → 0 errores.
- Smoke test contra `http://localhost:8000/api` (backend local levantado): `check-dni` DNI nuevo → `{case:"B"}`;
  `login` DNI inexistente → `422 {dni:"..."}`; `register` sin campos → `422 {errors:{email,password,type_id}}`;
  `forgot-password` → `200`. Shapes coinciden con lo que asume el front.

### Pendiente de test manual (requiere navegador / datos del padrón)
Caso A (DNI del padrón → claim_sent + masked_email), 409 pending en login (requiere registro sin confirmar),
verificación de mail end-to-end, subida de documento (multipart), y gate `can_operate` con un usuario real.

---

## 7. Cómo verificar (end-to-end contra `http://localhost:8000/api`)

Requiere el backend local corriendo. `npm run serve` y probar:
Login 422 (DNI inexistente, sin toast espurio) · Login 409 pending (reenviar/cambiar mail) ·
Registro Caso B (verify_sent → confirmar en web → login) · Caso B tipo 4 (documento vs "verificar luego") ·
Caso A (claim_sent + masked_email + "no tengo acceso" → disputa) · dispute · profile_complete=false →
`/completar-perfil` · Fase 2 (badge En revisión / Rechazado + reenviar) · gate can_operate en inscripción.
Cerrar con `npm run lint`.
