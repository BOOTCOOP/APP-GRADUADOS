/**
 * Flags de disponibilidad que mandan los resources de talleres y cursos. Todos
 * opcionales a propósito: la app se distribuye por OTA y puede quedar corriendo
 * contra una API que todavía no expone alguno.
 */
export interface AvailabilityFlags {
  is_enabled?: boolean
  is_enrolled?: boolean
  is_ended?: boolean
  is_full?: boolean
  registration_closed?: boolean
  can_enroll?: boolean
  requires_diploma?: boolean
}

/**
 * ¿El taller/curso está apagado desde el Administrador?
 *
 * La señal directa es `is_enabled`, pero no siempre llega: la API la expone en
 * los resources (d117d90) y producción todavía sirve una versión anterior, así
 * que hoy el campo viene ausente y todo chequeo sobre él da "disponible".
 *
 * Lo que producción sí manda es `can_enroll`, y del lado del servidor ese flag
 * ya contempla el estado del recurso — `EnrollmentChecker::canEnroll()` llama a
 * `isEnabled()` desde ae59d80, bastante antes de la versión deployada. Entonces
 * un `can_enroll` en false SIN ninguno de los motivos visibles (finalizado, sin
 * cupo, inscripciones cerradas, ya inscripto, falta el título) sólo puede ser
 * eso: el admin lo apagó.
 *
 * `userCanOperate` queda afuera de esa deducción: `canEnroll()` también devuelve
 * false cuando el usuario no puede operar, y ahí el problema es la cuenta y no
 * el taller — sin este corte, un usuario bloqueado vería el catálogo entero
 * marcado como "No disponible".
 *
 * Se compara `=== false` y no `!`: undefined tiene que seguir contando como
 * disponible en vez de bloquear el catálogo entero.
 */
export function isDisabledByAdmin(
  resource: AvailabilityFlags | null | undefined,
  options: { userCanOperate?: boolean } = {}
): boolean {
  if (!resource) return false

  // Si la API expone el flag, manda él y no hace falta deducir nada.
  if (resource.is_enabled !== undefined) return resource.is_enabled === false

  // Sin `can_enroll` explícito en false no hay nada que deducir.
  if (resource.can_enroll !== false) return false

  // El gate es del usuario, no del recurso.
  if (options.userCanOperate === false) return false

  // `can_enroll` se apaga por alguno de estos motivos, que tienen su propia
  // etiqueta: no hay que leerlos como "deshabilitado".
  if (resource.is_enrolled) return false
  if (resource.requires_diploma) return false
  if (resource.is_ended) return false
  if (resource.is_full) return false
  if (resource.registration_closed) return false

  return true
}
