# Integración con api-graduados — Registro / Login (Paso 1)

> Contrato para adaptar la APP al nuevo onboarding del backend (`api-graduados`, feature "registro/login").
> Escrito desde la implementación real del backend (ya migrado y probado). Este documento es el brief
> para el refactor de la APP; el detalle de pantallas Vue/Ionic lo define la sesión que implemente acá.
>
> **➡️ Continúa en la Fase 2:** [integracion-tipo-usuario.md](integracion-tipo-usuario.md) — validación del tipo de usuario (documento de otra universidad, estados de validación, endpoints `profile/type-validation` y `profile/type`). Leer este documento primero (identidad) y después el de la Fase 2 (privilegios).

## Qué cambió en el backend (modelo mental)

- **Login por DNI**, ya no por email. El **email vive solo en el legacy** (padrón de inscriptos); la app no lo usa como identidad.
- **Registro con verificación real por mail.** La cuenta (`users`) se crea **recién cuando el usuario confirma el mail**. Antes de eso solo existe un "registro pendiente".
- **Registro por pasos, DNI primero.** Según si el DNI ya existe en el padrón legacy, el flujo se bifurca:
  - **Caso A — el DNI ya está en el padrón:** se manda un link al **mail que figura en el legacy** (no se pide mail ni contraseña en la app). El usuario crea su contraseña desde ese link. Prueba de identidad.
  - **Caso B — DNI nuevo:** se pide email + contraseña + tipo; se manda link de verificación al mail tipeado. Al confirmarlo se crea la cuenta y su ficha legacy mínima.
  - **Caso dispute — DNI duplicado o sin mail en el padrón:** no se puede resolver solo; el usuario debe contactar a administración.
- **Tipos de usuario: 4** (antes la app ofrecía 6). Ver tabla abajo.
- **Perfil:** los datos personales viven en el legacy. Tras verificar (Caso B), el perfil arranca incompleto y hay que completarlo antes de poder inscribirse.

## Tipos de usuario (selector de registro)

Solo estos 4 valores de `type_id` son válidos al registrarse:

| `type_id` | Etiqueta sugerida |
|---|---|
| `2` | Graduado UBA |
| `4` | Graduado de otra universidad |
| `6` | Título en trámite (UBA) |
| `5` | Otros |

> Quitar del selector viejo las opciones "Alumno UBA" y "Alumno otra universidad". La *validación* del tipo (documentación, aprobación del admin) es del **Paso 2**, todavía no implementada; por ahora el tipo se declara y listo.

---

## Endpoints

Base: host de la API (`VUE_APP_API_URL`). Los de auth cuelgan de `/api/auth`, los de perfil/inscripción de `/api`.

### 1. `POST /api/auth/register/check-dni`
Paso 1 del wizard. Read-only, sin efectos. Sirve para saber a qué rama ir.

**Request:** `{ "dni": "30111222" }`

**Response 200:**
```json
{ "case": "A", "masked_email": "l****@d***.com.ar" }   // Caso A
{ "case": "B" }                                          // Caso B (DNI nuevo)
{ "case": "dispute", "reason": "multiple" }              // reason: "multiple" | "no_email"
```

### 2. `POST /api/auth/register`
Inicia el registro. El backend re-evalúa el caso; la app manda los campos según lo que devolvió `check-dni`.

**Request Caso A:** `{ "dni": "30111222" }`
**Request Caso B:** `{ "dni": "40999888", "email": "...", "password": "...", "password_confirmation": "...", "type_id": 2 }`

**Responses:**
```json
// Caso A
200 { "status": "claim_sent", "masked_email": "l****@d***.com.ar" }
// Caso B
200 { "status": "verify_sent" }
// Caso dispute (DNI duplicado o sin mail en legacy)
200 { "status": "dispute_required", "reason": "multiple" | "no_email" }
// Ya existe una cuenta para ese DNI
409 { "status": "account_exists" }
// Validación (Caso B con campos faltantes/ inválidos, o dni mal formado)
422 { "message": "...", "errors": { "email": [...], "password": [...], "type_id": [...] } }
```

Password: mínimo 8, con mayúscula, minúscula y número (`password_confirmation` requerido).

### 3. `POST /api/auth/register/resend`
Reenvía el link del registro pendiente. Permite **cambiar el mail** (solo Caso B). Se usa desde el login cuando la cuenta está "sin confirmar".

**Request:** `{ "dni": "40999888", "email": "nuevo@mail.com" }` (`email` opcional)
**Response 200:** `{ "status": "sent", "masked_email": "..." }` | `{ "status": "not_found" }`

### 4. `POST /api/auth/register/dispute`
Registra una disputa de DNI para resolución manual del admin (Caso dispute, o Caso A cuando el usuario perdió acceso al mail legacy).

**Request:** `{ "dni": "30111222", "contacto": "texto libre (mail/teléfono alternativo)" }`
**Response 200:** `{ "status": "received" }`

### 5. `POST /api/auth/login`
**Request:** `{ "dni": "30111222", "password": "..." }`

**Responses:**
```json
200 { "accessToken": "...", "token_type": "Bearer", "user": { ...UserResource } }
// Credenciales incorrectas (DNI inexistente o password mala) — mismo código para ambos
422 { "dni": "Las credenciales no coinciden con nuestros registros" }
// Hay un registro sin confirmar para ese DNI
409 { "pending": true, "dni": "Tenés un registro sin confirmar. Revisá tu correo o pedí reenviar el enlace." }
```
Ante el `409 pending`: ofrecer botón **"Reenviar"** / **"Cambiar mail"** → `POST /api/auth/register/resend`.

