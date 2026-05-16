<template>
  <graduados-app header-title="Talleres y Jornadas">
    <template #header-end>
      <ion-button color="primary" @click="goToHistory()">
        <ion-icon src="/assets/icons/history-2.svg"></ion-icon>
      </ion-button>
    </template>

    <MyActivities
      v-if="myActivities.length > 0"
      :items="myActivities"
    ></MyActivities>

    <!-- Barra de búsqueda y filtros -->
    <div class="search-filter-container ion-margin-bottom">
      <FormSearchBar
        v-model="searchQuery"
        placeholder="Buscar talleres y jornadas por nombre, descripción o docente..."
        class="search-bar"
      />

      <ion-button
        size="small"
        fill="outline"
        color="primary"
        @click="openFilters"
        class="filter-button"
      >
        <ion-icon slot="start" :icon="filterOutline"></ion-icon>
        Filtros
        <ion-badge
          color="primary"
          v-if="activeFiltersCount > 0"
          class="filter-badge"
        >
          {{ activeFiltersCount }}
        </ion-badge>
      </ion-button>
    </div>

    <InfinitePagination
      fetch-data-store="workshops/fetchAll"
      :filters="filters"
    >
      <template #skeleton>
        <Skeleton></Skeleton>
      </template>

      <template #empty>
        <EmptyState
          :icon="schoolOutline"
          title="Sin talleres disponibles"
          message="No se encontraron talleres ni jornadas en este momento. Vuelve pronto para ver nuevas ofertas."
        />
      </template>

      <template #default="{ items }">
        <ion-text>Próximos talleres y jornadas</ion-text>
        <ion-list class="ion-margin-top">
          <Activity
            :activity="activity"
            v-for="activity in filteredActivities(items)"
            :key="activity.id"
            :inscribed="myActivities.find((a) => a.id == activity.id)"
          ></Activity>
        </ion-list>
      </template>
    </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
import "swiper/css";
import {
  IonButton,
  IonIcon,
  IonText,
  IonList,
  IonBadge,
  useIonRouter,
  actionSheetController,
} from "@ionic/vue";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { filterOutline, schoolOutline } from "ionicons/icons";

import MyActivities from "./components/MyActivities.vue";
import Activity from "./components/Activity.vue";
import Skeleton from "./Skeleton.vue";
import InfinitePagination from "../app/components/pagination/InfinitePagination.vue";
import FormSearchBar from "../app/components/form/FormSearchBar.vue";
import EmptyState from "@/components/EmptyState.vue";

import "@ionic/vue/css/ionic-swiper.css";

// const perView = 1;

const searchQuery = ref("");
const selectedCategory = ref("all");
const selectedModality = ref("all");
const selectedMonth = ref("all");

const filters = ref({
  // TODO: Falta el diseño de Rodri
});

const myActivities = ref<any[]>([]);
const store = useStore();

// Computadas para filtros
const activeFiltersCount = computed(() => {
  let count = 0;
  if (selectedCategory.value !== "all") count++;
  if (selectedModality.value !== "all") count++;
  if (selectedMonth.value !== "all") count++;
  return count;
});

// Función para abrir filtros
async function openFilters() {
  const actionSheet = await actionSheetController.create({
    header: "Filtrar talleres y jornadas",
    cssClass: "custom-action-sheet",
    buttons: [
      {
        text: "Por Temática",
        handler: () => openCategoryFilter(),
      },
      {
        text: "Por Modalidad",
        handler: () => openModalityFilter(),
      },
      {
        text: "Por Mes",
        handler: () => openMonthFilter(),
      },
      {
        text: "Limpiar Filtros",
        handler: () => clearAllFilters(),
      },
      {
        text: "Cancelar",
        role: "cancel",
      },
    ],
  });
  await actionSheet.present();
}

