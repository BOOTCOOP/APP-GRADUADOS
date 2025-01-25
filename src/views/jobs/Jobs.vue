<template>
  <graduados-app header-title="Búsqueda laboral">
      <template #header-end>
          <ion-button color="dark" @click="showOptions">
              <ion-icon :ios="ellipsisHorizontalCircleOutline" :md="ellipsisHorizontalCircleOutline"></ion-icon>
              <ion-text class="ion-margin-start">Más</ion-text>
          </ion-button>
      </template>
      
      <InfinitePagination fetch-data-store="jobs/fetchAll" :filters="filters" :has-searcher="true" empty-results-text="No hay ofertas para mostrar">
            <template #filter-extra>
                <ion-button color="medium">
                    <ion-icon :md="filterOutline" :ios="filterOutline"></ion-icon>
                </ion-button>
            </template>
                
            <template #skeleton>
                <Skeleton></Skeleton>
            </template>

            <template #default="{ items }">
                <ion-list class="ion-margin-top">
                    <Job :job="job" v-for="job in items" :key="job.id"></Job>
                </ion-list>
            </template>
      </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
  import { IonList, IonIcon, IonText, IonButton, useIonRouter } from '@ionic/vue';
  
  import Job from "./components/Job.vue"; 
  import Skeleton from "./Skeleton.vue"; 
  import { ref } from 'vue';
  import { ellipsisHorizontalCircleOutline, heartOutline, addCircleOutline, albumsOutline, filterOutline } from 'ionicons/icons';
  import { useStore } from 'vuex';
  import InfinitePagination from '../app/components/pagination/InfinitePagination.vue';

  const router = useIonRouter();
  const store = useStore();
  const filters = ref({
    // TODO: Falta el diseño de Rodri
  });

  function showOptions() {
    store.dispatch("ui/action/show", [
        {
            text: 'Favoritos',
            icon: heartOutline,
            handler: ()=>{
                router.push({name:'jobs.favorites'})
            }
        },
        {
            text: 'Crear búsqueda',
            icon: addCircleOutline,
            handler: ()=>{
                router.push({name:'jobs.create'})
            }
        },
        {
            text: 'Mis publicaciones',
            icon: albumsOutline,
            handler: ()=>{
                router.push({name:'jobs.own'})
            }
        },
    ])
  }
</script>
