<template>
    <graduados-app header-title="Programas de Perfeccionamiento">
        <template #header-end>
            <ion-button color="primary" @click="goToHistory()">
                <ion-icon src="/assets/icons/history-2.svg"></ion-icon>
            </ion-button>
        </template>

        <MyCourses v-if="myCourses.length > 0" :items="myCourses"></MyCourses>

        <InfinitePagination
            fetch-data-store="courses/fetchAll"
            :filters="filters"
            empty-results-text="No hay ofertas para mostrar"
        >
            <template #skeleton>
                <Skeleton></Skeleton>
            </template>

            <template #default="{ items }">
                <ion-text>Próximos cursos</ion-text>
                <ion-list class="ion-margin-top">
                    <Course
                        :course="course"
                        v-for="course in items"
                        :key="course.id"
                        :inscribed="myCourses.find(c => c.id == course.id)"
                    ></Course>
                </ion-list>
            </template>
        </InfinitePagination>
    </graduados-app>
</template>
  
  <script setup lang="ts">
import "swiper/css";
import { IonButton, IonIcon, IonText, IonList, useIonRouter } from '@ionic/vue';
import { ref, onMounted } from "vue";
import { useStore } from 'vuex';

import MyCourses from "./components/MyCourses.vue";
import Course from "./components/Course.vue";
import Skeleton from "./Skeleton.vue";
import InfinitePagination from "../app/components/pagination/InfinitePagination.vue";

import "@ionic/vue/css/ionic-swiper.css";

const perView = 1;

const filters = ref({
    // TODO: Falta el diseño de Rodri
});

const myCourses = ref([]);
const store = useStore();

onMounted(() => {
    store.dispatch("courses/own").then((response) => {
        myCourses.value = response.data.data;
    })
});

const router = useIonRouter();

function goToHistory() {
    router.push({name:'courses.history'})
}
</script>
  