El token se usa igual que hoy: header `Authorization: Bearer {accessToken}`.

### 6. `POST /api/auth/forgot-password` y `POST /api/auth/reset-password`
Reset **por DNI** (el link se manda al mail del legacy).

- `forgot-password` → **Request:** `{ "dni": "30111222" }` — **Response 200** siempre (no revela si el DNI existe).
- `reset-password` → **Request:** `{ "dni": "...", "token": "...", "password": "...", "password_confirmation": "..." }` — **200** ok / **422** token inválido o validación.

### 7. Perfil (post-login)
- `PUT /api/profile` (auth) — **Request:** `{ "firstname": "...", "lastname": "...", "phone": "...", "birth_date": "YYYY-MM-DD", "password": "...", "password_confirmation": "..." }`. `firstname` y `lastname` requeridos; el resto opcional. Persiste en el legacy. **DNI y email NO se editan** desde el perfil.
- `PUT /api/profile/password` — cambio de contraseña autenticado (como hoy).

---

## Páginas web servidas por el backend (links del mail)

Los links de los mails abren páginas **HTML del backend** (no de la app). La app solo tiene que decirle al usuario "revisá tu correo"; el usuario completa en el navegador y después vuelve a la app a loguearse.

- **Caso B — verificar:** `GET {host}/registro/verificar/{token}` → confirma y activa la cuenta.
- **Caso A — crear contraseña:** `GET {host}/registro/crear-contrasena/{token}` → formulario; al enviarlo activa la cuenta.
- **Reset:** `GET {host}/cambiar-contrasena/{token}?dni=...` → formulario de nueva contraseña.

> (Más adelante se puede evaluar deep-linking para volver a la app automáticamente; por ahora es flujo por navegador.)

---

## `UserResource` (campos que orquestan estados)

Viene en `login` (dentro de `user`) y en las respuestas de perfil:

```json
{
  "id": 1,
  "email": "persona@uba.ar",        // resuelto del legacy (solo lectura)
  "firstname": "Ana",
  "lastname": "Pérez",
  "fullname": "Ana Pérez",
  "phone": "...",
  "type_id": 2,
  "thumb": "https://.../avatar.jpg",
  "profile_complete": false,         // false => falta completar datos personales (nombre/apellido)
  "can_operate": false,              // puede inscribirse ahora
  "operability_issue": "Completá tus datos personales para poder inscribirte."  // motivo o null
}
```

- **`profile_complete === false`** → rutear a la pantalla "Completá tus datos" y bloquear inscripciones hasta completarlo.
- **`can_operate` / `operability_issue`** → controlar el botón de inscripción y mostrar el motivo (perfil incompleto, inscripción en baja, etc.). `can_operate === false` con `operability_issue === null` = el tipo simplemente no se inscribe (no es un error a resolver).

---

## Flujo de la app (resumen)

```
LOGIN (nuevo): DNI + contraseña
  ├─ 200 → guardar token + user, ir a home
  ├─ 422 → "credenciales incorrectas"
  └─ 409 pending → "registro sin confirmar" + [Reenviar] / [Cambiar mail] (register/resend)

REGISTRO (wizard):
  Paso 1: DNI → check-dni
    ├─ case B → Paso 2: email + password + type_id → register → "Revisá tu mail para confirmar"
    ├─ case A → register (solo dni) → "Ya existe una cuenta, te enviamos un mail a l****@d***.com.ar"
    │            + link "No tengo acceso a ese mail" → register/dispute
    └─ case dispute → "Contactá a administración" (+ opcional register/dispute con contacto)

VERIFICACIÓN: el usuario abre el link del mail en el navegador (páginas del backend) y vuelve a loguearse.

POST-LOGIN:
  profile_complete === false → pantalla "Completá tus datos" → PUT /api/profile → recargar user

RESET: forgot-password (DNI) → link al mail → cambiar-contrasena (web)
```

## Pantallas a tocar en la APP (checklist)

- [ ] **Login**: campo email → **DNI**. Manejar `422` (credenciales) y `409 pending` (reenviar/cambiar mail).
- [ ] **Wizard de registro**: Paso 1 DNI (`check-dni`) → ramas A / B / dispute. Estado del wizard **local** (si se cierra la app, vuelve al paso 1).
- [ ] **Selector de tipo**: dejar 4 opciones (2/4/6/5). Quitar Alumno UBA / Alumno otra universidad.
- [ ] **Pantallas "revisá tu mail"** (A y B) con el `masked_email`.
- [ ] **Pantalla de disputa** (contacto) → `register/dispute`.
- [ ] **Completar perfil** post-verificación (cuando `profile_complete === false`) → `PUT /api/profile`.
- [ ] **Gate de inscripción** por `can_operate` / `operability_issue`.
- [ ] **Reset de contraseña por DNI** (`forgot-password`).
- [ ] Quitar el uso viejo de `email-available` en el registro (ahora el flujo es DNI-first con `check-dni`).

## Notas

- El documento/diploma para "Graduado de otra universidad" y la validación de tipo son del **Paso 2** (no implementado aún). Por ahora el tipo se declara sin adjuntar nada.
- El backend está migrado y probado (smoke tests end-to-end). Los endpoints de arriba son los reales.