// Filtros específicos
async function openCategoryFilter() {
  const actionSheet = await actionSheetController.create({
    header: "Filtrar por Temática",
    buttons: [
      {
        text: "Todas las temáticas",
        handler: () => {
          selectedCategory.value = "all";
        },
      },
      {
        text: "Legal",
        handler: () => {
          selectedCategory.value = "legal";
        },
      },
      {
        text: "Académico",
        handler: () => {
          selectedCategory.value = "academico";
        },
      },
      {
        text: "Profesional",
        handler: () => {
          selectedCategory.value = "profesional";
        },
      },
      {
        text: "Tecnología",
        handler: () => {
          selectedCategory.value = "tecnologia";
        },
      },
      {
        text: "Gestión",
        handler: () => {
          selectedCategory.value = "gestion";
        },
      },
      { text: "Cancelar", role: "cancel" },
    ],
  });
  await actionSheet.present();
}

async function openModalityFilter() {
  const actionSheet = await actionSheetController.create({
    header: "Filtrar por Modalidad",
    buttons: [
      {
        text: "Todas las modalidades",
        handler: () => {
          selectedModality.value = "all";
        },
      },
      {
        text: "Presencial",
        handler: () => {
          selectedModality.value = "presencial";
        },
      },
      {
        text: "Virtual",
        handler: () => {
          selectedModality.value = "virtual";
        },
      },
      {
        text: "Híbrida",
        handler: () => {
          selectedModality.value = "hibrida";
        },
      },
      { text: "Cancelar", role: "cancel" },
    ],
  });
  await actionSheet.present();
}

async function openMonthFilter() {
  const actionSheet = await actionSheetController.create({
    header: "Filtrar por Mes",
    buttons: [
      {
        text: "Todos los meses",
        handler: () => {
          selectedMonth.value = "all";
        },
      },
      {
        text: "Enero",
        handler: () => {
          selectedMonth.value = "01";
        },
      },
      {
        text: "Febrero",
        handler: () => {
          selectedMonth.value = "02";
        },
      },
      {
        text: "Marzo",
        handler: () => {
          selectedMonth.value = "03";
        },
      },
      {
        text: "Abril",
        handler: () => {
          selectedMonth.value = "04";
        },
      },
      {
        text: "Mayo",
        handler: () => {
          selectedMonth.value = "05";
        },
      },
      {
        text: "Junio",
        handler: () => {
          selectedMonth.value = "06";
        },
      },
      {
        text: "Julio",
        handler: () => {
          selectedMonth.value = "07";
        },
      },
      {
        text: "Agosto",
        handler: () => {
          selectedMonth.value = "08";
        },
      },
      {
        text: "Septiembre",
        handler: () => {
          selectedMonth.value = "09";
        },
      },
      {
        text: "Octubre",
        handler: () => {
          selectedMonth.value = "10";
        },
      },
      {
        text: "Noviembre",
        handler: () => {
          selectedMonth.value = "11";
        },
      },
      {
        text: "Diciembre",
        handler: () => {
          selectedMonth.value = "12";
        },
      },
      { text: "Cancelar", role: "cancel" },
    ],
  });
  await actionSheet.present();
}

function clearAllFilters() {
  selectedCategory.value = "all";
  selectedModality.value = "all";
  selectedMonth.value = "all";
}

// Función de filtrado por búsqueda
function filteredActivities(items: any[]) {
  let filteredItems = items;

  // Aplicar búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filteredItems = filteredItems.filter((activity: any) => {
      return (
        activity.title?.toLowerCase().includes(query) ||
        activity.content?.toLowerCase().includes(query) ||
        activity.teachers?.toLowerCase().includes(query) ||
        activity.description?.toLowerCase().includes(query)
      );
    });
  }

  // Aplicar filtros de categoría
  if (selectedCategory.value !== "all") {
    filteredItems = filteredItems.filter((activity: any) => {
      const category = categorizeActivity(activity);
      return category === selectedCategory.value;
    });
  }

  // Aplicar filtros de modalidad
  if (selectedModality.value !== "all") {
    filteredItems = filteredItems.filter((activity: any) => {
      const modality = extractModality(activity);
      return modality === selectedModality.value;
    });
  }

  // Aplicar filtros de mes
  if (selectedMonth.value !== "all") {
    filteredItems = filteredItems.filter((activity: any) => {
      const activityMonth = extractMonth(activity);
      return activityMonth === selectedMonth.value;
    });
  }

  return filteredItems;
}

