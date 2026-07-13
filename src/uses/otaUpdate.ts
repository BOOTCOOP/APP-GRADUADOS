import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { compareVersions } from "@/utils/semver";

// Actualizaciones OTA self-hosted con @capgo/capacitor-updater en modo manual.
//
// El manifiesto (public/ota/latest.json, servido por GitHub Pages) declara la
// última versión de bundle publicada. Si es más nueva que la actual, se descarga
// y se marca con next(): se aplica en el próximo arranque en frío (NO usamos
// set() para no interrumpir al usuario en medio de una sesión).

const MANIFEST_URL =
  import.meta.env.VITE_OTA_MANIFEST_URL ||
  "https://bootcoop.github.io/APP-GRADUADOS/ota/latest.json";

// Throttle: con un chequeo por hora alcanza; `force` lo saltea (arranque/resume).
const MIN_INTERVAL_MS = 60 * 60 * 1000;
let lastCheck = 0;
let inFlight: Promise<void> | null = null;

// Confirma al plugin que el bundle actual arrancó bien. Debe llamarse SIEMPRE
// al montar la app: si no se llama, el plugin asume que el bundle crasheó y
// hace rollback al anterior en el próximo arranque.
export async function notifyReady(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await CapacitorUpdater.notifyAppReady();
  } catch {
    // Silencioso: el OTA jamás debe romper el arranque.
  }
}

// Chequea el manifiesto remoto y, si hay un bundle más nuevo y compatible con
// el shell nativo, lo descarga y lo deja listo para el próximo arranque.
export function checkOtaUpdate(force = false): Promise<void> {
  if (!Capacitor.isNativePlatform()) return Promise.resolve();

  const now = Date.now();
  if (!force && now - lastCheck < MIN_INTERVAL_MS) return Promise.resolve();
  if (inFlight) return inFlight;

  lastCheck = now;
  inFlight = doCheck()
    // Silencioso: cualquier error (red, manifiesto roto, descarga) no debe
    // afectar a la app; a lo sumo queda logueado para debug.
    .catch((e) => {
      console.warn("[ota] chequeo de actualización falló:", e);
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

async function doCheck(): Promise<void> {
  // Fetch pelado (no la instancia axios del repo): es otro host y no debe
  // llevar credenciales ni interceptores. Cache-buster para saltear el CDN.
  const res = await fetch(`${MANIFEST_URL}?t=${Date.now()}`);
  if (!res.ok) throw new Error(`manifiesto HTTP ${res.status}`);

  const manifest = await res.json();

  // Validación mínima del shape antes de descargar nada.
  if (
    !manifest ||
    typeof manifest.version !== "string" ||
    !manifest.version ||
    typeof manifest.url !== "string" ||
    !manifest.url
  ) {
    throw new Error("manifiesto inválido (faltan version/url)");
  }

  // Compatibilidad nativa: si el shell instalado es más viejo que lo que exige
  // el bundle, no descargamos (el usuario tiene que actualizar por el store).
  if (manifest.min_native_version) {
    const nativeVersion = (await App.getInfo()).version;
    if (compareVersions(nativeVersion, manifest.min_native_version) < 0) return;
  }

  // Versión del bundle actual. Si corre el bundle embebido ('builtin'), el
  // plugin no conoce la versión: usamos la del build (inyectada por vite.config.ts).
  const cur = await CapacitorUpdater.current();
  const actual =
    cur.bundle.id === "builtin" || !cur.bundle.version
      ? import.meta.env.VITE_APP_VERSION
      : cur.bundle.version;

  if (compareVersions(manifest.version, actual) <= 0) return;

  const bundle = await CapacitorUpdater.download({
    url: manifest.url,
    version: manifest.version,
  });

  // next(): se aplica en el próximo arranque en frío (no interrumpe la sesión).
  await CapacitorUpdater.next(bundle);
}
