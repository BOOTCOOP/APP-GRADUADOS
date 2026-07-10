import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import store from "@/store";
import { compareVersions } from "@/utils/semver";

// Force update (versión mínima): consulta GET /api/app/config y, si la versión
// instalada es menor a min_version, muestra un alert BLOQUEANTE que solo ofrece
// ir a la tienda. Cualquier error de red/backend se silencia: la app jamás se
// bloquea por un fallo del chequeo.
//
// Throttle: evitamos pegar en cada resume. `force` saltea el throttle (lo usa
// el arranque de la app, donde sí queremos el dato más fresco).

const MIN_INTERVAL_MS = 30 * 60 * 1000;
let lastCheck = 0;
let inFlight: Promise<void> | null = null;

// Una vez mostrado el alert bloqueante no tiene sentido volver a chequear
// (ni apilar alerts si N requests devuelven 426).
let blocked = false;

interface ForceUpdateConfig {
  message?: string;
  store_urls?: { android?: string; ios?: string };
}

// Muestra el alert bloqueante de actualización. Compartida con el middleware
// forceUpdate (respuesta 426). Deduplicada vía flag módulo-level `blocked`.
export function showForceUpdateAlert(config: ForceUpdateConfig = {}): void {
  if (blocked) return;
  blocked = true;

  store.dispatch("ui/alert/blocking", {
    header: "Actualización requerida",
    message: config.message || "Tu versión de la app ya no es compatible. Actualizala para seguir usándola.",
    buttonText: "Actualizar",
    handler: () => {
      const urls = config.store_urls || {};
      const url = Capacitor.getPlatform() === "ios" ? urls.ios : urls.android;
      if (url) window.open(url, "_system");
    },
  });
}

export function checkMinVersion(force = false): Promise<void> {
  // Solo aplica a builds nativas: en web no hay tienda que forzar.
  if (!Capacitor.isNativePlatform()) return Promise.resolve();
  if (blocked) return Promise.resolve();

  const now = Date.now();
  if (!force && now - lastCheck < MIN_INTERVAL_MS) return Promise.resolve();
  if (inFlight) return inFlight;

  lastCheck = now;
  inFlight = store
    .dispatch("appVersion/fetch")
    .then(async (response) => {
      const config = response?.data || {};
      if (!config.min_version) return;

      const { version } = await App.getInfo();
      if (compareVersions(version, config.min_version) < 0) {
        showForceUpdateAlert(config);
      }
    })
    // Silencioso: si el endpoint todavía no existe (404) o falla la red,
    // la app sigue funcionando normal.
    .catch(() => undefined)
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}
