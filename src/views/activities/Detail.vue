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
    <div v-if="workshop && loaded" class="workshop-detail">
      <header class="workshop-header">
        <div class="workshop-tags">
          <span
            v-if="workshop.modality"
            class="tag tag--modality"
            :class="`tag--${modalityKind}`"
          >
            <ion-icon :icon="modalityIcon" aria-hidden="true"></ion-icon>
            {{ workshop.modality }}
          </span>
          <span v-if="unavailableLabel" class="tag tag--muted">
            {{ unavailableLabel }}
          </span>
          <span v-if="workshop.period?.value" class="tag tag--muted">
            {{ workshop.period.value }}
          </span>
        </div>
        <h1 class="workshop-title">{{ workshop.title }}</h1>
        <p class="workshop-teachers" v-if="workshop.teachers">
          <ion-icon :icon="personCircleOutline" aria-hidden="true"></ion-icon>
          {{ workshop.teachers }}
        </p>
      </header>

      <section class="info-card" aria-label="Datos del taller">
        <div class="info-row">
          <span class="info-icon" aria-hidden="true">
            <ion-icon :icon="calendarOutline"></ion-icon>
          </span>
          <div class="info-text">
            <span class="info-label">Inicio</span>
            <span class="info-value">{{ startLabel }}</span>
          </div>
        </div>

        <div class="info-row" v-if="workshop.days_and_hours">
          <span class="info-icon" aria-hidden="true">
            <ion-icon :icon="timeOutline"></ion-icon>
          </span>
          <div class="info-text">
            <span class="info-label">Horario</span>
            <span class="info-value">{{ workshop.days_and_hours }}</span>
          </div>
        </div>

        <div class="info-row" v-if="workshop.modality">
          <span class="info-icon" aria-hidden="true">
            <ion-icon :icon="modalityIcon"></ion-icon>
          </span>
          <div class="info-text">
            <span class="info-label">Modalidad</span>
            <span class="info-value">{{ workshop.modality }}</span>
          </div>
        </div>

        <div class="info-row" v-if="workshop.classes_count">
          <span class="info-icon" aria-hidden="true">
            <ion-icon :icon="hourglassOutline"></ion-icon>
          </span>
          <div class="info-text">
            <span class="info-label">Duración</span>
            <span class="info-value">{{ classesLabel }}</span>
          </div>
        </div>

        <div class="info-row" v-if="workshop.can_enroll">
          <span class="info-icon" aria-hidden="true">
            <ion-icon :icon="journalOutline"></ion-icon>
          </span>
          <div class="info-text">
            <span class="info-label">Costo</span>
            <!-- price puede venir null (talleres sin valor cargado = gratuitos) -->
            <span
              class="info-value"
              :class="{ 'is-free': !(workshop.price && workshop.price.raw > 0) }"
            >
              {{
                workshop.price && workshop.price.raw > 0
                  ? workshop.price.value
                  : 'Gratuito'
              }}
            </span>
          </div>
        </div>
      </section>

      <section class="workshop-section" v-if="hasContent">
        <h2 class="section-title">Temario</h2>
        <div class="content" v-html="workshop.content"></div>
      </section>

      <section
        class="workshop-section"
        v-if="workshop.files && workshop.files.length && workshop.is_enrolled"
      >
        <h2 class="section-title">Bibliografía</h2>
        <ion-list class="bibliography-list">
          <BibliographyItem
            v-for="file in workshop.files"
            :file="file"
            :key="file.id"
          ></BibliographyItem>
        </ion-list>
      </section>
    </div>
    <template v-if="workshop && loaded" #footer>
      <!-- Anónimo con taller disponible: login (con retorno a este detalle).
           Si el taller no está disponible, cae a la rama siguiente y ve el
           mismo botón deshabilitado + motivo que un usuario logueado. -->
      <div v-if="!isLoggedIn && workshopAvailable">
        <ion-button
          @click="goToLogin()"
          shape="round"
          expand="full"
          color="primary"
        >
          <ion-icon :icon="schoolOutline" slot="start"></ion-icon>
          Iniciá sesión para inscribirte
        </ion-button>
        <ion-text color="medium" class="ion-text-center ion-margin-top">
          <small>Para inscribirte necesitás iniciar sesión con tu cuenta de graduado.</small>
        </ion-text>
      </div>

      <!-- Botón de inscripción -->
      <div v-else-if="workshop.can_enroll || (!workshop.is_enrolled && !workshop.can_unenroll)">
        <ion-button 
          @click="confirm" 
          shape="round" 
          expand="full" 
          color="primary"
          :disabled="!canEnrollNow()"
        >
          <ion-icon :icon="schoolOutline" slot="start"></ion-icon>
          {{ getEnrollButtonText() }}
        </ion-button>
        <ion-text 
          v-if="!canEnrollNow() && enrollmentMessage" 
          color="medium" 
          class="ion-text-center ion-margin-top"
        >
          <small>{{ enrollmentMessage }}</small>
        </ion-text>
      </div>
      
      <!-- Botón de desinscripción -->
      <div v-else-if="workshop.can_unenroll && !mustPay()">
        <ion-button
          @click="unenroll"
          shape="round"
          expand="full"
          color="danger"
          fill="outline"
        >
          <ion-icon :icon="exitOutline" slot="start"></ion-icon>
          Desincribirse
        </ion-button>
      </div>
      
      <!-- Estado ya inscrito -->
      <div v-else-if="workshop.is_enrolled">
        <ion-button
          shape="round"
          expand="full"
          color="success"
          fill="outline"
          disabled
        >
          <ion-icon :icon="checkmarkCircleOutline" slot="start"></ion-icon>
          Ya estás inscrito
        </ion-button>
      </div>
    </template>
    
    <!-- Componente de compartir social -->
    <SocialShare
      v-if="workshop && loaded"
      :share-data="{
        title: workshop.title,
        text: `${workshop.teachers ? 'Docentes: ' + workshop.teachers + ' - ' : ''}${workshop.start ? 'Inicio: ' + workshop.start : ''}`,
        type: 'taller'
      }"
    />
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
  schoolOutline,
  exitOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import BibliographyItem from '../bibliography/components/BibliographyItem.vue'
