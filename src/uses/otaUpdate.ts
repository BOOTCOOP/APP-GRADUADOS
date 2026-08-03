import { readonly, ref } from "vue";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { CapacitorUpdater } from "@capgo/capacitor-updater";
import type { BundleInfo } from "@capgo/capacitor-updater";
import { compareVersions } from "@/utils/semver";

// Actualizaciones OTA self-hosted con @capgo/capacitor-updater en modo manual.
//
// El manifiesto (public/ota/latest.json, servido por GitHub Pages) declara la
// última versión de bundle publicada. Hay tres caminos:
//
// - Chequeo automático (checkOtaUpdate): si hay versión nueva, se descarga y se
//   marca con next() — se aplica en el próximo arranque en frío (NO usamos set()
//   para no interrumpir al usuario en medio de una sesión).
// - Toast "Versión X disponible" (pendingOtaUpdate + applyPendingOtaUpdate):
//   cuando el chequeo automático deja un bundle programado, App.vue lo ofrece
//   con un botón "Actualizar" que lo aplica con set() al instante. El toque del
//   usuario es lo que hace aceptable interrumpir la sesión.
// - Búsqueda manual (applyOtaUpdateNow, botón "Buscar actualizaciones" del menú):
//   mismo criterio — el usuario pidió actualizar, así que set() inmediato.
//
// Los dos atajos con set() importan sobre todo en iOS, donde no hay "forzar
// cierre" a mano y el sistema puede mantener el proceso vivo por días.

const MANIFEST_URL =
  import.meta.env.VITE_OTA_MANIFEST_URL ||
  "https://bootcoop.github.io/APP-GRADUADOS/ota/latest.json";

// Throttle: con un chequeo por hora alcanza; `force` lo saltea (arranque/resume).
const MIN_INTERVAL_MS = 60 * 60 * 1000;
let lastCheck = 0;
let inFlight: Promise<void> | null = null;

// Bundle nuevo ya descargado y programado con next() para el próximo arranque
// en frío. App.vue lo observa para ofrecer aplicarlo ya mismo con un toast
// "Versión X disponible — Actualizar". Solo lo muta este módulo.
const pendingUpdate = ref<{ version: string } | null>(null);
export const pendingOtaUpdate = readonly(pendingUpdate);

interface Manifest {
  version: string;
  url: string;
  min_native_version?: string;
}

type ManifestEvaluation =
  | { status: "up-to-date" }
  // El bundle nuevo exige un shell nativo más nuevo: solo se resuelve por tienda.
  | { status: "native-outdated" }
  | { status: "available"; manifest: Manifest };

export type ManualUpdateResult =
  | { status: "unsupported" } // web: Pages ya sirve siempre la última versión
  | { status: "up-to-date" }
  | { status: "native-outdated" }
  // Bundle nuevo aplicado con set(): la WebView se recarga inmediatamente, así
  // que en la práctica el caller no llega a hacer nada con este resultado.
  | { status: "applying"; version: string };

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

// Búsqueda manual de actualizaciones. A diferencia del chequeo automático, NO
// es silenciosa (los errores se propagan para que la UI avise) y aplica el
// bundle con set() ya mismo. `onDownloadStart` permite avisar al usuario antes
// de la descarga, que puede tardar unos segundos.
export async function applyOtaUpdateNow(
  onDownloadStart?: (version: string) => void
): Promise<ManualUpdateResult> {
  if (!Capacitor.isNativePlatform()) return { status: "unsupported" };

  // Si el chequeo automático está descargando en este momento, esperarlo para
  // no bajar el mismo zip dos veces (sus errores ya se tragan en checkOtaUpdate).
  if (inFlight) await inFlight;

  const evaluation = await evaluateManifest();
  if (evaluation.status !== "available") return evaluation;

  onDownloadStart?.(evaluation.manifest.version);
  const bundle = await getOrDownloadBundle(evaluation.manifest);

  // set() recarga la WebView con el bundle nuevo inmediatamente: después de
  // esta línea el código actual deja de ejecutarse.
  await CapacitorUpdater.set(bundle);
  return { status: "applying", version: evaluation.manifest.version };
}

async function doCheck(): Promise<void> {
  const evaluation = await evaluateManifest();
  if (evaluation.status !== "available") {
    pendingUpdate.value = null;
    return;
  }

  const bundle = await getOrDownloadBundle(evaluation.manifest);

  // next(): se aplica en el próximo arranque en frío (no interrumpe la sesión).
  await CapacitorUpdater.next(bundle);

  // Solo mutar si la versión cambió: re-asignar el mismo valor en cada resume
  // re-dispararía el watcher de App.vue y duplicaría el toast.
  if (pendingUpdate.value?.version !== evaluation.manifest.version)
    pendingUpdate.value = { version: evaluation.manifest.version };
}

// Aplica ya mismo el bundle pendiente (lo dispara el botón "Actualizar" del
// toast). No toca la red: el bundle ya se descargó; set() recarga la WebView.
export async function applyPendingOtaUpdate(): Promise<void> {
  const pending = pendingUpdate.value;
  if (!pending) return;

  const { bundles } = await CapacitorUpdater.list();
  const bundle = bundles.find(
    (b) => b.version === pending.version && b.status === "success"
  );

  // Raro (el plugin borró el bundle, p. ej. por rollback): rearrancar el ciclo.
  if (!bundle) {
    pendingUpdate.value = null;
    checkOtaUpdate(true);
    return;
  }

  await CapacitorUpdater.set(bundle);
}

async function evaluateManifest(): Promise<ManifestEvaluation> {
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
    if (compareVersions(nativeVersion, manifest.min_native_version) < 0)
      return { status: "native-outdated" };
  }

  // Versión del bundle actual. Si corre el bundle embebido ('builtin'), el
  // plugin no conoce la versión: usamos la del build (inyectada por vite.config.ts).
  const cur = await CapacitorUpdater.current();
  const actual =
    cur.bundle.id === "builtin" || !cur.bundle.version
      ? import.meta.env.VITE_APP_VERSION
      : cur.bundle.version;

  if (compareVersions(manifest.version, actual) <= 0)
    return { status: "up-to-date" };

  return { status: "available", manifest };
}

// Reusa un bundle ya descargado si existe (típico: el chequeo automático lo
// bajó y lo dejó como next(), pero la app nunca tuvo un arranque en frío).
async function getOrDownloadBundle(manifest: Manifest): Promise<BundleInfo> {
  const { bundles } = await CapacitorUpdater.list();
  const existing = bundles.find(
    (b) => b.version === manifest.version && b.status === "success"
  );
  if (existing) return existing;

  return CapacitorUpdater.download({
    url: manifest.url,
    version: manifest.version,
  });
}
