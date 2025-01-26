<template>
  <graduados-app
    header-title="Mis publicaciones"
    :header-show-back-button="true"
  >
    <template #header-start>
      <ion-button @click="goBack">
        <ion-icon :md="arrowBackOutline" :ios="arrowBackOutline"></ion-icon>
      </ion-button>
    </template>
    <InfinitePagination
      ref="pagination"
      fetch-data-store="jobs/myPublications"
      empty-results-text="No hay ofertas para mostrar"
    >
      <template #skeleton>
        <Skeleton></Skeleton>
      </template>

      <template #default="{ items }">
        <ion-list class="ion-margin-top">
          <Job :job="job" v-for="job in items" :key="job.id">
            <ion-icon
              class="ion-padding job-action"
              @click="showOptions(job)"
              color="medium"
              :md="ellipsisHorizontalOutline"
              :ios="ellipsisHorizontalOutline"
            />

            <template #info>
              <div
                style="display: flex; align-items: center"
                class="ion-margin-top"
              >
                <ion-text style="display: flex; align-items: center">
                  <ion-icon
                    style="font-size: 20px"
                    :md="eyeOutline"
                    :ios="eyeOutline"
                    class="ion-margin-end"
                  ></ion-icon>
                  {{ job.visits }} {{ job.visits == 1 ? 'vista' : 'vistas' }}
                </ion-text>

                <ion-text
                  v-if="job.is_rejected"
                  style="display: flex; align-items: center"
                  class="ion-padding-start"
                  color="danger"
                >
                  <ion-icon
                    style="font-size: 20px"
                    :md="closeCircleOutline"
                    :ios="closeCircleOutline"
                    class="ion-margin-end"
                  ></ion-icon>
                  Rechazado
                </ion-text>

                <ion-text
                  v-if="job.is_approval_pending"
                  style="display: flex; align-items: center"
                  class="ion-padding-start"
                  color="warning"
                >
                  <ion-icon
                    style="font-size: 20px"
                    :md="timeOutline"
                    :ios="timeOutline"
                    class="ion-margin-end"
                  ></ion-icon>
                  Pendiente
                </ion-text>

                <ion-text
                  v-if="job.is_approved && job.is_active"
                  style="display: flex; align-items: center"
                  class="ion-padding-start"
                  color="success"
                >
                  <ion-icon
                    style="font-size: 20px"
                    :md="checkmarkCircleOutline"
                    :ios="checkmarkCircleOutline"
                    class="ion-margin-end"
                  ></ion-icon>
                  Publicado
                </ion-text>
                <ion-text
                  v-if="job.is_approved && job.is_paused"
                  style="display: flex; align-items: center"
                  class="ion-padding-start"
                  color="warning"
                >
                  <ion-icon
                    style="font-size: 20px"
                    :md="warningOutline"
                    :ios="warningOutline"
                    class="ion-margin-end"
                  ></ion-icon>
                  Pausado
                </ion-text>
              </div>
            </template>
          </Job>
        </ion-list>
      </template>
    </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
import InfinitePagination from '../app/components/pagination/InfinitePagination.vue'
import { IonList, IonText, IonIcon, useIonRouter } from '@ionic/vue'
import Skeleton from './Skeleton.vue'
import Job from './components/Job.vue'
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  createOutline,
  ellipsisHorizontalOutline,
  eyeOutline,
  pauseCircleOutline,
  playCircleOutline,
  timeOutline,
  trashOutline,
  warningOutline,
  arrowBackOutline,
} from 'ionicons/icons'
import { useStore } from 'vuex'
import { ref } from 'vue'

const store = useStore()
const router = useIonRouter()
const pagination = ref(false)
function goBack() {
  router.replace({ name: 'jobs.index' })
}
function showOptions(job) {
  const buttons = [
    {
      text: 'Editar',
      icon: createOutline,
      handler: function () {
        router.push({ name: 'jobs.edit', params: { slug: job.id } })
      },
    },
    {
      text: job.is_paused ? 'Activar' : 'Pausar',
      icon: job.is_paused ? playCircleOutline : pauseCircleOutline,
      handler: () => {
        changeJobStatus(job)
      },
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      icon: trashOutline,
      handler: function () {
        deleteJob(job)
      },
    },
  ]

  if (job.is_rejected) {
    buttons.splice(0, 2)
  } else {
    if (job.is_approval_pending) {
      buttons.splice(1, 1)
    }
  }

  store.dispatch('ui/action/show', buttons)
}

function changeJobStatus(job) {
  const status = job.is_paused ? 1 : 2
  store.dispatch('jobs/switchStatus', { id: job.id, status }).then(() => {
    job.is_paused = !job.is_paused
    job.is_active = !job.is_active

    store.dispatch(
      'ui/toastr/create',
      'Búsqueda ' + (job.is_paused ? 'pausada' : 'activada') + ' con éxito'
    )
  })
}

const deleteJob = async (job) => {
  store.dispatch('ui/alert/confirm', {
    header: 'Eliminar publicación',
    subHeader: '¿Estás seguro de que deseas eliminar esta publicación?',
    handler: () => {
      store.dispatch('jobs/delete', job).then(() => {
        pagination.value.removeItem(job.id)
      })

      store.dispatch('ui/toastr/create', 'Publicación eliminada')
    },
  })
}
</script>

<style scoped>
.job-action {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
