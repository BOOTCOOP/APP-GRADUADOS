<template>
  <div class="cart-bar">
    <div class="cart-bar__summary">
      <ion-icon :icon="cartOutline" aria-hidden="true"></ion-icon>
      <span>
        <strong>{{ count }}</strong>
        {{ count === 1 ? "actividad seleccionada" : "actividades seleccionadas" }}
      </span>
    </div>

    <ion-button
      expand="block"
      shape="round"
      color="primary"
      class="cart-bar__action"
      @click="goToCart"
    >
      <ion-icon :icon="schoolOutline" slot="start" aria-hidden="true"></ion-icon>
      Revisar e inscribirme
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, useIonRouter } from "@ionic/vue";
import { cartOutline, schoolOutline } from "ionicons/icons";
import { useEnrollmentCart } from "@/uses/enrollmentCart";

// Barra de "mi selección". Se monta en el slot #footer del layout para no
// pisar contenido ni pelearse con el FAB (el layout lo oculta cuando hay
// footer). La vista es la que decide mostrarla: `v-if="count > 0"`.
const { count } = useEnrollmentCart();
const router = useIonRouter();

function goToCart() {
  router.push({ name: "cart.index" });
}
</script>

<style scoped>
.cart-bar {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-sm);
}

.cart-bar__summary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--app-spacing-sm);
  font-size: 14px;
  color: var(--app-text-secondary);
}

.cart-bar__summary ion-icon {
  font-size: 18px;
  color: var(--ion-color-primary);
}

.cart-bar__action {
  margin: 0;
  min-height: var(--app-tap-target);
  font-weight: 600;
  text-transform: none;
}
</style>
