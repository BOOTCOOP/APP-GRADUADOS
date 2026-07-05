<template>
  <graduados-app :hideFabButton="true">
    <template #header-end>
      <ion-menu-button menu="notification-content" color="primary">
        <ion-icon
          :md="notificationsOutline"
          :ios="notificationsOutline"
        ></ion-icon>
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

// Home es la pantalla de entrada: refrescamos el estado del usuario (validación /
// can_operate) para mantener badges y gate al día.
onMounted(() => refreshUser());
</script>

<style scoped>
ion-menu-button.ios ion-icon {
  font-size: 24px;
}
</style>
