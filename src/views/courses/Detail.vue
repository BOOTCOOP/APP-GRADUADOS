<template>
  <graduados-app
    :header-title="course.title"
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
    <div v-if="course && loaded">
      <ion-text color="medium"
        ><small>{{ course.date }}</small></ion-text
      >
      <h4 class="ion-no-margin">{{ course.title }}</h4>
      <div class="ion-margin-top">
        <ion-icon
          :md="personCircleOutline"
          :ios="personCircleOutline"
          color="primary"
        ></ion-icon>
        <ion-text color="medium"
          ><strong>Docentes:</strong> {{ course.teachers }}</ion-text
        >
      </div>
      <div class="ion-margin-top">
        <ion-icon
          :md="calendarOutline"
          :ios="calendarOutline"
          color="primary"
        ></ion-icon>
        <ion-text color="medium"
          ><strong>Inicio:</strong> {{ course.start }}</ion-text
        >
      </div>
      <div class="ion-margin-top">
        <ion-icon
          :md="timeOutline"
          :ios="timeOutline"
          color="primary"
        ></ion-icon>
        <ion-text color="medium"
          ><strong>Horario:</strong> {{ course.days_and_hours }}</ion-text
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
          {{ course.classes_count }} clases</ion-text
        >
      </div>
      <div class="ion-margin-top" v-if="course.can_enroll">
        <ion-icon
          :md="journalOutline"
          :ios="journalOutline"
          color="primary"
        ></ion-icon>
        <ion-text color="medium" v-if="course.price.value > 0"
          ><strong>Costo:</strong> {{ course.price.value }}</ion-text
        >
        <ion-text color="medium" v-else
          ><strong>Costo:</strong> Gratuito</ion-text
        >
      </div>
      <div class="content ion-margin-top" v-html="course.content"></div>
      <ion-list
        class="ion-margin-top"
        v-if="course.files && course.files.length && course.is_enrolled"
      >
        <h6 class="ion-margin-start ion-no-margin">Bibliografía</h6>
        <BibliographyItem
          v-for="file in course.files"
          :file="file"
          :key="file.id"
        ></BibliographyItem>
      </ion-list>
    </div>
    <template v-if="course && loaded" #footer>
      <div v-if="course.can_enroll">
        <ion-button
          @click="confirm()"
          id="present-alert"
          shape="round"
          expand="full"
          color="primary"
          >Inscribirse</ion-button
        >
      </div>
      <div v-else>
        <p class="ion-text-center">
          El curso es apto sólo para: [listar usuarios]
        </p>
      </div>
      <div v-if="course.can_unenroll && !mustPay()">
        <ion-button
          @click="unenroll"
          id="present-alert"
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
  IonList,
  IonButton,
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
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import User from '@/utils/user'
import BibliographyItem from '../bibliography/components/BibliographyItem.vue'

const ionRouter = useIonRouter()
const loaded = ref(false)
const store = useStore()
const route = useRoute()
const course = ref({})
const myActivities = ref([])
const router = useIonRouter()

function mustPay() {
  return course.value.price.raw > 0
}
function goBack() {
  router.replace({ name: 'courses.index' })
}
const confirm = () =>
  store.dispatch('ui/alert/confirm', {
    header: 'Inscripción',
    subHeader: '¿Estás seguro de que deseas inscribirte a este curso?',
    handler: mustPay() ? preEnroll : enroll,
  })

const enroll = function () {
  store
    .dispatch('courses/enroll', course.value.id)
    .then((response) => {
      console.log('Inscripción exitosa')
      ionRouter.navigate('/cursos/inscripcion-exitosa', 'forward', 'replace')
    })
    .catch((response) => {
      console.log(response)
    })
}

const unenroll = () =>
  store.dispatch('ui/alert/confirm', {
    header: 'Desinscripción',
    subHeader: '¿Estás seguro de que deseas darte de baje de este curso?',
    handler: store
      .dispatch('workshops/preEnroll', course.value.id)
      .then((response) => {
        ionRouter.navigate(
          `/tallers/desinscripcion-exitosa`,
          'forward',
          'replace'
        )
      })
      .catch((response) => {
        console.log(response)
      }),
  })

const preEnroll = function () {
  store
    .dispatch('courses/preEnroll', course.value.id)
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
  store.dispatch('courses/fetch', slug).then((response) => {
    course.value = response.data.data
    loaded.value = true
  })
  store.dispatch('courses/own').then((response) => {
    myActivities.value = response.data.data
  })
})
</script>

<style scoped>
.content {
  color: var(--ion-color-step-500);
  font-size: 14px;
}
</style>
