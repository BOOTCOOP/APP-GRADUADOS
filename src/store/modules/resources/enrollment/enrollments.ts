import axios from '@/libs/axios'
import type { CartItem, CartItemType } from '@/uses/enrollmentCart'

interface FailedItem {
  type: CartItemType
  id: number
  title: string | null
  reason: string
}

// Inscripción de a uno con los endpoints que existen desde siempre. Es el plan B
// cuando la API todavía no tiene `enrollments/batch` deployado.
function endpointFor(item: CartItem): string {
  return item.type === 'workshop'
    ? `workshops/${item.id}/enroll`
    : `courses/${item.id}/enroll`
}

async function enrollOneByOne(items: CartItem[]) {
  const enrolled: unknown[] = []
  const failed: FailedItem[] = []

  for (const item of items) {
    try {
      const response = await axios.post(endpointFor(item))
      enrolled.push(response.data.data)
    } catch (error: any) {
      // 422 = motivo de negocio (sin cupo, cerrado, etc.); cualquier otra cosa
      // se reporta igual, porque el lote no debe cortarse por un ítem.
      failed.push({
        type: item.type,
        id: item.id,
        title: item.title ?? null,
        reason:
          error?.response?.data?.message ??
          'No pudimos completar esta inscripción.',
      })
    }
  }

  return { enrolled, failed }
}

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // Inscripción múltiple ("mi selección"). Responde siempre { enrolled, failed }:
    // un ítem sin cupo no tumba a los demás, así que el llamador tiene que mirar
    // `failed` y no sólo el catch.
    //
    // Recibe los ítems completos del carrito (con título) porque el plan B los
    // necesita para poder explicar qué falló.
    async batch(ctx: unknown, items: CartItem[]) {
      const payload = items.map(({ type, id }) => ({ type, id }))

      try {
        return await axios.post(`enrollments/batch`, { items: payload })
      } catch (error: any) {
        // 404 = la API deployada todavía no tiene el endpoint batch. En vez de
        // dejar el botón muerto, se inscribe de a uno con los endpoints viejos.
        // Se pierde el mail único de resumen (llega uno por taller), no la
        // inscripción. Cuando la API se actualice, este camino deja de usarse.
        if (error?.response?.status !== 404) throw error

        return { data: await enrollOneByOne(items) }
      }
    },
  },
}
