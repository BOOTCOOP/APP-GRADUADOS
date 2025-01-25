<template>
    <graduados-app header-title="Inscripciones históricas">
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
import "swiper/css";
import { ref, onMounted } from "vue";
import { useStore } from 'vuex';
import { IonText, IonList } from '@ionic/vue';

import MyCourses from "./components/MyCourses.vue";
import Course from "./components/Course.vue";
import Skeleton from "./Skeleton.vue";
import InfinitePagination from "../app/components/pagination/InfinitePagination.vue";

import "@ionic/vue/css/ionic-swiper.css";

const perView = 1;

const filters = ref({
    // TODO: Falta el diseño de Rodri
});
</script>
  