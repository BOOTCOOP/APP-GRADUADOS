<template>
  <graduados-app
    header-title="Noticia"
    :header-show-back-button="true"
    body="white"
  >
    <div v-if="!loaded">
      <ion-thumbnail
        style="width: 100%; height: 15vh"
        class="ion-margin-bottom"
      >
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
      </ion-thumbnail>

      <ion-skeleton-text
        :animated="true"
        style="width: 100%; height: 20px"
      ></ion-skeleton-text>
      <ion-skeleton-text
        :animated="true"
        style="width: 20%; height: 20px"
        class="ion-margin-bottom"
      ></ion-skeleton-text>

      <ion-skeleton-text
        v-for="i in [1, 2, 3, 4, 5, 6, 7]"
        :key="i"
        :animated="true"
        style="width: 100%"
      ></ion-skeleton-text>
      <ion-skeleton-text
        :animated="true"
        style="width: 20%"
      ></ion-skeleton-text>
    </div>
    <div v-if="feed && loaded">
      <ion-thumbnail
        style="width: 100%; height: auto"
        class="ion-margin-bottom"
      >
        <img :alt="feed.title" :src="feed.thumb.absolute_path" />
      </ion-thumbnail>

      <ion-text>
        <ion-text color="medium"
          ><small>{{ feed.date }}</small></ion-text
        >
        <h4 class="ion-no-margin">{{ feed.title }}</h4>
        <div class="content ion-margin-top" v-html="feed.content"></div>
      </ion-text>
    </div>
  </graduados-app>
</template>

<script setup lang="ts">
import {
  IonSkeletonText,
  IonText,
  IonThumbnail,
} from '@ionic/vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

interface FeedItem {
  title: string;
  content: string;
  date: string;
  thumb: {
    absolute_path: string;
  };
}

const loaded = ref(false)
const store = useStore()
const route = useRoute()
const feed = ref<FeedItem>({} as FeedItem)

onMounted(() => {
  const { slug } = route.params
  store.dispatch('feeds/fetch', slug).then((response) => {
    feed.value = response.data.data
    loaded.value = true
  })
})
</script>

<style scoped>
ion-thumbnail img {
  border-radius: 5px;
}
.content {
  color: var(--ion-color-step-500);
  font-size: 14px;
}
</style>
