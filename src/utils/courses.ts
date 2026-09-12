import { parseApiDate } from '@/libs/dates'

/**
 * Los cursos se cargan con una numeración al principio del nombre
 * ("02 - Prestaciones del Régimen Previsional") y ese es el orden en que el
 * Centro espera verlos: 1, 2, 3…
 *
 * El orden correcto lo resuelve la API (CourseDataProvider ordena por ese mismo
 * prefijo). Esto lo replica del lado del cliente para que el listado se vea
 * ordenado aunque la instancia de la API que responde sea una vieja: mientras
 * producción no tenga ese cambio deployado, el backend sigue devolviendo por
 * `inicio` desc (11, 12, 09, 02…). Cuando la API ya viene ordenada, este sort
 * no cambia nada.
 */
export function courseNumber(title?: string | null): number | null {
  const match = /^\s*(\d+)/.exec(title ?? '')

  return match ? Number(match[1]) : null
}

/**
 * Reglas (las mismas que el ORDER BY del backend):
 * - Por el número del prefijo, ascendente.
 * - Los cursos sin numeración van al final, no encabezando la lista.
 * - Empates (y cursos sin número entre sí) se desempatan por fecha de inicio
 *   ascendente; sin fecha válida, se conserva el orden del backend (el sort de
 *   JS es estable).
 */
export function sortByCourseNumber<T extends { title?: string | null; start?: string | null }>(
  courses: T[]
): T[] {
  return [...courses].sort((a, b) => {
    const numberA = courseNumber(a?.title)
    const numberB = courseNumber(b?.title)

    if (numberA !== numberB) {
      if (numberA === null) return 1
      if (numberB === null) return -1

      return numberA - numberB
    }

    const dateA = parseApiDate(a?.start)
    const dateB = parseApiDate(b?.start)

    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1

    return dateA.getTime() - dateB.getTime()
  })
}
