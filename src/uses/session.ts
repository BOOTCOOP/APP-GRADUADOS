import ApiToken from "@/utils/apitoken";
import { useProfile } from "@/uses/profile";

// Refresca el UserResource desde el backend (GET /api/profile) y actualiza el
// estado reactivo (via persistUser → User.set → currentUser). Sirve para traer
// cambios que ocurren fuera de banda: type_validation_status / can_operate que el
// admin aprueba o rechaza desde el panel web.
//
// Throttle: evitamos pegar en cada navegación. `force` saltea el throttle (lo usa
// el arranque/resume de la app, donde sí queremos el dato más fresco).

const MIN_INTERVAL_MS = 15000;
let lastRefresh = 0;
let inFlight: Promise<any> | null = null;

export function refreshUser(force = false): Promise<any> {
  if (!ApiToken.isSet()) return Promise.resolve(null);

  const now = Date.now();
  if (!force && now - lastRefresh < MIN_INTERVAL_MS) return Promise.resolve(null);
  if (inFlight) return inFlight;

  lastRefresh = now;
  inFlight = useProfile()
    .me()
    // Silenciamos errores de red; un 401 lo maneja el interceptor `authenticate`.
    .catch(() => null)
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}
