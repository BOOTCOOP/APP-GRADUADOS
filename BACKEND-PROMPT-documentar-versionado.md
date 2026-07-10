# Prompt para el agente del backend (API Graduados — Laravel)

> El sistema de force update quedó implementado y probado end-to-end el 2026-07-10 (fase 1). Este prompt pide **documentar en el repo del backend** lo que ya existe, para que futuras sesiones/devs del backend lo tengan en cuenta. Podés borrar este archivo después de usarlo.

---

El endpoint `GET /api/app/config` ya está implementado, verificado en producción y consumido por la app móvil (Ionic/Capacitor). Falta dejarlo documentado en el repo del backend. La app depende de él para el force update: los cambios que lo rompan bloquean o des-bloquean usuarios sin querer.

## Lo que se necesita

### 1. Documentar el endpoint y sus reglas de operación

Agregar al lugar donde documenten la API (README, docs/, o donde corresponda) una sección que cubra:

**Contrato** (no cambiar sin coordinar con la app):

```
GET /api/app/config   — público, sin auth, siempre 200, siempre JSON

{
  "data": {
    "min_version": "1.1.0",       // semver x.y.z — versión NATIVA mínima de la app
    "latest_version": "1.1.0",    // informativo
    "store_urls": {
      "android": "https://play.google.com/store/apps/details?id=ar.uba.derecho.graduados",
      "ios": "https://apps.apple.com/ar/app/<pendiente>"
    },
    "message": null               // texto custom opcional para el alert de la app
  }
}
```

**Administración** (valores en `config/app_version.php`, se operan por `.env` del server sin deploy):
`APP_MIN_VERSION`, `APP_LATEST_VERSION`, `APP_STORE_URL_ANDROID`, `APP_STORE_URL_IOS`, `APP_UPDATE_MESSAGE`. Tras cambiar el `.env`: `php artisan optimize:clear` (o `config:clear`) si la config está cacheada.

**Reglas de operación de `APP_MIN_VERSION`** (las importantes):
- Compara contra la **versión nativa** de la app instalada (la del APK/tienda, header `X-App-Version` o `App.getInfo()`), NO contra la versión del bundle OTA.
- Es una **palanca de emergencia**: subirla bloquea con un alert no descartable a TODOS los usuarios con versión menor, hasta que instalen desde la tienda. No es parte del ciclo normal de actualización de la app (eso lo cubre el OTA del lado del frontend).
- **Nunca** setearla por encima de la última versión disponible en las tiendas: se bloquearía a usuarios sin darles una versión que instalar.
- El endpoint debe seguir siendo público y responder 200 SIEMPRE (sin auth, sin rate-limit agresivo, excluido de cualquier middleware de versión futuro): si falla, la app lo ignora en silencio y el force update no actúa.

### 2. Preservar la spec de la fase 2 (middleware 426 — EN ESPERA)

Está acordada pero NO implementada, a propósito; requiere confirmación explícita del equipo de la app antes de activarse. Documentarla como pendiente con esta spec:

- Middleware global de la API: si la request trae header `X-App-Version` (la app ya lo envía en todas las requests) y es `< APP_MIN_VERSION` → responder `426 Upgrade Required` con el mismo shape `{ "data": { min_version, latest_version, store_urls, message } }`.
- Requests **sin** el header pasan normal (clientes web, curl, versiones viejas de la app que no lo mandaban).
- `GET /api/app/config` queda **excluido** (siempre 200).
- El frontend ya maneja el 426 (alert bloqueante, deduplicado). No activar sin aviso.

### 3. Pendiente operativo

- Cargar la URL definitiva de la ficha de iOS en `APP_STORE_URL_IOS` cuando exista (la de Android ya está: id `ar.uba.derecho.graduados`).

## Cómo verificar

```bash
# Siempre 200 público con el shape exacto:
curl -H "Accept: application/json" https://<host>/api/app/config

# Tras cambiar APP_MIN_VERSION en .env + optimize:clear, el valor nuevo se refleja:
curl -H "Accept: application/json" https://<host>/api/app/config | grep min_version
```
