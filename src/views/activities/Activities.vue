<template>
    <graduados-app header-title="Talleres">
        <template #header-end>
            <ion-button color="primary" @click="goToHistory()">
                <ion-icon src="/assets/icons/history-2.svg"></ion-icon>
            </ion-button>
        </template>

        <MyActivities v-if="myActivities.length > 0" :items="myActivities"></MyActivities>

        <InfinitePagination
            fetch-data-store="workshops/fetchAll"
            :filters="filters"
            empty-results-text="No hay ofertas para mostrar"
        >
            <template #skeleton>
                <Skeleton></Skeleton>
            </template>

            <template #default="{ items }">
                <ion-text>Próximos talleres</ion-text>
                <ion-list class="ion-margin-top">
                    <Activity
                        :activity="activity"
                        v-for="activity in items"
                        :key="activity.id"
                        :inscribed="myActivities.find(a => a.id == activity.id)"
                    ></Activity>
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

import MyActivities from "./components/MyActivities.vue";
import Activity from "./components/Activity.vue";
import Skeleton from "./Skeleton.vue";
import InfinitePagination from "../app/components/pagination/InfinitePagination.vue";

import "@ionic/vue/css/ionic-swiper.css";

// const perView = 1;

const filters = ref({
    // TODO: Falta el diseño de Rodri
});

const myActivities = ref([]);
const store = useStore();

onMounted(() => {
    store.dispatch("workshops/own").then((response) => {
        myActivities.value = response.data.data;
    })
});

const router = useIonRouter();

function goToHistory() {
    router.push({name:'activities.history'})
}
</script>
  