import { parseApiDate } from '@/libs/dates'
import {
  modalityKind as resolveModalityKind,
  modalityIcon as resolveModalityIcon,
} from '@/utils/modality'
import SocialShare from '@/components/SocialShare.vue'
import { useCurrentUser } from '@/uses/currentUser'
import { useRequireAuth } from '@/uses/requireAuth'
import { refreshUser } from '@/uses/session'

const ionRouter = useIonRouter()
const loaded = ref(false)
const store = useStore()
const route = useRoute()
const workshop = ref<any>({})
const router = useIonRouter()

// Gate a nivel usuario (can_operate / operability_issue).
const { canOperate, operabilityIssue } = useCurrentUser()

// Anónimos: el footer muestra "Iniciá sesión para inscribirte" (con retorno acá).
const { isLoggedIn, goToLogin } = useRequireAuth()

// Disponibilidad pura del taller (independiente del usuario).
const workshopAvailable = computed(
  () =>
    !workshop.value?.is_ended &&
    !workshop.value?.is_full &&
    !workshop.value?.registration_closed
)

const modalityKind = computed(() => resolveModalityKind(workshop.value?.modality))
const modalityIcon = computed(() => resolveModalityIcon(modalityKind.value))

// El detalle devuelve la fecha ISO (2026-08-20); el listado ya la muestra legible.
const startLabel = computed(() => {
  const date = parseApiDate(workshop.value?.start)
  if (!date) return 'Por confirmar'
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const classesLabel = computed(() => {
  const count = workshop.value?.classes_count ?? 0
  return `${count} ${count === 1 ? 'clase' : 'clases'}`
})

// content puede venir como "" o con HTML vacío; así no dibujamos la sección.
const hasContent = computed(() =>
  Boolean(workshop.value?.content?.replace(/<[^>]*>/g, '').trim())
)

// Motivo por el que el taller no está disponible (null = disponible).
const unavailableLabel = computed(() => {
  if (workshop.value?.is_ended) return 'Finalizado'
  if (workshop.value?.is_full) return 'Sin cupos'
  if (workshop.value?.registration_closed) return 'Inscripciones cerradas'
  return null
})

// Mensaje para estados de inscripción
const enrollmentMessage = computed(() => {
  if (!workshop.value) return '';

  // Gate de usuario primero: si no puede operar y hay motivo, lo mostramos.
  if (!canOperate.value && operabilityIssue.value) return operabilityIssue.value;

  if (workshop.value.is_full) return 'Taller completo - Sin cupos disponibles';
  if (workshop.value.is_ended) return 'Taller finalizado';
  if (workshop.value.registration_closed) return 'Inscripciones cerradas';

  return '';
})

// Verificar si se puede inscribir ahora
function canEnrollNow() {
  if (!workshop.value) return false;

  // Gate a nivel usuario: si no puede operar, no se puede inscribir.
  if (!canOperate.value) return false;

  // Los bloqueos ganan siempre, incluso si can_enroll viene en true:
  // el enroll del backend valida estas condiciones y rechazaría igual.
  if (workshop.value.is_ended ||
      workshop.value.is_full ||
      workshop.value.registration_closed) {
    return false;
  }

  // Si el backend permite explícitamente la inscripción
  if (workshop.value.can_enroll) return true;

  // Si no está inscrito
  if (!workshop.value.is_enrolled) return true;

  return false;
}

// Texto dinámico para el botón de inscripción
function getEnrollButtonText() {
  if (!workshop.value) return 'Inscribirse';
  
  if (workshop.value.price && workshop.value.price.raw > 0) {
    return `Inscribirse - $${workshop.value.price.value}`;
  }
  
  return 'Inscribirse';
}

function mustPay() {
  return workshop.value?.price?.raw > 0 || false
}
function goBack() {
  router.replace({ name: 'activities.index' })
}
const confirm = () => {
  if (!isLoggedIn.value) return goToLogin()
  return store.dispatch('ui/alert/confirm', {
    header: 'Inscripción',
    subHeader: '¿Estás seguro de que deseas inscribirte a este taller?',
    handler: mustPay() ? preEnroll : enroll,
  })
}

// Si el backend rechaza la operación, sus flags (can_enroll, is_ended, etc.)
// quedaron desactualizados en pantalla: los re-sincronizamos para que el
// botón se deshabilite y aparezca el motivo. El toast lo muestra el
// interceptor global de 422 (validationManager).
const refreshWorkshop = () =>
  store.dispatch('workshops/fetch', workshop.value?.id).then((response) => {
    workshop.value = response.data.data
  })

const unenroll = () =>
  store.dispatch('ui/alert/confirm', {
    header: 'Desinscripción',
    subHeader: '¿Estás seguro de que deseas darte de baja de este taller?',
    handler: () =>
      store
        .dispatch('workshops/unenroll', workshop.value?.id)
        .then(() => {
          ionRouter.navigate(
            `/talleres/desinscripcion-exitosa`,
            'forward',
            'replace'
          )
        })
        .catch(() => refreshWorkshop()),
  })

const enroll = function () {
  store
    .dispatch('workshops/enroll', workshop.value?.id)
    .then(() => {
      const route = mustPay() ? 'pago-exitoso' : 'inscripcion-exitosa'
      ionRouter.navigate(`/talleres/${route}`, 'forward', 'replace')
    })
    .catch(() => refreshWorkshop())
}

const preEnroll = function () {
  store
    .dispatch('workshops/preEnroll', workshop.value?.id)
    .then((response) => {
      ionRouter.navigate(
        `/inscripciones/${response.data.data.id}/datos-bancarios`,
        'forward',
        'replace'
      )
    })
    .catch(() => refreshWorkshop())
}

onMounted(() => {
  // Gate al día: refrescamos can_operate antes de habilitar la inscripción.
  refreshUser()
  const { slug } = route.params
  store.dispatch('workshops/fetch', slug).then((response) => {
    workshop.value = response.data.data
    loaded.value = true
  }).catch(() => {
    loaded.value = true
  })
})
</script>

<style scoped>
/* El padding horizontal lo pone el layout (.page-body): acá solo ritmo vertical. */
.workshop-detail {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-xl);
  padding-bottom: var(--app-spacing-lg);
}

.workshop-header {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-sm);
}

