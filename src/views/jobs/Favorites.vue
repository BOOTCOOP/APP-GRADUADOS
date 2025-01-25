<template>
    <graduados-app header-title="Favoritos" :header-show-back-button="true">
      
      <InfinitePagination ref="pagination" fetch-data-store="jobs/favorites" empty-results-text="Aún no tienes ninguna búsqueda guardada">
            <template #skeleton>
                <Skeleton></Skeleton>
            </template>

            <template #default="{ items }">
                <ion-list class="ion-margin-top">
                    <Job :job="job" v-for="job in items" :key="job.id">
                      <ion-icon class="ion-padding job-action" @click="showOptions(job)" color="medium" :md="ellipsisHorizontalOutline" :ios="ellipsisHorizontalOutline"/>
                    </Job>
                </ion-list>
            </template>
      </InfinitePagination>
    </graduados-app>
  </template>
  
  <script setup lang="ts">
    import { IonList, IonIcon } from '@ionic/vue';
    import Skeleton from "./Skeleton.vue";
    import Job from "./components/Job.vue";
    import { ellipsisHorizontalOutline, trashOutline } from 'ionicons/icons';
    import InfinitePagination from '../app/components/pagination/InfinitePagination.vue';
    import { useStore } from 'vuex';
    import { ref } from 'vue';

    const store = useStore();
    const pagination = ref(false);
    
    function showOptions(job){
      store.dispatch("ui/action/show", [
          {
              text: 'Eliminar de mis favoritos',
              role: 'destructive',
              icon: trashOutline,
              data: {
                  job:job,
                  action:"delete",
              },
              handler: () => {
                deleteJob(job)
              }
          },
      ])
    }

    function deleteJob(job){
      const id = typeof job == 'object' ? job.id : job;
      
      store.dispatch("jobs/removeFavorite", { id })

      pagination.value.removeItem(id);

      store.dispatch("ui/toastr/create", "Búsqueda eliminada.")
    }
</script>

<style scoped>
  .job-action{
    position: absolute;
    top: 0;
    right: 0;
  }
</style>