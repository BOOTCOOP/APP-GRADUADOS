<template>
  <ion-menu
    @ionDidOpen="onOpen"
    :swipeGesture="false"
    side="end"
    content-id="main-content"
    type="overlay"
    menu-id="notification-content"
    class="notifications-menu"
  >
    <ion-header class="ion-no-border">
      <ion-toolbar class="notifications-toolbar">
        <ion-buttons slot="start">
          <ion-button
            fill="clear"
            color="dark"
            aria-label="Cerrar notificaciones"
            @click="close"
          >
            <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>

        <ion-title>
          <span class="toolbar-title">Notificaciones</span>
        </ion-title>

        <ion-buttons slot="end">
          <ion-button
            v-if="unreadCount > 0"
            fill="clear"
            size="small"
            class="mark-all-btn"
            aria-label="Marcar todas como leídas"
            @click="markAllAsRead"
          >
            <ion-icon slot="start" :icon="checkmarkDoneOutline"></ion-icon>
            Leer todas
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="notifications-content">
      <!-- Cargando: skeletons con la forma real de la fila, no un spinner suelto -->
      <div v-if="loading && !loaded" class="notifications-list" aria-busy="true">
        <div v-for="i in 4" :key="i" class="notification-row skeleton-row">
          <ion-skeleton-text :animated="true" class="skeleton-avatar" />
          <div class="skeleton-lines">
            <ion-skeleton-text :animated="true" style="width: 45%; height: 12px" />
            <ion-skeleton-text :animated="true" style="width: 85%; height: 14px" />
            <ion-skeleton-text :animated="true" style="width: 60%; height: 12px" />
          </div>
        </div>
      </div>

      <!-- Vacío -->
      <div v-else-if="!items.length" class="empty-state">
        <div class="empty-icon-wrap">
          <ion-icon :icon="notificationsOffOutline" aria-hidden="true"></ion-icon>
        </div>
        <h3>Todo al día</h3>
        <p>Cuando haya novedades de cursos, talleres o noticias las vas a ver acá.</p>
      </div>

      <!-- Lista -->
      <div v-else class="notifications-list">
        <p class="list-caption">
          {{ unreadCount > 0 ? `${unreadCount} sin leer` : "Sin novedades nuevas" }}
        </p>

        <button
          v-for="(item, index) in items"
          :key="item?.id ?? index"
          type="button"
          class="notification-row"
          :class="{ unread: !item?.read }"
          @click="handleNotificationClick(item)"
        >
          <span
            class="notification-avatar"
            :style="{ '--type-color': getTypeColor(item) }"
          >
            <ion-icon :icon="getNotificationIcon(item)" aria-hidden="true"></ion-icon>
          </span>

          <span class="notification-main">
            <span class="notification-top">
              <span class="notification-type" :style="{ color: getTypeColor(item) }">
                {{ getNotificationTypeLabel(item) }}
              </span>
              <span class="notification-date">{{
                formatDate(item?.created_at || item?.date)
              }}</span>
            </span>

            <span class="notification-title">
              {{ item?.subject || item?.title || "Sin título" }}
            </span>

            <span v-if="item?.message || item?.content" class="notification-text">
              {{ truncateText(item?.message || item?.content || "", 110) }}
            </span>

            <span
              v-if="item?.priority === 'high'"
              class="priority-tag"
            >
              <ion-icon :icon="alertCircleOutline" aria-hidden="true"></ion-icon>
              Importante
            </span>
          </span>

          <!-- Punto de "no leída": indicador de estado, no un botón -->
          <span v-if="!item?.read" class="unread-dot" aria-label="Sin leer"></span>
        </button>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import {
  IonMenu,
  IonContent,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonSkeletonText,
  useIonRouter,
  menuController,
} from "@ionic/vue";
import { onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import User from "@/utils/user";
import {
  checkmarkDoneOutline,
  closeOutline,
  notificationsOffOutline,
  newspaperOutline,
  calendarOutline,
  megaphoneOutline,
  schoolOutline,
  informationCircleOutline,
  alertCircleOutline,
  refreshOutline,
} from "ionicons/icons";
import { useNotifications, type AppNotification } from "@/uses/notifications";

const store = useStore();
const router = useIonRouter();

// Estado compartido: la campana del inicio lee el mismo `unreadCount`.
const { items, loading, loaded, unreadCount, fetchAll, markAsRead, markAllAsRead } =
  useNotifications(store);

onMounted(() => {
  if (User.isSet()) fetchAll();
});

/**
 * Al abrir el panel, las no leídas se marcan como leídas DESPUÉS de un momento:
 * si se marcaran al instante, el resaltado de "nuevo" desaparecería justo
 * mientras la persona lo está mirando y no llegaría a ver qué era novedad.
 *
 * A diferencia del código anterior, el timer se guarda para poder cancelarlo si
 * el panel se cierra o se desmonta antes, y solo se envían los ids que estaban
 * sin leer (antes machacaba `read = true` en todas y mandaba ids de más).
 */
let markTimer: ReturnType<typeof setTimeout> | null = null;

function onOpen() {
  if (unreadCount.value === 0) return;

  clearMarkTimer();
  markTimer = setTimeout(() => markAllAsRead(), 1500);
}

function clearMarkTimer() {
  if (markTimer) {
    clearTimeout(markTimer);
    markTimer = null;
  }
}

onUnmounted(clearMarkTimer);

function close() {
  clearMarkTimer();
  menuController.close("notification-content");
}

// ── Presentación por tipo ───────────────────────────────────────────────────
// "update" es local (la actualización OTA pendiente), no viene de la API.
type NotificationType = "news" | "workshop" | "classified" | "course" | "update" | "general";

function getType(notification?: AppNotification): NotificationType {
  const type = (notification?.type || "general") as NotificationType;
  return ["news", "workshop", "classified", "course", "update"].includes(type)
    ? type
    : "general";
}

const TYPE_META: Record<NotificationType, { label: string; color: string; icon: string }> = {
  news: { label: "Noticia", color: "#0891B2", icon: newspaperOutline },
  workshop: { label: "Taller", color: "#2563EB", icon: calendarOutline },
  classified: { label: "Aviso", color: "#D97706", icon: megaphoneOutline },
  course: { label: "Curso", color: "#7A35AB", icon: schoolOutline },
  update: { label: "Actualización", color: "#16A34A", icon: refreshOutline },
  general: { label: "General", color: "#6B6B78", icon: informationCircleOutline },
};

const getNotificationIcon = (n?: AppNotification) => TYPE_META[getType(n)].icon;
const getTypeColor = (n?: AppNotification) => TYPE_META[getType(n)].color;
const getNotificationTypeLabel = (n?: AppNotification) => TYPE_META[getType(n)].label;

const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength).trimEnd() + "…" : text;
};

