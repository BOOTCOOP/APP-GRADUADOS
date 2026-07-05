# Integración con api-graduados — Validación de tipo de usuario (Fase 2)

> Continuación de [integracion-registro.md](integracion-registro.md) (Fase 1: registro/login).
> Contrato para adaptar la APP a la **validación del tipo de usuario** del backend.
> Escrito desde la implementación real (backend migrado y probado). El detalle de
> pantallas Vue/Ionic lo define la sesión que implemente en la APP.

## Modelo mental

- El **tipo** (categoría) del usuario es uno de 4: `2` Graduado UBA, `4` Graduado otra universidad, `6` Título en trámite, `5` Otros. Se declara en el registro (buena fe).
- La **validación** de ese tipo es un eje aparte, con estado: **aprobado / pendiente / rechazado / sin-registro**. Viene en `UserResource.type_validation_status`.
- El usuario **puede inscribirse igual** mientras la validación no esté **rechazada** (pendiente y sin-registro también dejan inscribirse). Solo **rechazado** bloquea. `Otros` siempre cuenta como aprobado (sin privilegios).
- **Documento**: solo el "Graduado de otra universidad" adjunta comprobante. UBA y Título en trámite los valida el admin sin documento. La aprobación/rechazo **solo notifica** al usuario cuando es "otra universidad".

### Cómo queda el estado según el tipo (al terminar el registro)

| Tipo declarado | Documento | `type_validation_status` inicial |
|---|---|---|
| Graduado UBA | no requiere | `null` sin-registro |
| Título en trámite | no requiere | `null` sin-registro |
| Graduado otra universidad | subió documento | `1` pendiente |
| Graduado otra universidad | "verificar luego" (sin doc) | `null` sin-registro |
| Otros | — | `2` aprobado |

> **Solo el "graduado de otra universidad con documento" genera una entrada de validación pendiente** (el admin tiene que revisar el documento). UBA y Título en trámite **no generan entrada**: quedan `null` (sin-registro) y el admin los valida "por única vez" desde el panel; recién ahí queda una entrada **aprobada**. Diferenciación: `null` = no chequeado todavía, `2` = ya validado, `3` = rechazado. En todos los casos, mientras no esté **rechazado** el usuario puede inscribirse.

Un usuario que se registró reclamando un DNI del padrón legacy (Caso A de la Fase 1) también queda **sin-registro** hasta que el admin lo valide (o suba documento si es otra universidad).

## `UserResource` — campos relevantes (Fase 2)

Se agrega a lo de la Fase 1:

```json
{
  "type_id": 4,
  "type_validation_status": 1,   // null=sin-registro, 1=pendiente, 2=aprobado, 3=rechazado
  "can_operate": true,           // false si rechazado / perfil incompleto / inscripto en baja
  "operability_issue": null      // p.ej. "La validación de tu tipo de usuario fue rechazada. Contactá a administración."
}
```

- Usar `type_validation_status` para mostrar el estado (badge "En revisión" / "Verificado" / "Rechazado" / "Sin verificar").
- Seguir usando `can_operate` / `operability_issue` para el gate de inscripción (Fase 1). Ahora `rechazado` es uno de los motivos de `can_operate=false`.

## Endpoints (Fase 2)

Todos autenticados (`Authorization: Bearer {accessToken}`), bajo `/api`.

### 1. Documento opcional en el registro (extiende Fase 1)
`POST /api/auth/register` (Caso B) acepta, **además** de `email`/`password`/`type_id`, un file opcional:

- Campo: `documento` (multipart) — `pdf, jpg, jpeg, png, webp`, máx 5 MB.
- Solo se usa si `type_id = 4` (otra universidad). Si se envía → al verificar el mail queda la validación **pendiente** con el documento. Si no se envía (checkbox "verificar luego") → queda **sin-registro** y se sube después con el endpoint de abajo.

### 2. Subir documento / pedir validación (post-login)
`POST /api/profile/type-validation`

- Campo: `documento` (multipart, requerido) — mismas reglas de archivo.
- Crea la validación **pendiente** para el tipo actual del usuario, con el documento adjunto. Es el "verificar luego" del otra-universidad y también el **reintento tras un rechazo**.
- Respuesta: `UserResource` actualizado.

### 3. Cambiar el tipo declarado
`PUT /api/profile/type`

- Body: `{ "type_id": 2 | 4 | 6 | 5 }`.
- Cambia el tipo y **recalcula** la validación: si el usuario ya tuvo ese tipo **aprobado** antes, se recupera solo (sin re-trámite); UBA/Título quedan pendientes; otra universidad queda sin-registro (hay que subir el documento con el endpoint 2); Otros queda aprobado.
- Respuesta: `UserResource` actualizado.

> Nota: DNI y email siguen sin editarse desde el perfil (Fase 1). El tipo sí, por este endpoint dedicado.

## Flujo en la APP (resumen)

```
REGISTRO (paso 2, Caso B): email + password + tipo
  └─ si tipo = Graduado otra universidad:
       ├─ [Adjuntar documento] → se manda en `documento`
       └─ [Verificar luego] (checkbox) → no se manda documento

POST-LOGIN (según type_validation_status):
  - null (sin-registro) + tipo graduado → pantalla "Validá tu tipo":
      · otra universidad → subir documento → POST /profile/type-validation
      · UBA / título en trámite → (no hay acción del usuario; lo valida el admin)
  - 1 pendiente  → badge "En revisión" (puede inscribirse igual)
  - 2 aprobado   → badge "Verificado"
  - 3 rechazado  → badge "Rechazado" + acción "Volver a enviar" (otra universidad → POST /profile/type-validation con nuevo documento)

CAMBIO DE TIPO (opcional, desde perfil): PUT /api/profile/type
```

## Pantallas a tocar en la APP (checklist Fase 2)

- [ ] **Registro paso 2**: para "otra universidad", file picker de documento + checkbox "verificar luego". Mandar `documento` solo si adjuntó.
- [ ] **Pantalla "Validá tu tipo"** (post-login) cuando `type_validation_status === null` y el tipo es graduado: subir documento (otra universidad) → `POST /profile/type-validation`.
- [ ] **Badge de estado de validación** en perfil/home según `type_validation_status`.
- [ ] **Reintento tras rechazo** (`=== 3`): permitir re-enviar documento (otra universidad).
- [ ] **Gate de inscripción**: seguir usando `can_operate` / `operability_issue` (rechazado ahora bloquea).
- [ ] **(Opcional) Cambio de tipo**: `PUT /api/profile/type`.

## Notas

- La cola de validaciones y el aprobar/rechazar los maneja el **admin** (panel web), no la APP.
- El backend está migrado y probado (smoke end-to-end). Los endpoints y estados de arriba son los reales.
