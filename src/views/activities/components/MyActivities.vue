<template>
    <ion-text>Actividades Inscriptas</ion-text>
    <swiper
        class="swiper-overflowed"
        :class="['items-' + perView]"
        :slides-per-view="perView"
    >
        <swiper-slide v-for="activity in items" :key="activity.id">
            <ion-card @click="() => showDetail(activity.id)" color="primary">
                <p>
                    <ion-text>{{ activity.title }}</ion-text>
                </p>
                <p>
                  <ion-icon :md="timeOutline" :ios="timeOutline" color="light"></ion-icon>
                    <ion-text>{{ activity.beginning }}</ion-text>
                </p>
            </ion-card>
        </swiper-slide>
    </swiper>
</template>
  
<script setup lang="ts">
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/vue";
import { IonCard, IonText, IonIcon, useIonRouter } from "@ionic/vue";
import { timeOutline } from 'ionicons/icons';


import "@ionic/vue/css/ionic-swiper.css";

const perView = 1;

const prop = defineProps({
    items:{
        type: Array,
        required: true
    },
});

const router = useIonRouter();

function showDetail(id) {
    router.push({name:'activities.show', params: {slug: id}})
}

</script>

<style scoped>
    ion-card{
        margin: 5px;
        width: 100%;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 50px;
        flex-direction: column;
    }
</style>