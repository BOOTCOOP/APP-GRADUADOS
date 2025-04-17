<template>
  <slot name="filters" :loading="loadingItems">
    <div v-if="prop.hasSearcher" class="filters">
      <FormSearchBar
        :placeholder="searchPlaceholder"
        v-on:updated="(value) => (search = value)"
        :disabled="loadingItems"
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

    <slot v-if="!items.length && !loadingItems" name="empty"
      ><h3 class="ion-padding-vertical ion-text-center">
        {{ prop.emptyResultsText }}
      </h3></slot
    >

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
import FormSearchBar from '@/views/app/components/form/FormSearchBar.vue'
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
} from '@ionic/vue'
import { computed, defineExpose, defineProps, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

const firstLoad = ref(true)
const loadingItems = ref(false)
const store = useStore()
const items = ref([])
const search = ref('')
const meta = ref([])
const page = ref(1)
const hasMorePages = computed(
  () => meta.value?.current_page != meta.value.last_page
)
const prop = defineProps({
  fetchDataStore: {
    type: String,
    required: true,
  },
  loadingSpinner: {
    default: 'circular',
  },
  loadingText: {
    default: '',
  },
  emptyResultsText: {
    default: 'No hay resultados para mostrar',
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
    default: '',
  },
  searchPlaceholder: {
    default: 'Buscar...',
  },
})

onMounted(() => fetchData())

watch(meta, (meta) => (page.value = meta.current_page))
watch(
  () => prop.filters,
  () => filtersChanged()
)
watch(
  () => prop.searchValue,
  (val) => (search.value = val)
)
watch(search, () => filtersChanged())

function filtersChanged() {
  firstLoad.value = true

  page.value = 1

  fetchData()

  items.value = []
}

function fetchData() {
  return new Promise((resolve) => {
    loadingItems.value = true
    store
      .dispatch(prop.fetchDataStore, {
        page: page.value,
        per_page: prop.perPage,
        filters: prop.filters,
        search: search.value,
      })
      .then((response) => {
        items.value = items.value.concat(response.data.data)

        meta.value = response.data.meta

        firstLoad.value = false

        resolve(true)
      })
      .finally(() => (loadingItems.value = false))
  })
}

function loadMore(event) {
  page.value++

  fetchData().then(() => event.target.complete())
}

function removeItem(item) {
  const id = typeof item == 'object' ? item.id : item

  items.value = items.value.filter((i) => i.id != id)
}

defineExpose({ removeItem })
</script>

<style scoped>
.filters {
  display: flex;
  align-items: center;
}
</style>
