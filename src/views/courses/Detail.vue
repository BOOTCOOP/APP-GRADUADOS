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
      <div class="course-header ion-margin-bottom">
        <h4 class="ion-no-margin course-title">{{ course.title }}</h4>
        <ion-text color="medium" v-if="course.date">
          <small>{{ course.date }}</small>
        </ion-text>
      </div>

      <!-- Información básica del curso -->
      <div class="course-info">
        <div class="info-item ion-margin-top">
          <ion-icon
            :md="personCircleOutline"
            :ios="personCircleOutline"
            color="primary"
          ></ion-icon>
          <ion-text color="medium">
            <strong>Docentes:</strong> {{ course.teachers }}
          </ion-text>
        </div>
        
        <div class="info-item ion-margin-top">
          <ion-icon
            :md="calendarOutline"
            :ios="calendarOutline"
            color="primary"
          ></ion-icon>
          <ion-text color="medium">
            <strong>Inicio:</strong> {{ course.start }}
          </ion-text>
        </div>

        <div class="info-item ion-margin-top" v-if="course.beginning">
          <ion-icon
            :md="timeOutline"
            :ios="timeOutline"
            color="primary"
          ></ion-icon>
          <ion-text color="medium">
            <strong>Estado:</strong> {{ course.beginning }}
          </ion-text>
        </div>

        <!-- Solo mostrar si realmente existe la información -->
        <div class="info-item ion-margin-top" v-if="course.days_and_hours">
          <ion-icon
            :md="timeOutline"
            :ios="timeOutline"
            color="primary"
          ></ion-icon>
          <ion-text color="medium">
            <strong>Horario:</strong> {{ course.days_and_hours }}
          </ion-text>
        </div>

        <div class="info-item ion-margin-top" v-if="course.classes_count">
          <ion-icon
            :md="hourglassOutline"
            :ios="hourglassOutline"
            color="primary"
          ></ion-icon>
          <ion-text color="medium">
            <strong>Duración:</strong> {{ course.classes_count }} clases
          </ion-text>
        </div>

        <div class="info-item ion-margin-top" v-if="course.price && course.price.value">
          <ion-icon
            :md="journalOutline"
            :ios="journalOutline"
            color="primary"
          ></ion-icon>
          <ion-text color="medium" v-if="course.price.value > 0">
            <strong>Costo:</strong> {{ course.price.value }}
          </ion-text>
          <ion-text color="medium" v-else>
            <strong>Costo:</strong> Gratuito
          </ion-text>
        </div>
      </div>

      <!-- Contenido/Descripción del curso -->
      <div class="course-description ion-margin-top" v-if="course.content && course.content.trim()">
        <h5>Programa del Curso</h5>
        <div class="content" v-html="course.content"></div>
      </div>

      <!-- Mensaje si no hay programa disponible -->
      <div class="course-description ion-margin-top" v-else>
        <h5>Información del Programa</h5>
        <div class="content">
          <p>El programa detallado de este curso estará disponible próximamente.</p>
          <p>Para más información, puedes contactar directamente con el centro de graduados.</p>
        </div>
      </div>
    </div>
    <template v-if="course && loaded" #footer>
      <div class="footer-actions">
        <!-- Botón informativo - sin funcionalidad real de inscripción -->
        <ion-button
          @click="showInscriptionInfo"
          shape="round"
          expand="full"
          color="primary"
          class="main-action-btn"
        >
          Información sobre inscripción
        </ion-button>
        
        <!-- Mensaje informativo -->
        <div class="info-message ion-text-center ion-margin-top">
          <ion-text color="medium">
            <p><small>Para inscribirte, contacta con el centro de graduados o espera más información sobre el proceso de inscripción.</small></p>
          </ion-text>
        </div>
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
  useIonRouter,
  alertController,
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

const loaded = ref(false)
const store = useStore()
const route = useRoute()
const course = ref<any>({})
const router = useIonRouter()

function goBack() {
  router.replace({ name: 'courses.index' })
}

// Función para mostrar información sobre inscripción
async function showInscriptionInfo() {
  const alert = await alertController.create({
    header: 'Información de Inscripción',
    subHeader: course.value.title,
    message: 'Para obtener información sobre el proceso de inscripción, horarios y requisitos, contacta con el centro de graduados.',
    buttons: [
      {
        text: 'Entendido',
        role: 'confirm'
      }
    ]
  })

  await alert.present()
}

onMounted(() => {
  const { slug } = route.params
  store.dispatch('courses/fetch', slug).then((response: any) => {
    course.value = response.data.data
    loaded.value = true
    console.log('Course data structure:', course.value)
    console.log('Available properties:', Object.keys(course.value))
    console.log('Price:', course.value.price)
    console.log('Content:', course.value.content)
    console.log('Classes count:', course.value.classes_count)
    console.log('Days and hours:', course.value.days_and_hours)
  }).catch((error) => {
    console.error('Error fetching course:', error)
    loaded.value = true
  })
})
</script>

<style scoped>
.course-header {
  border-bottom: 1px solid var(--ion-color-light);
  padding-bottom: 16px;
}

.course-title {
  color: var(--ion-color-dark);
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 8px;
}

.course-info {
  margin: 24px 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}

.info-item ion-icon {
  flex-shrink: 0;
  font-size: 20px;
  margin-top: 2px;
}

.info-item ion-text {
  font-size: 1rem;
  line-height: 1.5;
}

.course-description {
  background: var(--ion-color-light, #f8f9fa);
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
}

.course-description h5 {
  color: var(--ion-color-dark);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.content {
  color: var(--ion-color-step-600);
  font-size: 1rem;
  line-height: 1.6;
}

.footer-actions {
  padding: 16px 0;
}

.main-action-btn {
  --border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  height: 56px;
}

.info-message {
  padding: 16px;
  background: var(--ion-color-light, #f8f9fa);
  border-radius: 8px;
}

.info-message p {
  margin: 0;
}

/* Responsive design */
@media (max-width: 480px) {
  .course-title {
    font-size: 1.25rem;
  }
  
  .info-item {
    flex-direction: column;
    gap: 4px;
  }
  
  .info-item ion-icon {
    align-self: flex-start;
  }
}
</style>
