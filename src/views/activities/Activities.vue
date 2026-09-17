<template>
  <graduados-app header-title="Talleres y Jornadas" :header-show-back-button="true">
    <template #header-end>
      <ion-button v-if="isLoggedIn" color="primary" @click="goToHistory()">
        <ion-icon src="/assets/icons/history-2.svg"></ion-icon>
      </ion-button>
    </template>

    <MyActivities
      v-if="myActivities.length > 0"
      :items="myActivities"
    ></MyActivities>

    <!--
      Búsqueda y filtro de modalidad. Los dos se resuelven en la API (van como
      `search` y `filters[modality]`): resolverlos acá alcanzaba sólo a los
      talleres ya descargados, así que buscar algo del final del período no lo
      encontraba y "Virtual" escondía talleres virtuales de las páginas que
      todavía no habían bajado.

      Se fueron los filtros de categoría y de mes: la categoría la adivinaba la
      app por palabras clave del título (el legacy no tiene ese dato) y el mes
      se sacaba de la fecha ya traída.
    -->
    <div class="search-filter-container">
      <FormSearchBar
        placeholder="Buscar por nombre, descripción o docente..."
        @updated="(value) => (searchQuery = value)"
      />
    </div>

    <div class="filter-group ion-margin-bottom">
      <p class="filter-group__label" id="filtro-modalidad-label">Modalidad</p>
      <div
        class="filters-container"
        role="group"
        aria-labelledby="filtro-modalidad-label"
      >
        <button
          v-for="opcion in MODALIDADES"
          :key="opcion.value"
          type="button"
          class="filter-chip"
          :class="{ 'is-active': selectedModality === opcion.value }"
          :aria-pressed="selectedModality === opcion.value"
          @click="setModality(opcion.value)"
        >
          {{ opcion.label }}
        </button>
      </div>
    </div>

    <InfinitePagination
      fetch-data-store="workshops/fetchAll"
      :filters="filters"
      :search-value="searchQuery"
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
          <!-- `items` va tal cual: filtrar u ordenar acá rompe la paginación
               (ver el comentario de arriba y el de History.vue). -->
          <Activity
            :activity="activity"
            v-for="activity in items"
            :key="activity.id"
            :inscribed="myActivities.find((a) => a.id == activity.id)"
          ></Activity>
        </ion-list>
      </template>
    </InfinitePagination>

    <!-- Barra de "mi selección": sólo cuando hay algo seleccionado. Va en el
         footer del layout (no flotando) para no tapar la última card. -->
    <template #footer v-if="cartCount > 0">
      <EnrollmentCartBar />
    </template>
  </graduados-app>
</template>

<script setup lang="ts">
import "swiper/css";
import {
  IonButton,
  IonIcon,
  IonText,
  IonList,
  useIonRouter,
} from "@ionic/vue";
import { ref, computed, watch } from "vue";
import { useCurrentUser } from "@/uses/currentUser";
import { useStore } from "vuex";
import { schoolOutline } from "ionicons/icons";

import MyActivities from "./components/MyActivities.vue";
import Activity from "./components/Activity.vue";
import Skeleton from "./Skeleton.vue";
import InfinitePagination from "../app/components/pagination/InfinitePagination.vue";
import FormSearchBar from "../app/components/form/FormSearchBar.vue";
import EmptyState from "@/components/EmptyState.vue";
import EnrollmentCartBar from "@/components/EnrollmentCartBar.vue";
import { useEnrollmentCart } from "@/uses/enrollmentCart";

import "@ionic/vue/css/ionic-swiper.css";

const { count: cartCount } = useEnrollmentCart();

// const perView = 1;

/*
 * Sólo las dos modalidades que existen en el legacy (`graduados_modalidad`).
 * Antes había también "Híbrida", que no está en la tabla: elegirla vaciaba la
 * lista siempre.
 */
const MODALIDADES = [
  { value: "all", label: "Todas" },
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
] as const;

const searchQuery = ref("");
const selectedModality = ref<string>("all");

// Lo que viaja a la API. InfinitePagination observa este objeto: al cambiarlo
// vuelve a pedir desde la página 1, que es justo lo que tiene que pasar cuando
// cambia un filtro.
const filters = computed(() => ({ modality: selectedModality.value }));

const myActivities = ref<any[]>([]);
const store = useStore();

function setModality(value: string) {
  selectedModality.value = value;
}

// "Mis actividades" requiere sesión: solo pedimos workshops/own con usuario
// logueado. El watch cubre el caso de loguearse y volver sin recargar.
const { isLoggedIn } = useCurrentUser();

watch(isLoggedIn, (logged) => {
  if (logged) {
    store.dispatch("workshops/own").then((response) => {
      myActivities.value = response.data.data;
    });
  } else {
    myActivities.value = [];
  }
}, { immediate: true });

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

.search-filter-container > * {
  flex: 1;
  min-width: 0;
}

/* Chips de modalidad: mismo control que en Cursos, para que los dos listados
   se filtren igual. */
.filter-group__label {
  margin: 0 0 var(--app-spacing-sm, 8px);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--app-text-secondary);
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--app-spacing-sm, 8px);
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 14px;
  border-radius: var(--app-radius-pill, 100px);
  border: 1px solid var(--app-border-strong, rgba(23, 22, 28, 0.14));
  background: var(--app-surface, #fff);
  color: var(--app-text-body, #4a4a55);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  line-height: 1;
  cursor: pointer;
  transition: background var(--app-duration-fast, 120ms) var(--app-ease),
    border-color var(--app-duration-fast, 120ms) var(--app-ease),
    color var(--app-duration-fast, 120ms) var(--app-ease);
}

.filter-chip:hover {
  border-color: var(--ion-color-primary);
  color: var(--ion-color-primary);
}

.filter-chip:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}

.filter-chip.is-active,
.filter-chip.is-active:hover {
  background: var(--ion-color-primary);
  border-color: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast, #fff);
  font-weight: 600;
  box-shadow: var(--app-shadow-primary, 0 4px 16px rgba(171, 73, 204, 0.22));
}
</style>
