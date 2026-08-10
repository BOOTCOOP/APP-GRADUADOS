import {
  buildShareEmailBody,
  buildShareMessage,
  buildShareUrl,
} from '@/utils/shareMessage'
import { PUBLIC_WEB_URL } from '@/uses/externalLinks'

describe('buildShareUrl', () => {
  it('usa la ruta actual del router y la vuelve pública', () => {
    expect(buildShareUrl({ title: 'Mala Praxis', type: 'taller' }, '/taller/2062')).toBe(
      `${PUBLIC_WEB_URL}/taller/2062`
    )
  })

  it('prioriza url explícita, después path', () => {
    expect(
      buildShareUrl({ title: 'x', url: 'https://otro.sitio/x', path: '/curso/1' }, '/taller/2')
    ).toBe('https://otro.sitio/x')
    expect(buildShareUrl({ title: 'x', path: '/curso/1' }, '/taller/2')).toBe(
      `${PUBLIC_WEB_URL}/curso/1`
    )
  })

  it('cae al listado de la sección cuando no hay ruta del ítem', () => {
    expect(buildShareUrl({ title: 'x', type: 'curso' }, '/')).toBe(
      `${PUBLIC_WEB_URL}/cursos`
    )
    expect(buildShareUrl({ title: 'x', type: 'taller' })).toBe(
      `${PUBLIC_WEB_URL}/talleres`
    )
  })

  it('sin tipo ni ruta comparte el inicio de la app', () => {
    expect(buildShareUrl({ title: 'x' })).toBe(PUBLIC_WEB_URL)
  })
})

describe('buildShareMessage', () => {
  const url = `${PUBLIC_WEB_URL}/taller/2062`

  it('cierra con la invitación y el link en su propia línea', () => {
    const mensaje = buildShareMessage(
      { title: 'Mala Praxis', text: 'Docentes: Teresa Salvatierra', type: 'taller' },
      url
    )

    expect(mensaje).toContain('🎓 Taller: Mala Praxis')
    expect(mensaje).toContain('Docentes: Teresa Salvatierra')
    expect(mensaje.endsWith(`Mirá el detalle e inscribite acá:\n${url}`)).toBe(true)
  })

  it('omite la bajada cuando viene vacía', () => {
    const mensaje = buildShareMessage({ title: 'Mala Praxis', text: '  ', type: 'taller' }, url)

    expect(mensaje).not.toContain('\n\n\n')
    expect(mensaje).toContain(url)
  })

  it('recorta la bajada a 100 caracteres', () => {
    const mensaje = buildShareMessage({ title: 'T', text: 'a'.repeat(200), type: 'curso' }, url)

    expect(mensaje).toContain(`${'a'.repeat(97)}...`)
    expect(mensaje).not.toContain('a'.repeat(101))
  })
})

describe('buildShareEmailBody', () => {
  it('incluye el link público', () => {
    const body = buildShareEmailBody(
      { title: 'Mala Praxis', type: 'taller' },
      `${PUBLIC_WEB_URL}/taller/2062`
    )

    expect(body).toContain(`Ver más: ${PUBLIC_WEB_URL}/taller/2062`)
  })
})
