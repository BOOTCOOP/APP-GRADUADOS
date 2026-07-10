// La API devuelve fechas en varios formatos según el endpoint/fase de
// migración: DD/MM/YYYY, d-m-Y (guiones) e ISO YYYY-MM-DD. new Date() de JS
// no entiende día-primero, así que centralizamos el parseo acá.
export function parseApiDate(value?: string | null): Date | null {
  if (!value) return null

  const parts = value.split(/[/-]/)
  let date: Date

  if (parts.length === 3) {
    if (parts[0].length === 4) {
      // Año primero (ISO): YYYY-MM-DD
      date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
    } else {
      // Día primero: DD/MM/YYYY o DD-MM-YYYY
      date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
    }
  } else {
    date = new Date(value)
  }

  return isNaN(date.getTime()) ? null : date
}
