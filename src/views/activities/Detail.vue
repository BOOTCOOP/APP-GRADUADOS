<template>
  <graduados-app
    :header-title="workshop.title"
    :header-show-back-button="true"
    body="white"
  >
    <template #header-start>
      <ion-button @click="goBack">
        <ion-icon :md="arrowBackOutline" :ios="arrowBackOutline"></ion-icon>
      </ion-button>
    </template>
    <div v-if="!loaded">
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
    <div v-if="workshop && loaded">
      <ion-text color="medium"
        ><small>{{ workshop.date }}</small></ion-text
      >
      <h4 class="ion-no-margin">{{ workshop.title }}</h4>
      <div class="ion-margin-top">
        <ion-icon
          :md="personCircleOutline"
          :ios="personCircleOutline"
          color="primary"
        ></ion-icon>
        <ion-text color="medium"
          ><strong>Docentes:</strong> {{ workshop.teachers }}</ion-text
        >
      </div>
      <div class="ion-margin-top">
        <ion-icon
          :md="calendarOutline"
          :ios="calendarOutline"
          color="primary"
        ></ion-icon>
        <ion-text color="medium"
          ><strong>Inicio:</strong> {{ workshop.start }}</ion-text
        >
      </div>
      <div class="ion-margin-top">
        <ion-icon
          :md="timeOutline"
          :ios="timeOutline"
          color="primary"
        ></ion-icon>
        <ion-text color="medium"
          ><strong>Horario:</strong> {{ workshop.days_and_hours }}</ion-text
        >
      </div>
      <div class="ion-margin-top">
        <ion-icon
          :md="hourglassOutline"
          :ios="hourglassOutline"
          color="primary"
        ></ion-icon>
        <ion-text color="medium"
          ><strong>Duración:</strong>
          {{ workshop.classes_count }} clases</ion-text
        >
      </div>
      <div class="ion-margin-top" v-if="workshop.can_enroll">
        <ion-icon
          :md="journalOutline"
          :ios="journalOutline"
          color="primary"
        ></ion-icon>
        <ion-text color="medium" v-if="workshop.price.value > 0"
          ><strong>Costo:</strong> {{ workshop.price.value }}</ion-text
        >
        <ion-text color="medium" v-else
          ><strong>Costo:</strong> Gratuito</ion-text
        >
      </div>
      <div class="content ion-margin-top" v-html="workshop.content"></div>
      <ion-list
        class="ion-margin-top"
        v-if="workshop.files && workshop.files.length && workshop.is_enrolled"
      >
        <h6 class="ion-margin-start ion-no-margin">Bibliografía</h6>
        <BibliographyItem
          v-for="file in workshop.files"
          :file="file"
          :key="file.id"
        ></BibliographyItem>
      </ion-list>
    </div>
    <template v-if="workshop && loaded" #footer>
      <div v-if="workshop.can_enroll">
        <ion-button @click="confirm" shape="round" expand="full" color="primary"
          >Inscribirse</ion-button
        >
      </div>
      <div v-if="workshop.can_unenroll && !mustPay()">
        <ion-button
          @click="unenroll"
          shape="round"
          expand="full"
          color="primary"
          >Desincribirse</ion-button
        >
      </div>
    </template>
  </graduados-app>
</template>

<script setup lang="ts">
import {
  IonSkeletonText,
  IonText,
  IonIcon,
  IonButton,
  IonList,
  useIonRouter,
} from '@ionic/vue'
import {
  personCircleOutline,
  calendarOutline,
  timeOutline,
  hourglassOutline,
  journalOutline,
  arrowBackOutline,
} from 'ionicons/icons'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import BibliographyItem from '../bibliography/components/BibliographyItem.vue'

const ionRouter = useIonRouter()
const loaded = ref(false)
const store = useStore()
const route = useRoute()
const workshop = ref({})
const router = useIonRouter()

function mustPay() {
  return workshop.value.price.raw > 0
}
function goBack() {
  router.replace({ name: 'activities.index' })
}
const confirm = () =>
  store.dispatch('ui/alert/confirm', {
    header: 'Inscripción',
    subHeader: '¿Estás seguro de que deseas inscribirte a este taller?',
    handler: mustPay() ? preEnroll : enroll,
  })

const unenroll = () =>
  store.dispatch('ui/alert/confirm', {
    header: 'Desinscripción',
    subHeader: '¿Estás seguro de que deseas darte de baje de este taller?',
    handler: () =>
      store
        .dispatch('workshops/unenroll', workshop.value.id)
        .then(() => {
          ionRouter.navigate(
            `/talleres/desinscripcion-exitosa`,
            'forward',
            'replace'
          )
        })
        .catch((response) => {
          console.log(response)
        }),
  })

const enroll = function () {
  console.log('enroll')
  store
    .dispatch('workshops/enroll', workshop.value.id)
    .then(() => {
      const route = mustPay() ? 'pago-exitoso' : 'inscripcion-exitosa'
      ionRouter.navigate(`/talleres/${route}`, 'forward', 'replace')
    })
    .catch((response) => {
      console.log(response)
    })
}

const preEnroll = function () {
  console.log('preEnroll')
  store
    .dispatch('workshops/preEnroll', workshop.value.id)
    .then((response) => {
      ionRouter.navigate(
        `/inscripciones/${response.data.data.id}/datos-bancarios`,
        'forward',
        'replace'
      )
    })
    .catch((response) => {
      console.log(response)
    })
}

onMounted(() => {
  const { slug } = route.params
  store.dispatch('workshops/fetch', slug).then((response) => {
    workshop.value = response.data.data
    loaded.value = true
  })
})
</script>

<style scoped>
.content {
  color: var(--ion-color-step-500);
  font-size: 14px;
}
</style>
