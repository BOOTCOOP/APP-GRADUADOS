<template>
  <graduados-app header-title="Inscripciones históricas">
    <template #header-start>
      <ion-button @click="goBack">
        <ion-icon :md="arrowBackOutline" :ios="arrowBackOutline"></ion-icon>
      </ion-button>
    </template>

    <InfinitePagination
      fetch-data-store="courses/fetchAll"
      :filters="filters"
      empty-results-text="No hay información para mostrar"
    >
      <template #skeleton>
        <Skeleton></Skeleton>
      </template>

      <template #default="{ items }">
        <ion-text>Inscripciones históricas</ion-text>
        <ion-list class="ion-margin-top">
          <Course
            :course="course"
            v-for="course in items"
            :key="course.id"
          ></Course>
        </ion-list>
      </template>
    </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
import 'swiper/css'
import { ref } from 'vue'
import { useIonRouter } from '@ionic/vue'
import { IonButton, IonIcon, IonText, IonList } from '@ionic/vue'
import { arrowBackOutline } from 'ionicons/icons'

import Course from './components/Course.vue'
import Skeleton from './Skeleton.vue'
import InfinitePagination from '../app/components/pagination/InfinitePagination.vue'

import '@ionic/vue/css/ionic-swiper.css'

const router = useIonRouter()
const filters = ref({})

// Función para regresar a la vista anterior (Programas)
function goBack() {
  router.replace({ name: 'courses.index' })
}
</script>
