<template>
  <graduados-app header-title="Búsqueda laboral" :header-show-back-button="true">

    <ion-content :fullscreen="true">
      <!--
        Mismo aviso que el sitio web, en versión compacta: el texto completo a
        tamaño normal se comía casi una pantalla antes de la primera búsqueda.
        Va una sola vez arriba de la lista, no por card.
      -->
      <aside class="jobs-disclaimer">
        <ion-icon
          class="jobs-disclaimer__icon"
          :icon="informationCircleOutline"
          aria-hidden="true"
        ></ion-icon>
        <p class="jobs-disclaimer__text">
          <strong>¡IMPORTANTE!</strong> Las direcciones de correo electrónico
          para enviar los CV se publicarán en cada búsqueda. El Centro de
          Graduadas y Graduados no recepciona los CV ni forma parte del proceso
          de selección. La publicación de las búsquedas es un servicio gratuito
          para graduadas/os de esta facultad.
        </p>
      </aside>

      <InfinitePagination
        fetch-data-store="jobs/fetchAll"
        :per-page="8"
        :filters="filters"
        :has-searcher="true"
        search-placeholder="Buscar trabajos..."
      >
        <template #filter-extra>
          <ion-button color="medium" @click="showFilters">
            <ion-icon :md="filterOutline" :ios="filterOutline"></ion-icon>
          </ion-button>
        </template>

        <template #skeleton>
          <Skeleton></Skeleton>
        </template>

        <template #default="{ items }">
          <ion-list class="ion-margin-top">
            <Job
              :job="job"
              v-for="job in filteredJobs(items)"
              :key="job.id"
            ></Job>
          </ion-list>
        </template>
      </InfinitePagination>
    </ion-content>
  </graduados-app>
</template>

<script setup lang="ts">
import {
  IonList,
  IonIcon,
  IonButton,
  IonContent,
  useIonRouter,
} from "@ionic/vue";

import Job from "./components/Job.vue";
import Skeleton from "./Skeleton.vue";
import { ref } from "vue";
import {
  filterOutline,
  informationCircleOutline,
} from "ionicons/icons";
import { useStore } from "vuex";
import InfinitePagination from "../app/components/pagination/InfinitePagination.vue";

const router = useIonRouter();
const store = useStore();
const filters = ref({
  // Filtros desactivados temporalmente - backend devuelve error 500
});

// Filtros del lado cliente - solo modalidad
const modalityFilter = ref("");

// Función para mostrar filtros en action sheet
const showFilters = () => {
  const currentModality = modalityFilter.value;

  store.dispatch("ui/action/show", [
    {
      text:
        currentModality === "Presencial"
          ? "✓ Modalidad: Presencial"
          : "Modalidad: Presencial",
      handler: () => {
        modalityFilter.value =
          currentModality === "Presencial" ? "" : "Presencial";
      },
    },
    {
      text:
        currentModality === "Híbrido"
          ? "✓ Modalidad: Híbrido"
          : "Modalidad: Híbrido",
      handler: () => {
        modalityFilter.value = currentModality === "Híbrido" ? "" : "Híbrido";
      },
    },
    {
      text:
        currentModality === "Home office"
          ? "✓ Modalidad: Home office"
          : "Modalidad: Home office",
      handler: () => {
        modalityFilter.value =
          currentModality === "Home office" ? "" : "Home office";
      },
    },
    {
      text: "Limpiar filtros",
      role: "destructive",
      handler: () => {
        modalityFilter.value = "";
      },
    },
  ]);
};

// Función para filtrar trabajos del lado cliente - solo modalidad
const filteredJobs = (jobs: any[]) => {
  if (!jobs) return [];

  return jobs.filter((job) => {
    // Solo filtro por modalidad
    if (modalityFilter.value && modalityFilter.value !== "") {
      if (job.modality !== modalityFilter.value) {
        return false;
      }
    }

    return true;
  });
};

// Filtros comentados temporalmente
// const selectedModality = ref('');
// const updateFilters = () => {
//   const newFilters: any = {};
//   if (selectedModality.value && selectedModality.value !== '') {
//     newFilters.modality = selectedModality.value;
//   }
//   filters.value = newFilters;
// };

</script>

<style scoped>
/*
 * Aviso compacto: 12.5px y line-height corto para que las cinco líneas del
 * texto legal no empujen la primera búsqueda fuera de la pantalla.
 */
.jobs-disclaimer {
  display: flex;
  align-items: flex-start;
  gap: var(--app-spacing-sm, 8px);
  padding: var(--app-spacing-sm, 8px) var(--app-spacing-md, 12px);
  margin-bottom: var(--app-spacing-md, 12px);
  background: var(--app-surface-alt);
  border: 1px solid var(--app-border);
  border-left: 3px solid var(--ion-color-primary);
  border-radius: var(--app-radius-sm, 8px);
}

.jobs-disclaimer__icon {
  flex-shrink: 0;
  font-size: 16px;
  margin-top: 1px;
  color: var(--ion-color-primary);
}

.jobs-disclaimer__text {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.4;
  color: var(--app-text-secondary);
}

.jobs-disclaimer__text strong {
  color: var(--app-text-title);
}
</style>
