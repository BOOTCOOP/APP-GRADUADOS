<template>
    <swiper
        class="swiper-overflowed items-1"
        :slides-per-view="1"
    >
        <swiper-slide v-for="image in images" :key="image.id">
            <ion-img :src="image.src" alt="Graduados"></ion-img>
        </swiper-slide>
    </swiper>
</template>

<script setup lang="ts">
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/vue";
import { IonImg } from '@ionic/vue';
import { ref, onMounted } from "vue";
import { useStore } from 'vuex';

const images = ref([]);
const store = useStore();

onMounted(() => {
    store.dispatch("home/slider").then((response) => {
        images.value = response.data.data.images;
    })
});
</script>

<style>
.swiper.swiper-overflowed.items-1 .swiper-slide {
  width: calc(100%) !important;
}
</style>