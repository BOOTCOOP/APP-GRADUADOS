<template>
  <graduados-app header-title="Material Bibliográfico">
    <InfinitePagination
      fetch-data-store="bibliographies/fetchAll"
      :filters="filters"
      empty-results-text="No hay ofertas para mostrar"
    >
      <template #skeleton>
        <Skeleton></Skeleton>
      </template>

      <template #default="{ items }">
        <ion-list class="ion-margin-top">
          <BibliographyItem
            :file="bibliography"
            v-for="bibliography in items"
            :key="bibliography.id"
          ></BibliographyItem>
        </ion-list>
      </template>
    </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
import 'swiper/css'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import Skeleton from '../activities/Skeleton.vue'
import InfinitePagination from '../app/components/pagination/InfinitePagination.vue'
import BibliographyItem from './components/BibliographyItem.vue'

import '@ionic/vue/css/ionic-swiper.css'

// const perView = 1;

const filters = ref({
  // TODO: Falta el diseño de Rodri
})

const myActivities = ref([])
const store = useStore()

onMounted(() => {
  store.dispatch('workshops/own').then((response) => {
    myActivities.value = response.data.data
  })
})

// function goToHistory() {
//     console.log("Go to history");
// }
</script>
