import { parseApiDate } from '@/libs/dates'

// Las actividades de una oferta/período llegan del backend en el orden en que
// fueron publicadas, no en el que arrancan. En la vista del usuario eso se lee
// como una lista desordenada, así que ordenamos por fecha de inicio.
//
// Reglas:
// - `start` se parsea con parseApiDate (la API mezcla DD/MM/YYYY, d-m-Y e ISO).
// - Las actividades sin fecha válida van al final: no se puede ubicarlas en la
//   línea de tiempo y no deberían tapar a las que sí tienen fecha.
// - El sort es estable, así que los empates conservan el orden del backend.
export function sortByStartDate<T extends { start?: string | null }>(
  activities: T[],
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  const factor = direction === 'desc' ? -1 : 1

  return [...activities].sort((a, b) => {
    const dateA = parseApiDate(a?.start)
    const dateB = parseApiDate(b?.start)

    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1

    return (dateA.getTime() - dateB.getTime()) * factor
  })
}
