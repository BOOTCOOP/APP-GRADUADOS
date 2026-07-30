<template>
  <slot name="filters" :loading="loadingItems">
    <div v-if="prop.hasSearcher" class="filters">
      <!--
        Antes se pasaba `:disabled="loadingItems"`: el buscador se deshabilitaba
        solo en cada fetch, comiéndose las teclas mientras el usuario escribía.
      -->
      <FormSearchBar
        :placeholder="searchPlaceholder"
        v-on:updated="(value) => (search = value)"
      />
      <slot name="filter-extra" :loading="loadingItems"> </slot>
    </div>
  </slot>

  <slot name="skeleton" v-if="firstLoad" :loading="loadingItems">
    <div class="ion-text-center">
      <ion-spinner></ion-spinner>
    </div>
  </slot>

  <div v-show="!firstLoad">
    <slot
      v-if="items.length"
      :loading="loadingItems"
      :items="items"
      :page="page"
      :has-more-pages="hasMorePages"
    ></slot>

    <!--
      Estado vacío por defecto: antes era un <h3> pelado centrado, así que casi
      todas las listas (Cursos, Búsquedas, Bibliografía) mostraban una frase
      suelta en medio de la pantalla. Ahora reusan el mismo EmptyState que ya
      usaba Talleres, y cada vista puede seguir sobrescribiéndolo con #empty.
    -->
    <slot v-if="!items.length && !loadingItems" name="empty">
      <EmptyState :icon="searchOutline" title="Sin resultados" :message="prop.emptyResultsText" />
    </slot>

    <ion-infinite-scroll :disabled="!hasMorePages" @ionInfinite="loadMore">
      <slot name="loader">
        <ion-infinite-scroll-content
          :loading-text="prop.loadingText"
          :loading-spinner="prop.loadingSpinner"
        ></ion-infinite-scroll-content>
      </slot>
    </ion-infinite-scroll>
  </div>
</template>

<script setup lang="ts">
import FormSearchBar from "@/views/app/components/form/FormSearchBar.vue";
import EmptyState from "@/components/EmptyState.vue";
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
} from "@ionic/vue";
import { searchOutline } from "ionicons/icons";
import { computed, onMounted, PropType, ref, watch } from "vue";
import { useStore } from "vuex";
import { analyzeCoursesListForModality } from "@/utils/modalityDetector";

const firstLoad = ref(true);
const loadingItems = ref(false);
const store = useStore();
const items = ref<any[]>([]);
const search = ref("");
const meta = ref<any>({});
const page = ref(1);
const hasMorePages = computed(
  () => meta.value?.current_page != meta.value.last_page
);
const prop = defineProps({
  fetchDataStore: {
    type: String,
    required: true,
  },
  loadingSpinner: {
    type: String as PropType<
      | "circular"
      | "bubbles"
      | "circles"
      | "crescent"
      | "dots"
      | "lines"
      | "lines-small"
      | "lines-sharp"
      | "lines-sharp-small"
      | null
    >,
    default: "circular",
  },
  loadingText: {
    default: "",
  },
  emptyResultsText: {
    default: "No hay resultados para mostrar",
  },
  perPage: {
    type: Number,
    default: 8,
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
  hasSearcher: {
    default: false,
  },
  searchValue: {
    default: "",
  },
  searchPlaceholder: {
    default: "Buscar...",
  },
});

onMounted(() => fetchData());

watch(meta, (meta) => (page.value = meta.current_page));
watch(
  () => prop.filters,
  () => filtersChanged()
);
watch(
  () => prop.searchValue,
  (val) => (search.value = val)
);
watch(search, () => filtersChanged());

function filtersChanged() {
  firstLoad.value = true;

  page.value = 1;

  // Vaciamos ANTES de pedir. Al revés (como estaba) una respuesta rápida se
  // concatenaba sobre la lista vieja y recién después se limpiaba, así que por
  // un instante se veían resultados del filtro anterior o duplicados.
  items.value = [];

  fetchData();
}

function fetchData() {
  return new Promise((resolve) => {
    loadingItems.value = true;

    store
      .dispatch(prop.fetchDataStore, {
        page: page.value,
        per_page: prop.perPage,
        filters: prop.filters,
        search: search.value,
      })
      .then((response) => {
        // 🔍 DIAGNÓSTICO DE MODALIDAD EN LISTA DE CURSOS
        if (
          prop.fetchDataStore.includes("courses") &&
          response.data.data?.length > 0
        ) {
          analyzeCoursesListForModality(response.data.data);
        }

        items.value = items.value.concat(response.data.data);

        meta.value = response.data.meta;

        firstLoad.value = false;

        resolve(true);
      })
      .catch(() => {
        // Manejar error 500 o cualquier otro error como "sin resultados"
        items.value = [];
        meta.value = { current_page: 1, last_page: 1 };
        firstLoad.value = false;
        resolve(false);
      })
      .finally(() => (loadingItems.value = false));
  });
}

function loadMore(event) {
  page.value++;

  fetchData().then(() => event.target.complete());
}

function removeItem(item) {
  const id = typeof item == "object" ? item.id : item;

  items.value = items.value.filter((i) => i.id != id);
}

defineExpose({ removeItem });
</script>

<style scoped>
/* `gap` para que el buscador y el botón de filtros no queden pegados (se veía
   en Búsquedas Laborales y Bibliografía). */
.filters {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-sm);
  margin-bottom: var(--app-spacing-md);
}

.filters > :first-child {
  flex: 1;
  min-width: 0;
}
</style>
