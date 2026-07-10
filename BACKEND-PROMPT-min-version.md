# Prompt para el agente del backend (API Graduados — Laravel)

> Archivo generado desde la implementación del force update (versión mínima) en el frontend. Pasale este prompt al agente que trabaja en el backend. Podés borrar este archivo después de usarlo.

---

La app de graduados (frontend Ionic/Vue) sale a las tiendas (Google Play / App Store) y necesita un mecanismo de **force update**: si la versión instalada es menor a una versión mínima administrable, la app muestra un alert bloqueante que solo permite ir a la tienda a actualizar. El frontend ya está implementado: al arrancar y en cada `resume` consulta `GET /api/app/config`, compara versiones semver y bloquea si corresponde. Si el endpoint no existe o falla, el chequeo se silencia (la app nunca se bloquea por error), así que se puede desplegar en cualquier orden.

## Lo que se necesita

### 1. Endpoint nuevo: `GET /api/app/config` (público, sin auth)

| Método | Endpoint | Auth | Uso en la app |
|---|---|---|---|
| GET | `app/config` | Ninguna (público) | Chequeo de versión mínima al arrancar y al volver a primer plano |

Respuesta esperada (formato exacto):

```json
{
  "data": {
    "min_version": "1.1.0",
    "latest_version": "1.1.0",
    "store_urls": {
      "android": "https://play.google.com/store/apps/details?id=<APP_ID>",
      "ios": "https://apps.apple.com/ar/app/<APP_ID>"
    },
    "message": null
  }
}
```

- `min_version` / `latest_version`: semver `x.y.z`.
- `store_urls.android` / `store_urls.ios`: URLs de la ficha de la app en cada tienda (el frontend abre la que corresponde según plataforma).
- `message`: texto opcional para el alert bloqueante; si viene `null` el frontend usa un default en español.
- **Los valores deben ser administrables** por config (`config/app_version.php` + `.env`) o por DB — **NO hardcodeados en el controller** — para poder subir `min_version` sin deployar código.

### 2. Opcional (fase 2): middleware de `X-App-Version` → `426 Upgrade Required`

El frontend **YA envía** el header `X-App-Version` con la versión instalada en **todas** las requests desde builds nativas (en web no se envía). Como red de seguridad, se puede agregar un middleware que:

- Lea `X-App-Version` y, si es **menor** a `min_version`, responda `426 Upgrade Required` con JSON (idealmente el mismo shape de `data` de arriba, para que el frontend pueda mostrar `message` y `store_urls`).
- Si el header no viene (web, clientes viejos, curl), **dejar pasar** la request normalmente.
- **NO aplicarlo a `GET /api/app/config`**: ese endpoint debe responder 200 siempre, es el que la app consulta para enterarse de la versión mínima.

El frontend ya maneja el 426: muestra el mismo alert bloqueante y deduplica si fallan N requests a la vez. Esta fase es opcional: con el punto 1 alcanza para salir.

## Cómo verificar

```bash
# Debe devolver 200 SIN token, con el formato exacto de arriba:
curl -H "Accept: application/json" https://<host>/api/app/config
# → {"data":{"min_version":"1.1.0","latest_version":"1.1.0","store_urls":{"android":"...","ios":"..."},"message":null}}

# Con token también debe funcionar igual (no debe romper por auth):
curl -H "Accept: application/json" -H "Authorization: Bearer <token>" https://<host>/api/app/config

# Si se implementa la fase 2 (middleware 426):
# Versión menor a min_version → 426 con JSON:
curl -H "Accept: application/json" -H "X-App-Version: 0.0.1" https://<host>/api/courses
# Versión igual o mayor, o sin header → comportamiento normal (200/401 según endpoint):
curl -H "Accept: application/json" -H "X-App-Version: 9.9.9" https://<host>/api/courses
curl -H "Accept: application/json" https://<host>/api/courses
# El propio app/config NUNCA debe dar 426:
curl -H "Accept: application/json" -H "X-App-Version: 0.0.1" https://<host>/api/app/config
```