/**
 * Fecha en lenguaje natural ("hace 5 min", "ayer"): en una lista de novedades
 * importa cuán reciente es, no la fecha exacta. Si la API ya manda un texto
 * relativo lo respetamos.
 */
function formatDate(dateString?: string) {
  if (!dateString) return "";
  if (typeof dateString === "string" && dateString.includes("hace")) return dateString;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);

  if (diffMinutes < 1) return "Ahora";
  if (diffMinutes < 60) return `hace ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `hace ${diffHours} h`;
  if (diffHours < 48) return "Ayer";

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `hace ${diffDays} días`;

  return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

// ── Navegación ──────────────────────────────────────────────────────────────
const ROUTE_BY_LINK: Record<string, string> = {
  "activities.index": "/talleres",
  "courses.index": "/cursos",
  "news.index": "/noticias",
  "classifieds.index": "/classifieds",
};

const ROUTE_BY_TYPE: Record<NotificationType, string> = {
  news: "/noticias",
  workshop: "/talleres",
  classified: "/classifieds",
  course: "/cursos",
  update: "/", // no se usa: las de tipo update siempre traen `action`
  general: "/",
};

async function handleNotificationClick(notification?: AppNotification) {
  if (!notification) return;

  if (!notification.read && notification.id !== undefined) {
    markAsRead([notification.id]);
  }

  await menuController.close("notification-content");

  // Las notificaciones locales traen su propia acción (ej. aplicar la
  // actualización OTA) en lugar de navegar a una sección.
  if (notification.action) {
    notification.action();
    return;
  }

  const link = notification.link;
  const target =
    (link && ROUTE_BY_LINK[link]) ||
    (link?.startsWith("/") ? link : null) ||
    ROUTE_BY_TYPE[getType(notification)];

  router.push(target);
}
</script>

<style scoped>
/* ── Panel ──────────────────────────────────────────────────────────────── */
.notifications-menu {
  --width: min(92vw, 400px);
}

.notifications-toolbar {
  --background: var(--app-surface);
  --border-width: 0;
  --min-height: 56px;
  padding-top: var(--ion-safe-area-top, 0px);
  border-bottom: 1px solid var(--app-border);
}

.toolbar-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--app-text-title);
  letter-spacing: -0.2px;
}

/* "Leer todas" con texto y no un ícono suelto: antes era un ✓✓ sin etiqueta y
   no había forma de saber qué hacía sin tocarlo. */
.mark-all-btn {
  --color: var(--ion-color-primary);
  font-size: 13px;
  font-weight: 700;
  height: var(--app-tap-target);
  --padding-start: 10px;
  --padding-end: 10px;
}

.mark-all-btn ion-icon {
  font-size: 16px;
  margin-right: 4px;
}

.notifications-content {
  --background: var(--app-bg);
  --padding-bottom: calc(var(--app-spacing-xl) + var(--ion-safe-area-bottom, 0px));
}

/* ── Lista ──────────────────────────────────────────────────────────────── */
.notifications-list {
  padding: var(--app-spacing-md) var(--app-spacing-md) 0;
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-sm);
}

.list-caption {
  margin: 0 4px var(--app-spacing-xs);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--app-text-secondary);
}

/*
 * Cada notificación es una card independiente en vez de filas de ion-item
 * pegadas con bordes: se distingue una de otra de un vistazo y el estado "no
 * leída" se puede pintar en toda la card, no solo en el label interno.
 */
.notification-row {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--app-spacing-md);
  width: 100%;
  text-align: left;
  appearance: none;
  font-family: inherit;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  box-shadow: var(--app-shadow-xs);
  padding: var(--app-spacing-md);
  /* Espacio a la derecha para que el texto no pase por debajo del punto */
  padding-right: var(--app-spacing-xl);
  cursor: pointer;
  transition: box-shadow var(--app-duration) var(--app-ease),
              transform var(--app-duration-fast) var(--app-ease);
  -webkit-tap-highlight-color: transparent;
}

.notification-row:active {
  transform: scale(0.99);
  box-shadow: none;
}

.notification-row:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}

/* No leída: fondo apenas teñido + barra de acento a la izquierda. El color no es
   el único indicador (también está el punto y el peso del título). */
.notification-row.unread {
  background: linear-gradient(
    90deg,
    var(--app-primary-soft) 0%,
    var(--app-surface) 42%
  );
  border-color: var(--app-primary-soft-strong);
}

.notification-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: color-mix(in srgb, var(--type-color) 12%, transparent);
}

.notification-avatar ion-icon {
  font-size: 20px;
  color: var(--type-color);
}

@supports not (background: color-mix(in srgb, red 10%, transparent)) {
  .notification-avatar {
    background-color: rgba(0, 0, 0, 0.06);
  }
}

.notification-main {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
}

.notification-top {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-sm);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.notification-date {
  color: var(--app-text-secondary);
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  margin-left: auto;
  flex-shrink: 0;
}

.notification-title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--app-text-title);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-text {
  font-size: 13px;
  line-height: 1.45;
  color: var(--app-text-body);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.priority-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  margin-top: 4px;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: var(--app-radius-pill);
  background: rgba(254, 61, 61, 0.10);
  color: #C62828;
}

.priority-tag ion-icon {
  font-size: 13px;
}

.unread-dot {
  position: absolute;
  top: var(--app-spacing-md);
  right: var(--app-spacing-md);
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--ion-color-primary);
  flex-shrink: 0;
}

/* ── Skeleton ───────────────────────────────────────────────────────────── */
.skeleton-row {
  cursor: default;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  margin: 0;
  flex-shrink: 0;
}

.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ── Vacío ──────────────────────────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* Centrado vertical real dentro del panel en vez de arrancar pegado arriba */
  min-height: 70vh;
  padding: var(--app-spacing-xl);
}

.empty-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--app-primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--app-spacing-lg);
}

.empty-icon-wrap ion-icon {
  font-size: 32px;
  color: var(--ion-color-primary);
}

.empty-state h3 {
  margin: 0 0 var(--app-spacing-sm);
  font-size: 18px;
  font-weight: 700;
  color: var(--app-text-title);
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--app-text-body);
  max-width: 260px;
}
</style>
