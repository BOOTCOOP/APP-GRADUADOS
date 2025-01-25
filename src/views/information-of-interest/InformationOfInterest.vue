<template>
  <graduados-app header-title="Información de interés">  
    <InfinitePagination fetch-data-store="interests/fetchAll">
        <template #skeleton>
          <ion-card class="ion-padding" v-for="i in [1,2,3,4,5,6,7]" :key="i">
            <div style="flex-grow:1">
              <ion-skeleton-text :animated="true" style="width:30%; height:20px"></ion-skeleton-text>
              <div class="ion-margin-top">
                <ion-label>
                  <ion-skeleton-text :animated="true" style="width:60%"></ion-skeleton-text>
                  <ion-skeleton-text :animated="true" style="width:50%"></ion-skeleton-text>
                </ion-label>
              </div>
            </div>
            
            <ion-skeleton-text :animated="true" style="width:20px; height:20px"></ion-skeleton-text>
          </ion-card>
        </template>

        <template #default="{ items }">
            <ion-card v-for="info in items" :key="info.id">
              <ion-card-content class="content">
                <div style="flex-grow:1">
                  <ion-text color="primary">
                    <h6><strong>{{ info.title }}</strong></h6>
                  </ion-text>
                  <div class="info-content" v-html="info.content"></div>
                </div>
                
                <a :href="info.url" target="_blank">
                  <ion-icon :md="openOutline" :ios="openOutline" color="primary"></ion-icon>
                </a>
            
              </ion-card-content>
            </ion-card>
        </template>
    </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
  import { IonText, IonCard, IonCardContent, IonLabel, IonSkeletonText, IonIcon } from '@ionic/vue';
  import InfinitePagination from '../app/components/pagination/InfinitePagination.vue';
  import { openOutline } from 'ionicons/icons';
</script>

<style scoped>
  ion-card .content{
    display:flex; align-items:center; justify-content: space-between
  }

  ion-card ion-icon{
    font-size: 18px;
  }

  ion-card .info-content{
    color: var(--ion-color-medium)
  }
</style>