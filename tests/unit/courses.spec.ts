import { courseNumber, sortByCourseNumber } from '@/utils/courses'

describe('courseNumber', () => {
  it('lee la numeración del prefijo del nombre', () => {
    expect(courseNumber('02 - Prestaciones del Régimen Previsional')).toBe(2)
    expect(courseNumber('11 - Aspectos relevantes del régimen de bienes')).toBe(11)
  })

  it('devuelve null cuando el nombre no arranca con un número', () => {
    expect(courseNumber('Procesos de Familia')).toBeNull()
    expect(courseNumber('')).toBeNull()
    expect(courseNumber(null)).toBeNull()
  })
})

describe('sortByCourseNumber', () => {
  it('ordena por la numeración de la carga, no por fecha de inicio', () => {
    // El orden de entrada es el que devuelve producción hoy: `inicio` desc.
    const courses = [
      { title: '11 - Aspectos relevantes', start: '25-09-2026' },
      { title: '12 - Perspectivas actuales', start: '11-09-2026' },
      { title: '09 - Procesos de Familia', start: '10-09-2026' },
      { title: '02 - Prestaciones del Régimen Previsional', start: '31-08-2026' },
      { title: '01 - La ejecución de las sentencias', start: '24-08-2026' },
    ]

    expect(sortByCourseNumber(courses).map((c) => courseNumber(c.title))).toEqual([
      1, 2, 9, 11, 12,
    ])
  })

  it('manda al final los cursos sin numeración', () => {
    const courses = [
      { title: 'Taller suelto sin numerar', start: '01-08-2026' },
      { title: '03 - Estrategia y tácticas', start: '25-08-2026' },
    ]

    expect(sortByCourseNumber(courses).map((c) => c.title)).toEqual([
      '03 - Estrategia y tácticas',
      'Taller suelto sin numerar',
    ])
  })

  it('desempata por fecha de inicio ascendente', () => {
    const courses = [
      { title: '05 - Derecho concursal (comisión B)', start: '10-09-2026' },
      { title: '05 - Derecho concursal (comisión A)', start: '25-08-2026' },
    ]

    expect(sortByCourseNumber(courses).map((c) => c.start)).toEqual([
      '25-08-2026',
      '10-09-2026',
    ])
  })

  it('no muta el array recibido', () => {
    const courses = [{ title: '02 - Dos' }, { title: '01 - Uno' }]

    sortByCourseNumber(courses)

    expect(courses.map((c) => c.title)).toEqual(['02 - Dos', '01 - Uno'])
  })
})
