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
  /** Solo ítems locales: al tocarla se ejecuta esto en vez de navegar. */
  action?: () => void
}

const serverItems = ref<AppNotification[]>([])
/**
 * Ítems generados por la propia app, no por la API (hoy: la actualización OTA
 * pendiente). Viven en una lista aparte por dos razones: fetchAll() pisa la
 * lista del servidor entera, y sus ids no existen en el backend, así que no
 * deben viajar en `notifications/markAsRead`.
 */
const localItems = ref<AppNotification[]>([])

/** Lista que consume la UI: las locales primero (una actualización pendiente
 *  importa más que cualquier novedad de contenido). */
const items = computed(() => [...localItems.value, ...serverItems.value])

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
        serverItems.value = extractList(response)
      })
      .catch(() => {
        serverItems.value = []
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

    // Al backend solo van los ids que él conoce: los locales no existen allá.
    const serverIds = ids.filter((id) => serverItems.value.some((n) => n?.id === id))

    if (!store || !serverIds.length) return Promise.resolve()

    return store.dispatch('notifications/markAsRead', { ids: serverIds }).catch(() => {
      /* si falla, el próximo fetch vuelve a traer el estado real del servidor */
    })
  }

  function markAllAsRead() {
    const ids = items.value
      .filter((n) => n && n.id !== undefined && !n.read)
      .map((n) => n.id as number | string)

    return markAsRead(ids)
  }

  /**
   * Publica (o reemplaza, por id) una notificación local. `action` define qué
   * pasa al tocarla en el panel, en lugar de la navegación por tipo/link.
   */
  function setLocalNotification(notification: AppNotification & { id: string }) {
    localItems.value = [
      notification,
      ...localItems.value.filter((n) => n.id !== notification.id),
    ]
  }

  function removeLocalNotification(id: string) {
    localItems.value = localItems.value.filter((n) => n.id !== id)
  }

  /**
   * Se llama al cerrar sesión para no dejar notificaciones de otro usuario.
   * Las locales sobreviven a propósito: no son datos del usuario (ej. la
   * actualización OTA pendiente sigue pendiente para quien entre después).
   */
  function reset() {
    serverItems.value = []
    loaded.value = false
  }

  return {
    items,
    loading,
    loaded,
    unreadCount,
    fetchAll,
    markAsRead,
    markAllAsRead,
    setLocalNotification,
    removeLocalNotification,
    reset,
  }
}