.workshop-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--app-spacing-sm);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--app-spacing-xs);
  padding: 5px 10px;
  border-radius: var(--app-radius-pill);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}

.tag ion-icon {
  font-size: 14px;
}

.tag--modality {
  background: var(--app-primary-soft);
  color: var(--ion-color-primary-shade);
}

.tag--presencial {
  background: rgba(45, 211, 111, 0.14);
  color: var(--ion-color-success-shade);
}

.tag--hibrida {
  background: rgba(255, 196, 9, 0.18);
  color: #8a6100;
}

.tag--muted {
  background: var(--app-bg);
  color: var(--app-text-secondary);
}

.workshop-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--app-text-title);
}

.workshop-teachers {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-xs);
  margin: 0;
  font-size: 14px;
  color: var(--app-text-secondary);
}

.workshop-teachers ion-icon {
  font-size: 16px;
  color: var(--ion-color-primary);
  flex-shrink: 0;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-lg);
  padding: var(--app-spacing-lg);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  box-shadow: var(--app-shadow-sm);
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: var(--app-spacing-md);
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: var(--app-radius-sm);
  background: var(--app-primary-soft);
}

.info-icon ion-icon {
  font-size: 18px;
  color: var(--ion-color-primary);
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--app-text-secondary);
}

.info-value {
  font-size: 15px;
  line-height: 1.4;
  color: var(--app-text-body);
}

.info-value.is-free {
  color: var(--ion-color-success-shade);
  font-weight: 600;
}

.workshop-section {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-sm);
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--app-text-title);
}

.bibliography-list {
  padding: 0;
  background: transparent;
}

.content {
  color: var(--app-text-body);
  font-size: 15px;
  line-height: 1.6;
}

.content :deep(p) {
  margin: 0 0 var(--app-spacing-sm);
}

.content :deep(p:last-child) {
  margin-bottom: 0;
}

.content :deep(ul),
.content :deep(ol) {
  margin: 0 0 var(--app-spacing-sm);
  padding-left: var(--app-spacing-lg);
}

.content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--app-radius-sm);
}

/* Estilos para los botones de inscripción */
ion-button[expand="full"] {
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-weight: 600;
  font-size: 16px;
}

/* Mensaje de estado de inscripción */
.ion-text-center small {
  display: block;
  padding: var(--app-spacing-md);
  margin-bottom: var(--app-spacing-xs);
  background-color: var(--app-surface-alt);
  border-radius: var(--app-radius-sm);
  border-left: 3px solid var(--ion-color-medium);
  line-height: 1.4;
  text-align: left;
}
</style>
