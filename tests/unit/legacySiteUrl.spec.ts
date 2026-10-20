import { describe, it, expect } from 'vitest'
import { legacySiteUrl } from '@/uses/externalLinks'

// Links del cuerpo de las noticias: vienen del sitio de la Facultad, que los
// escribe relativos a su <base href="https://www.derecho.uba.ar">.
describe('legacySiteUrl', () => {
  it('resuelve los relativos de las notas contra el sitio de la Facultad', () => {
    expect(legacySiteUrl('../empleos/')).toBe('https://www.derecho.uba.ar/empleos/')
    expect(legacySiteUrl('institucional/autoridades')).toBe('https://www.derecho.uba.ar/institucional/autoridades')
    expect(legacySiteUrl(' /noticias ')).toBe('https://www.derecho.uba.ar/noticias')
  })

  it('deja pasar absolutos, mailto y tel', () => {
    expect(legacySiteUrl('https://www.youtube.com/watch?v=abc')).toBe('https://www.youtube.com/watch?v=abc')
    expect(legacySiteUrl('mailto:graduados@derecho.uba.ar')).toBe('mailto:graduados@derecho.uba.ar')
    expect(legacySiteUrl('tel:+541152877023')).toBe('tel:+541152877023')
  })
})
