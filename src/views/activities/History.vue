<template>
  <graduados-app header-title="Inscripciones históricas">
    <template #header-start>
      <ion-button @click="goBack">
        <ion-icon :md="arrowBackOutline" :ios="arrowBackOutline"></ion-icon>
      </ion-button>
    </template>

    <!--
      El orden (última fecha primero) lo manda la API. Antes se reordenaba acá
      con sortByStartDate: además de duplicar la regla, ordenaba por la fecha
      de INICIO y sobre la lista ya acumulada, así que al cargar una página
      nueva sus talleres se intercalaban entre los de arriba.
    -->
    <InfinitePagination
      fetch-data-store="workshops/history"
      :filters="filters"
      empty-results-text="No hay información para mostrar"
    >
      <template #skeleton>
        <Skeleton></Skeleton>
      </template>

      <template #default="{ items }">
        <ion-text>Inscripciones históricas</ion-text>
        <ion-list class="ion-margin-top">
          <!--
            Acá cada ítem ES una inscripción, así que el propio taller hace de
            `inscribed`: ya trae `inscriptions[0].status` del endpoint. El
            listado principal tiene que cruzar con `workshops/own` porque
            mezcla catálogo con inscripciones; el historial no.

            Sin esto la card no mostraba el estado y, peor, se creía disponible:
            el botón decía "Inscribirse" sobre un taller terminado.
          -->
          <Activity
            :activity="activity"
            :inscribed="activity"
            v-for="activity in items"
            :key="activity.id"
          ></Activity>
        </ion-list>
      </template>
    </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useIonRouter, IonButton, IonIcon, IonText, IonList } from '@ionic/vue'
import { arrowBackOutline } from 'ionicons/icons'

import Activity from './components/Activity.vue'
import Skeleton from './Skeleton.vue'
import InfinitePagination from '../app/components/pagination/InfinitePagination.vue'

// Filtros para paginación (si son necesarios)
const filters = ref({})

// Ionic Router para navegación
const router = useIonRouter()

// Función para volver a la sección de Talleres
function goBack() {
  router.replace({ name: 'activities.index' })
}
</script>

<style scoped>
ion-button {
  margin-left: 1rem;
}
</style>
