<template>
  <graduados-app header-title="Noticias">
      <InfinitePagination fetch-data-store="feeds/fetchAll">
          <template #skeleton>
              <ion-list>
                  <ion-item v-for="i in [1,2,3,4,5]" :key="i" class="ion-margin-bottom">
                  <ion-thumbnail slot="start">
                      <ion-skeleton-text :animated="true"></ion-skeleton-text>
                  </ion-thumbnail>
                  <ion-label>
                      <h3>
                      <ion-skeleton-text :animated="true" style="width: 100%;"></ion-skeleton-text>
                      </h3>
                      <p>
                      <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
                      </p>
                      <p>
                      <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
                      </p>
                  </ion-label>
                  </ion-item>
              </ion-list>
          </template>

          <template #default="{ items }">
              <ion-card :router-link="'/noticia/'+feed.slug" class="ion-no-margin ion-margin-bottom" v-for="feed in items" :key="feed.id">
                  <ion-thumbnail>
                      <img :alt="feed.title" :src="feed.thumb.absolute_path" />
                  </ion-thumbnail>
                  <ion-label class="ion-padding">
                      <div><ion-text color="medium"><small>{{ feed.date }}</small></ion-text></div>
                      {{feed.title}}
                  </ion-label>
              </ion-card>
          </template>
      </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
  import { IonSkeletonText, IonText, IonCard, IonList, IonItem,IonLabel, IonThumbnail } from '@ionic/vue';
  import InfinitePagination from '../app/components/pagination/InfinitePagination.vue';
</script>

<style scoped>
  ion-item{
      border:none;
      --inner-border-width:0;
      --background: white;
      --border-radius: 4px
  }

  ion-card{
      display: flex;
  }

  ion-card ion-thumbnail{
      --size:100%;
      --ion-padding:0;
      flex-shrink: 0;
      width:30%;
  }
</style>