// Función para categorizar talleres automáticamente
function categorizeActivity(activity: any): string {
  const title = activity.title?.toLowerCase() || "";
  const content = activity.content?.toLowerCase() || "";
  const description = activity.description?.toLowerCase() || "";
  const teachers = activity.teachers?.toLowerCase() || "";

  const fullText = `${title} ${content} ${description} ${teachers}`;

  // Legal
  const legalKeywords = [
    "derecho",
    "legal",
    "jurídico",
    "jurisprudencia",
    "abogado",
    "tribunal",
    "corte",
    "legislación",
    "normativa",
    "código",
    "ley",
    "decreto",
    "constitucional",
    "procesal",
    "civil",
    "penal",
    "laboral",
    "comercial",
  ];
  if (legalKeywords.some((keyword) => fullText.includes(keyword))) {
    return "legal";
  }

  // Académico
  const academicKeywords = [
    "investigación",
    "académico",
    "tesis",
    "maestría",
    "doctorado",
    "universidad",
    "facultad",
    "cátedra",
    "seminario",
    "metodología",
    "científico",
    "estudio",
    "análisis",
    "teoría",
  ];
  if (academicKeywords.some((keyword) => fullText.includes(keyword))) {
    return "academico";
  }

  // Tecnología
  const techKeywords = [
    "tecnología",
    "digital",
    "informática",
    "software",
    "programación",
    "datos",
    "sistema",
    "plataforma",
    "web",
    "aplicación",
    "internet",
    "ciberseguridad",
    "ia",
    "inteligencia artificial",
  ];
  if (techKeywords.some((keyword) => fullText.includes(keyword))) {
    return "tecnologia";
  }

  // Gestión
  const managementKeywords = [
    "gestión",
    "administración",
    "management",
    "liderazgo",
    "recursos",
    "proyectos",
    "estrategia",
    "planificación",
    "organización",
    "dirección",
  ];
  if (managementKeywords.some((keyword) => fullText.includes(keyword))) {
    return "gestion";
  }

  // Profesional (por defecto)
  return "profesional";
}

// Función para extraer modalidad
function extractModality(activity: any): string {
  const content = activity.content?.toLowerCase() || "";
  const title = activity.title?.toLowerCase() || "";
  const fullText = `${title} ${content}`;

  if (
    fullText.includes("virtual") ||
    fullText.includes("online") ||
    fullText.includes("distancia")
  ) {
    return "virtual";
  }
  if (fullText.includes("presencial") || fullText.includes("aula")) {
    return "presencial";
  }
  if (
    fullText.includes("híbrida") ||
    fullText.includes("mixta") ||
    fullText.includes("combinada")
  ) {
    return "hibrida";
  }

  return "presencial"; // por defecto
}

// Función para extraer mes
function extractMonth(activity: any): string {
  if (!activity.start) return "all";

  try {
    let date: Date;

    if (
      activity.start.includes("/") &&
      activity.start.split("/").length === 3
    ) {
      // Formato DD/MM/YYYY
      const [day, month, year] = activity.start.split("/");
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      // Otros formatos
      date = new Date(activity.start);
    }

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return "all";
    }

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return month;
  } catch {
    return "all";
  }
}

onMounted(() => {
  store.dispatch("workshops/own").then((response) => {
    myActivities.value = response.data.data;
  });
});

const router = useIonRouter();

function goToHistory() {
  router.push({ name: "activities.history" });
}
</script>

<style scoped>
.search-filter-container {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.search-bar {
  flex: 1;
  margin-bottom: 0 !important;
}

.filter-button {
  flex-shrink: 0;
  min-height: 44px;
}

.filter-badge {
  margin-left: 4px;
  font-size: 10px;
}

:global(.custom-action-sheet .action-sheet-group) {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
