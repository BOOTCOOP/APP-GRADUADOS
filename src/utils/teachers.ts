/**
 * Leyenda de quienes dictan una actividad ("Expone" / "Exponen").
 *
 * El backend manda `teachers` ya unido ("Juan Pérez, María Gómez") y
 * `teachers_count` con cuántos son. El conteo manda: en el listado el texto
 * viene recortado a 22 caracteres, así que contar comas ahí miente. El
 * recuento por comas queda solo como respaldo para respuestas viejas de la
 * API que todavía no mandan `teachers_count`.
 */
export function teachersLabel(
  count?: number | null,
  teachers?: string | null
): 'Expone' | 'Exponen' {
  const total = typeof count === 'number' ? count : countFromText(teachers)

  return total > 1 ? 'Exponen' : 'Expone'
}

function countFromText(teachers?: string | null): number {
  return (teachers ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean).length
}
