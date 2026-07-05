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

    <!-- Aviso de validación de tipo pendiente de acción -->
    <ion-card v-if="showValidationNotice" class="validation-notice" button @click="goToValidation">
      <ion-card-content>
        <type-validation-badge :status="typeValidationStatus" />
        <ion-text color="dark">
          <p>
            <small v-if="typeValidationStatus === 3">Tu validación fue rechazada. Tocá para volver a enviar el documento.</small>
            <small v-else>Validá tu tipo de usuario para acceder a todos los beneficios.</small>
          </p>
        </ion-text>
      </ion-card-content>
    </ion-card>

    <!-- Carrusel de Novedades/Anuncios - Listo para activar cuando se defina contenido -->
    <!-- <StoriesCarousel /> -->
    <Shortcuts />
    <!-- <Links />
    <Social /> -->
  </graduados-app>
</template>

<script setup lang="ts">
import { notificationsOutline } from "ionicons/icons";

import { IonMenuButton, IonIcon, IonCard, IonCardContent, IonText, useIonRouter } from "@ionic/vue";
import { computed } from "vue";

import Banner from "./Banner.vue";
// import StoriesCarousel from "./StoriesCarousel.vue"; // Listo para activar
import Shortcuts from "./Shortcuts.vue";
// import Links from "./Links.vue";
// import Social from "./Social.vue";
import TypeValidationBadge from "@/components/TypeValidationBadge.vue";
import { useCurrentUser } from "@/uses/currentUser";
import { isGraduateType } from "@/utils/userTypes";

const ionRouter = useIonRouter();
const { user, typeValidationStatus } = useCurrentUser();

// Mostramos el aviso solo cuando hay acción posible: tipo graduado con validación
// sin-registro (null) o rechazada (3).
const showValidationNotice = computed(
  () =>
    isGraduateType(user.value?.type_id) &&
    (typeValidationStatus.value === null || typeValidationStatus.value === 3)
);

function goToValidation() {
  ionRouter.push({ name: "type-validation" });
}
</script>

<style scoped>
ion-menu-button.ios ion-icon {
  font-size: 24px;
}

.validation-notice {
  border-left: 4px solid var(--ion-color-warning);
}

.validation-notice p {
  margin: 8px 0 0 0;
}
</style>
