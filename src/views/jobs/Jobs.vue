<template>
  <graduados-app header-title="Búsqueda laboral">
    <template #header-end>
      <ion-button color="dark" @click="showOptions">
        <ion-icon
          :ios="ellipsisHorizontalCircleOutline"
          :md="ellipsisHorizontalCircleOutline"
        ></ion-icon>
        <ion-text class="ion-margin-start">Más</ion-text>
      </ion-button>
    </template>

    <ion-content :fullscreen="true">
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
  IonText,
  IonButton,
  IonContent,
  useIonRouter,
} from "@ionic/vue";

import Job from "./components/Job.vue";
import Skeleton from "./Skeleton.vue";
import { ref } from "vue";
import {
  ellipsisHorizontalCircleOutline,
  heartOutline,
  addCircleOutline,
  albumsOutline,
  filterOutline,
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

// Agregar watcher para debug
import { watch } from "vue";
watch(
  filters,
  (newFilters) => {
    console.log("🔍 FILTROS ENVIADOS A LA BÚSQUEDA:", newFilters);
  },
  { deep: true }
);

function showOptions() {
  store.dispatch("ui/action/show", [
    {
      text: "Favoritos",
      icon: heartOutline,
      handler: () => {
        router.push({ name: "jobs.favorites" });
      },
    },
    {
      text: "Crear búsqueda",
      icon: addCircleOutline,
      handler: () => {
        router.push({ name: "jobs.create" });
      },
    },
    {
      text: "Mis publicaciones",
      icon: albumsOutline,
      handler: () => {
        router.push({ name: "jobs.own" });
      },
    },
  ]);
}
</script>
