# Prompt para el agente del backend (API Graduados — Laravel)

> Archivo generado desde el refactor del frontend "app pública por defecto". Pasale este prompt al agente que trabaja en el backend. Podés borrar este archivo después de usarlo.

---

La app de graduados (frontend Ionic/Vue) está pasando a ser **pública por defecto**: cualquier persona sin sesión puede navegar el catálogo de cursos, talleres, noticias, etc. El login queda solo para acciones puntuales (inscribirse, historiales, perfil, beneficios, búsqueda laboral, avisos, quizzes).

Hoy la API rechaza requests anónimas en TODOS los endpoints. Verificado el 2026-07-09 con `curl -H "Accept: application/json"` (sin `Authorization`): los endpoints listados abajo devuelven **401**. Además, sin el header `Accept: application/json` devuelven **500** con página HTML "Server Error" — típico de Laravel cuando el middleware `auth` intenta `redirect()->route('login')` y la ruta web `login` no existe. Eso también convendría corregirlo (que la API siempre responda JSON 401).

## Lo que se necesita

### 1. Hacer estos endpoints accesibles SIN token (auth opcional)

| Método | Endpoint | Uso en la app |
|---|---|---|
| GET | `slider/home` | Banner de la home pública |
| GET | `courses` | Listado público de cursos (con paginación/filtros actuales) |
| GET | `courses/{id}` | Detalle público de un curso |
| GET | `workshops` | Listado público de talleres/jornadas |
| GET | `workshops/{id}` | Detalle público de un taller |
| GET | `feeds` | Listado público de noticias |
| GET | `feeds/{slug}` | Detalle público de una noticia |
| GET | `interests` | Información de interés (listado) |
| GET | `interests/{slug}` | Información de interés (detalle) |
| GET | `bibliographies` | Material bibliográfico (listado) |
| GET | `bibliographies/{id}` | Material bibliográfico (detalle) |

**Auth OPCIONAL, no eliminada**: si la request trae un Bearer token válido, el usuario debe seguir resolviéndose (en Laravel/Sanctum: sacar el middleware `auth` de estas rutas y resolver el usuario con el guard opcional, p. ej. `auth('sanctum')->user()` o middleware propio de "optional auth"). Esto importa porque los serializers de cursos/talleres devuelven campos que dependen del usuario.

### 2. Campos dependientes del usuario en los serializers de `courses` y `workshops`

El frontend usa `is_enrolled`, `can_enroll` y `price` en el detalle. Comportamiento requerido:

- **Con token válido**: igual que hoy (`is_enrolled` y `can_enroll` reales del usuario).
- **Sin token (anónimo)**: los campos deben seguir existiendo con defaults seguros: `is_enrolled: false`, `can_enroll: true` (o el valor que corresponda por cupo/fechas, pero sin depender del usuario). No omitir los campos ni tirar error al serializar con usuario null.

### 3. Lo que NO debe cambiar (seguir exigiendo token, 401 si no hay)

`courses/own`, `courses/history`, `courses/{id}/enroll`, `courses/{id}/pre-enroll`, `workshops/own`, `workshops/history`, `workshops/{id}/enroll|pre-enroll|unenroll`, `inscriptions/*`, `jobs/*` (todo), `benefits/*`, `avisos/*`, `quizzes/*` y `quiz-responses`, `notifications/*`, `profile/*`, `app/images/upload`. Es decir: **solo se abren los 11 GET de la tabla**, todo lo demás queda como está.

### 4. Corrección del 500 en respuestas no autenticadas

Para requests a `api/*` sin `Accept: application/json`, hoy un 401 se convierte en 500 HTML. Ajustar el handler de excepciones (o `Authenticate::redirectTo`) para que las rutas API devuelvan siempre `401 JSON` en vez de intentar redirigir a una ruta `login` inexistente.

## Cómo verificar

```bash
# Deben devolver 200 con el JSON de siempre:
curl -H "Accept: application/json" https://<host>/api/courses
curl -H "Accept: application/json" https://<host>/api/courses/<id>
# ... ídem workshops, feeds, interests, bibliographies, slider/home

# Con token válido deben devolver lo mismo que hoy (is_enrolled real):
curl -H "Accept: application/json" -H "Authorization: Bearer <token>" https://<host>/api/courses/<id>

# Deben seguir devolviendo 401 sin token:
curl -H "Accept: application/json" https://<host>/api/courses/own
curl -H "Accept: application/json" -X POST https://<host>/api/courses/<id>/enroll
```

Nota: el frontend nuevo ya **no** envía `Authorization: Bearer null` cuando no hay sesión (se corrigió), pero si un cliente viejo lo manda, idealmente tratarlo como anónimo en los endpoints públicos en vez de 401.
