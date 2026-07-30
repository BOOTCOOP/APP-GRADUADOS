/**
 * Estado compartido de notificaciones.
 *
 * Antes la lista vivía dentro de Notifications.vue, así que nadie más podía
 * saber cuántas había sin leer: la campana del inicio no mostraba contador y el
 * usuario tenía que abrir el panel para descubrir si había algo nuevo.
 *
 * El store de Vuex sigue siendo el repositorio HTTP (`notifications/fetchAll`,
 * `notifications/markAsRead`); esto es solo la capa reactiva compartida encima,
 * igual que hace `currentUser.ts` con la sesión.
 */
import { computed, ref } from 'vue'
import type { Store } from 'vuex'

export interface AppNotification {
  id?: number | string
  subject?: string
  title?: string
  message?: string
  content?: string
  type?: string
  priority?: 'high' | 'medium' | 'low'
  link?: string
  read?: boolean
  created_at?: string
  date?: string
}

const items = ref<AppNotification[]>([])
const loading = ref(false)
/** `true` una vez que terminó el primer fetch: distingue "vacío" de "cargando". */
const loaded = ref(false)

const unreadCount = computed(() => items.value.filter((n) => !n?.read).length)

/**
 * La respuesta de la API llegó históricamente en dos formas (`data.data` y
 * `data`), así que normalizamos en un solo lugar en vez de repetir el chequeo.
 */
function extractList(response: any): AppNotification[] {
  if (Array.isArray(response?.data?.data)) return response.data.data
  if (Array.isArray(response?.data)) return response.data
  return []
}

export function useNotifications(store?: Store<any>) {
  function fetchAll() {
    if (!store) return Promise.resolve()

    loading.value = true

    return store
      .dispatch('notifications/fetchAll')
      .then((response: any) => {
        items.value = extractList(response)
      })
      .catch(() => {
        items.value = []
      })
      .finally(() => {
        loading.value = false
        loaded.value = true
      })
  }

  /** Marca como leídas y avisa al backend. Optimista: la UI no espera la red. */
  function markAsRead(ids: Array<number | string>) {
    if (!ids.length) return Promise.resolve()

    items.value.forEach((n) => {
      if (n?.id !== undefined && ids.includes(n.id)) n.read = true
    })

    if (!store) return Promise.resolve()

    return store.dispatch('notifications/markAsRead', { ids }).catch(() => {
      /* si falla, el próximo fetch vuelve a traer el estado real del servidor */
    })
  }

  function markAllAsRead() {
    const ids = items.value
      .filter((n) => n && n.id !== undefined && !n.read)
      .map((n) => n.id as number | string)

    return markAsRead(ids)
  }

  /** Se llama al cerrar sesión para no dejar notificaciones de otro usuario. */
  function reset() {
    items.value = []
    loaded.value = false
  }

  return { items, loading, loaded, unreadCount, fetchAll, markAsRead, markAllAsRead, reset }
}
