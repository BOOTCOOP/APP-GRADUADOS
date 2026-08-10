import { teachersLabel } from '@/utils/teachers'

describe('teachersLabel', () => {
  it('usa el singular con uno solo y el plural con varios', () => {
    expect(teachersLabel(1, 'Teresa Salvatierra')).toBe('Expone')
    expect(teachersLabel(2, 'Teresa Salvatierra, Juan Pérez')).toBe('Exponen')
  })

  it('cae en singular cuando no hay expositores cargados', () => {
    expect(teachersLabel(0, '')).toBe('Expone')
    expect(teachersLabel(undefined, undefined)).toBe('Expone')
  })

  // El listado recorta `teachers` a 22 caracteres: si contáramos comas ahí,
  // dos expositores con nombres largos quedarían como uno solo.
  it('prioriza el conteo del backend sobre el texto recortado', () => {
    expect(teachersLabel(2, 'Teresa Salvatierra ...')).toBe('Exponen')
  })

  it('sin conteo, deduce por comas (respuestas viejas de la API)', () => {
    expect(teachersLabel(null, 'Teresa Salvatierra, Juan Pérez')).toBe('Exponen')
    expect(teachersLabel(null, 'Teresa Salvatierra')).toBe('Expone')
  })
})
