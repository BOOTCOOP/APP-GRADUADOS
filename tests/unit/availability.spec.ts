import { hasStarted, isDisabledByAdmin } from '@/utils/availability'

describe('isDisabledByAdmin', () => {
  it('toma is_enabled cuando la API lo expone', () => {
    expect(isDisabledByAdmin({ is_enabled: false })).toBe(true)
    expect(isDisabledByAdmin({ is_enabled: true, can_enroll: false })).toBe(false)
  })

  // El caso del reporte: taller apagado desde el Administrador, servido por una
  // API que todavía no manda is_enabled.
  it('lo deduce de can_enroll cuando no hay is_enabled', () => {
    expect(
      isDisabledByAdmin({
        can_enroll: false,
        is_enrolled: false,
        is_ended: false,
        is_full: false,
        registration_closed: false,
      })
    ).toBe(true)
  })

  it('no confunde con los motivos que tienen su propia etiqueta', () => {
    expect(isDisabledByAdmin({ can_enroll: false, is_ended: true })).toBe(false)
    expect(isDisabledByAdmin({ can_enroll: false, is_full: true })).toBe(false)
    expect(isDisabledByAdmin({ can_enroll: false, registration_closed: true })).toBe(false)
    expect(isDisabledByAdmin({ can_enroll: false, is_enrolled: true })).toBe(false)
    expect(isDisabledByAdmin({ can_enroll: false, requires_diploma: true })).toBe(false)
  })

  it('no marca el catálogo entero cuando el bloqueo es de la cuenta', () => {
    expect(isDisabledByAdmin({ can_enroll: false }, { userCanOperate: false })).toBe(false)
    expect(isDisabledByAdmin({ can_enroll: false }, { userCanOperate: true })).toBe(true)
  })

  it('trata los flags ausentes como disponible (API vieja por OTA)', () => {
    expect(isDisabledByAdmin({})).toBe(false)
    expect(isDisabledByAdmin({ can_enroll: true })).toBe(false)
    expect(isDisabledByAdmin(null)).toBe(false)
    expect(isDisabledByAdmin(undefined)).toBe(false)
  })
})

describe('hasStarted', () => {
  // El caso del reporte: curso 575 "10 - Uniones convivenciales". Empezó el
  // 28-08-2026 y al 12-09 seguía llegando con can_enroll: true, porque su
  // ventana de inscripción es la del período "Agosto 2026" (14-08 → 23-09) y
  // su `fin` (18-09) todavía no pasó.
  const hoy = new Date(2026, 8, 12) // 12-09-2026

  it('detecta un curso que ya tuvo su primera clase', () => {
    expect(hasStarted('28-08-2026', hoy)).toBe(true)
  })

  it('no bloquea uno que empieza hoy', () => {
    expect(hasStarted('12-09-2026', hoy)).toBe(false)
  })

  it('no bloquea uno por comenzar', () => {
    expect(hasStarted('08/10/2026', hoy)).toBe(false)
  })

  it('acepta los dos formatos que manda la API', () => {
    // cursos: d-m-Y · talleres: DD/MM/YYYY · ISO en algunos endpoints
    expect(hasStarted('28-08-2026', hoy)).toBe(true)
    expect(hasStarted('28/08/2026', hoy)).toBe(true)
    expect(hasStarted('2026-08-28', hoy)).toBe(true)
  })

  // Un dato faltante no puede sacar el curso de circulación.
  it('trata la fecha ausente o invalida como no comenzado', () => {
    expect(hasStarted(undefined, hoy)).toBe(false)
    expect(hasStarted(null, hoy)).toBe(false)
    expect(hasStarted('', hoy)).toBe(false)
    expect(hasStarted('0000-00-00', hoy)).toBe(false)
  })

  it('compara por dia, no por hora: un inicio de ayer cuenta aunque sean las 00:05', () => {
    expect(hasStarted('11-09-2026', new Date(2026, 8, 12, 0, 5))).toBe(true)
  })
})
