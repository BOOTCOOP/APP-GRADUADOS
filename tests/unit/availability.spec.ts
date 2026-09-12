import { isDisabledByAdmin } from '@/utils/availability'

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
