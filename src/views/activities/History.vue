<template>
    <graduados-app header-title="Inscripciones históricas">
        <InfinitePagination
            fetch-data-store="workshops/history"
            :filters="filters"
            empty-results-text="No hay información para mostrar"
        >
            <template #skeleton>
                <Skeleton></Skeleton>
            </template>

            <template #default="{ items }">
                <ion-text>Inscripciones históricas</ion-text>
                <ion-list class="ion-margin-top">
                    <Activity
                        :activity="activity"
                        v-for="activity in items"
                        :key="activity.id"
                    ></Activity>
                </ion-list>
            </template>
        </InfinitePagination>
    </graduados-app>
</template>
  
  <script setup lang="ts">
import "swiper/css";
import { ref } from "vue";
import { IonText, IonList } from '@ionic/vue';


import Activity from "./components/Activity.vue";
import Skeleton from "./Skeleton.vue";
import InfinitePagination from "../app/components/pagination/InfinitePagination.vue";

import "@ionic/vue/css/ionic-swiper.css";

// const perView = 1;

const filters = ref({
    // TODO: Falta el diseño de Rodri
});
</script>
  