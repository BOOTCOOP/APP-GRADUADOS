import { safeRedirect } from '@/uses/requireAuth'

// El spec original del scaffold apuntaba a FolderPage.vue (ya inexistente).
// Testeamos safeRedirect: la validación de ?redirect= que protege el login.
describe('safeRedirect', () => {
  it('acepta paths internos', () => {
    expect(safeRedirect('/courses/1')).toBe('/courses/1')
    expect(safeRedirect('/')).toBe('/')
  })

  it('rechaza URLs absolutas y protocol-relative', () => {
    expect(safeRedirect('https://evil.com')).toBeNull()
    expect(safeRedirect('//evil.com')).toBeNull()
    expect(safeRedirect('/x?u=https://evil.com')).toBeNull()
  })

  it('rechaza valores que no son string', () => {
    expect(safeRedirect(undefined)).toBeNull()
    expect(safeRedirect(['/a', '/b'])).toBeNull()
  })
})
