<template>
  <div class="empty-state">
    <ion-icon :icon="icon" class="empty-icon"></ion-icon>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { documentTextOutline } from "ionicons/icons";

interface Props {
  icon?: string;
  title?: string;
  message?: string;
}

withDefaults(defineProps<Props>(), {
  icon: documentTextOutline,
  title: "Sin datos.",
  message: "Parece que no se encontraron coincidencias.",
});
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  min-height: 300px;
}

.empty-icon {
  font-size: 80px;
  color: var(--ion-color-medium);
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-state h3 {
  color: var(--ion-color-dark);
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.empty-state p {
  color: var(--ion-color-medium);
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
  max-width: 300px;
}

/* Animación sutil */
.empty-state {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
