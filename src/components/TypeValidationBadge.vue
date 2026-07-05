<template>
  <ion-chip :color="meta.color" :outline="true" class="type-validation-badge">
    <ion-icon :icon="meta.icon"></ion-icon>
    <ion-label>{{ meta.label }}</ion-label>
  </ion-chip>
</template>

<script setup lang="ts">
import { IonChip, IonIcon, IonLabel } from '@ionic/vue'
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  helpCircleOutline,
  timeOutline,
} from 'ionicons/icons'
import { computed } from 'vue'

// null=sin-registro · 1=pendiente · 2=aprobado · 3=rechazado
const props = defineProps<{ status: number | null }>()

const meta = computed(() => {
  switch (props.status) {
    case 1:
      return { label: 'En revisión', color: 'warning', icon: timeOutline }
    case 2:
      return { label: 'Verificado', color: 'success', icon: checkmarkCircleOutline }
    case 3:
      return { label: 'Rechazado', color: 'danger', icon: closeCircleOutline }
    default:
      return { label: 'Sin verificar', color: 'medium', icon: helpCircleOutline }
  }
})
</script>
