<template>
  <graduados-app :hideFabButton="true">
    <template #header-end>
      <!-- El menú de notificaciones solo se monta con sesión (App.vue) -->
      <ion-menu-button
        v-if="isLoggedIn"
        menu="notification-content"
        color="primary"
        class="bell-button"
        :aria-label="unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : 'Notificaciones'"
      >
        <ion-icon
          :md="notificationsOutline"
          :ios="notificationsOutline"
        ></ion-icon>
        <!-- Contador de no leídas: antes había que abrir el panel para saber
             si había algo nuevo. -->
        <span v-if="unreadCount > 0" class="bell-badge">
          {{ unreadCount > 9 ? "9+" : unreadCount }}
        </span>
      </ion-menu-button>
    </template>

    <Banner />

    <!-- Carrusel de Novedades/Anuncios - Listo para activar cuando se defina contenido -->
    <!-- <StoriesCarousel /> -->
    <Shortcuts />
    <!-- <Links />
    <Social /> -->
  </graduados-app>
</template>

<script setup lang="ts">
import { notificationsOutline } from "ionicons/icons";

import { IonMenuButton, IonIcon } from "@ionic/vue";
import { onMounted } from "vue";

import Banner from "./Banner.vue";
// import StoriesCarousel from "./StoriesCarousel.vue"; // Listo para activar
import Shortcuts from "./Shortcuts.vue";
// import Links from "./Links.vue";
// import Social from "./Social.vue";
import { refreshUser } from "@/uses/session";
import { useCurrentUser } from "@/uses/currentUser";
import { useNotifications } from "@/uses/notifications";

const { isLoggedIn } = useCurrentUser();
// Mismo estado que consume el panel lateral (src/uses/notifications.ts).
const { unreadCount } = useNotifications();

// Home es la pantalla de entrada: refrescamos el estado del usuario (validación /
// can_operate) para mantener badges y gate al día.
onMounted(() => refreshUser());
</script>

<style scoped>
ion-menu-button.ios ion-icon {
  font-size: 24px;
}

.bell-button {
  position: relative;
  overflow: visible;
}

.bell-badge {
  position: absolute;
  top: 4px;
  right: 2px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: var(--app-radius-pill);
  background: var(--ion-color-danger);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 17px;
  text-align: center;
  /* Anillo del color de la toolbar para que el badge se despegue del ícono */
  box-shadow: 0 0 0 2px var(--ion-toolbar-background, #fff);
  pointer-events: none;
}
</style>
