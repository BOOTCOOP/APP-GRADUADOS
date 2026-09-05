import { MAX_CART_ITEMS, useEnrollmentCart } from '@/uses/enrollmentCart'
import type { CartItem } from '@/uses/enrollmentCart'

const taller = (id: number): CartItem => ({
  type: 'workshop',
  id,
  title: `Taller ${id}`,
})

describe('useEnrollmentCart', () => {
  // El estado es un ref a nivel de módulo (compartido, como currentUser):
  // cada test arranca de cero.
  beforeEach(() => {
    useEnrollmentCart().clear()
  })

  it('agrega, detecta y quita ítems por tipo + id', () => {
    const { add, has, remove, count } = useEnrollmentCart()

    add(taller(1))
    add({ type: 'course', id: 1, title: 'Curso 1' })

    // Mismo id, distinto tipo: son dos ítems distintos.
    expect(count.value).toBe(2)
    expect(has('workshop', 1)).toBe(true)
    expect(has('course', 1)).toBe(true)

    remove('workshop', 1)

    expect(has('workshop', 1)).toBe(false)
    expect(has('course', 1)).toBe(true)
  })

  it('no duplica un ítem ya seleccionado', () => {
    const { add, count } = useEnrollmentCart()

    add(taller(7))
    add(taller(7))

    expect(count.value).toBe(1)
  })

  it('compara ids numéricos y strings como el mismo ítem', () => {
    const { add, has, remove, count } = useEnrollmentCart()

    add({ ...taller(3), id: '3' as unknown as number })

    expect(has('workshop', 3)).toBe(true)

    remove('workshop', '3')

    expect(count.value).toBe(0)
  })

  it('toggle devuelve true/false al entrar y salir, y null si está en el tope', () => {
    const { add, toggle, count } = useEnrollmentCart()

    expect(toggle(taller(1))).toBe(true)
    expect(toggle(taller(1))).toBe(false)

    for (let id = 1; id <= MAX_CART_ITEMS; id++) add(taller(id))

    expect(count.value).toBe(MAX_CART_ITEMS)
    // Uno más no entra: el tope es el mismo que acepta la API.
    expect(toggle(taller(999))).toBeNull()
    // Pero sacar uno que ya está sigue funcionando.
    expect(toggle(taller(1))).toBe(false)
  })

  it('refresh actualiza el snapshot guardado sin tocar los demás ítems', () => {
    const { add, refresh, items } = useEnrollmentCart()

    add(taller(1))
    add(taller(2))

    refresh('workshop', 2, { title: 'Título nuevo', start: '2026-09-01' })

    expect(items.value[0].title).toBe('Taller 1')
    expect(items.value[1]).toMatchObject({
      id: 2,
      title: 'Título nuevo',
      start: '2026-09-01',
    })
  })

  it('ignora un refresh de algo que no está en la selección', () => {
    const { add, refresh, items } = useEnrollmentCart()

    add(taller(1))
    refresh('course', 1, { title: 'No existe' })

    expect(items.value).toHaveLength(1)
    expect(items.value[0].title).toBe('Taller 1')
  })
})
