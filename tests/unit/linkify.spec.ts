import { hasLinks, linkify } from '@/utils/linkify'

describe('linkify', () => {
  it('deja el texto sin URLs como un solo segmento', () => {
    expect(linkify('20% de descuento')).toEqual([
      { type: 'text', value: '20% de descuento' },
    ])
  })

  it('detecta una URL con esquema y la deja lista para abrir', () => {
    const segments = linkify('Ingresá a https://legal.thomsonreuters.com/ar y registrate')

    expect(segments).toEqual([
      { type: 'text', value: 'Ingresá a ' },
      {
        type: 'link',
        value: 'https://legal.thomsonreuters.com/ar',
        href: 'https://legal.thomsonreuters.com/ar',
      },
      { type: 'text', value: ' y registrate' },
    ])
  })

  it('le agrega esquema a las que arrancan con www', () => {
    const [link] = linkify('www.ejemplo.com')

    expect(link).toEqual({
      type: 'link',
      value: 'www.ejemplo.com',
      href: 'https://www.ejemplo.com',
    })
  })

  it('no se lleva la puntuación que cierra la oración', () => {
    const segments = linkify('Entrá a www.ejemplo.com.')

    expect(segments).toEqual([
      { type: 'text', value: 'Entrá a ' },
      { type: 'link', value: 'www.ejemplo.com', href: 'https://www.ejemplo.com' },
      { type: 'text', value: '.' },
    ])
  })

  it('detecta varias URLs en el mismo texto', () => {
    const links = linkify('http://uno.com y http://dos.com').filter((s) => s.type === 'link')

    expect(links.map((s) => s.value)).toEqual(['http://uno.com', 'http://dos.com'])
  })

  it('tolera vacío y null', () => {
    expect(linkify('')).toEqual([])
    expect(linkify(null)).toEqual([])
    expect(linkify(undefined)).toEqual([])
  })

  it('hasLinks distingue texto con y sin URL', () => {
    expect(hasLinks('visitá www.ejemplo.com')).toBe(true)
    expect(hasLinks('sin links acá')).toBe(false)
  })
})
