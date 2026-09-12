<template>
  <graduados-blank body="white" :hideFabButton="true">
    <ion-text class="ion-margin-bottom">
      <h5><strong>Completá tus datos</strong></h5>
    </ion-text>
    <ion-text color="medium">
      <small>Necesitamos algunos datos para completar tu perfil antes de que puedas inscribirte.</small>
    </ion-text>

    <Form ref="form" class="ion-margin-top">
      <Field v-model="data.firstname" name="firstname" v-slot="{ field }" rules="required">
        <IonItem>
          <IonLabel position="floating">Nombre</IonLabel>
          <IonInput v-bind="field" />
        </IonItem>
        <ErrorMessage name="firstname" #default="{ message }">
          <ion-text color="danger"><small>{{ message }}</small></ion-text>
        </ErrorMessage>
      </Field>

      <Field v-model="data.lastname" name="lastname" v-slot="{ field }" rules="required">
        <IonItem>
          <IonLabel position="floating">Apellido</IonLabel>
          <IonInput v-bind="field" />
        </IonItem>
        <ErrorMessage name="lastname" #default="{ message }">
          <ion-text color="danger"><small>{{ message }}</small></ion-text>
        </ErrorMessage>
      </Field>

      <Field v-model="data.phone" name="phone" v-slot="{ field }">
        <IonItem>
          <IonLabel position="floating">Teléfono</IonLabel>
          <IonInput v-bind="field" type="tel" inputmode="tel" />
        </IonItem>
      </Field>

      <!-- Mismo picker que en Mi cuenta: item entero tappable y modal con
           botones Cancelar/Confirmar (sin show-default-buttons Ionic no
           renderiza ninguno y el calendario queda sin salida). -->
      <IonItem button :detail="false" class="birthdate-item" @click="openDatePicker">
        <IonLabel>
          <p class="birthdate-caption">Fecha de nacimiento</p>
          <h3 class="birthdate-value">{{ birthDateLabel }}</h3>
        </IonLabel>
        <ion-icon
          slot="end"
          :icon="calendarOutline"
          color="primary"
          aria-hidden="true"
        ></ion-icon>
      </IonItem>
      <ion-modal
        class="birthdate-modal"
        :is-open="showDatePicker"
        @didDismiss="showDatePicker = false"
        :keep-contents-mounted="true"
      >
        <IonDatetime
          id="birthDate"
          :key="datePickerKey"
          presentation="date"
          locale="es-AR"
          :first-day-of-week="1"
          :show-default-buttons="true"
          :value="draftBirthDate"
          :min="minBirthDate"
          :max="today"
          @ionChange="onDateChange"
          @ionCancel="showDatePicker = false"
          cancel-text="Cancelar"
          done-text="Confirmar"
        ></IonDatetime>
      </ion-modal>
    </Form>

    <template #blank-footer>
      <ion-button
        :disabled="sending"
        shape="round"
        expand="full"
        color="primary"
        @click="save"
      >{{ sending ? 'Guardando...' : 'Guardar y continuar' }}</ion-button>
    </template>
  </graduados-blank>
</template>

<script setup lang="ts">
import { useProfile } from '@/uses/profile'
import { parseApiDate } from '@/libs/dates'
import User from '@/utils/user'
import {
  IonButton,
  IonDatetime,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonText,
  useIonRouter,
} from '@ionic/vue'
import { calendarOutline } from 'ionicons/icons'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'

const ionRouter = useIonRouter()
const store = useStore()
const form = ref<any>(null)
const sending = ref(false)
const showDatePicker = ref(false)
// Sólo la parte de fecha: con la hora incluida el día de hoy queda fuera de :max.
const today = new Date().toISOString().split('T')[0]
const minBirthDate = '1920-01-01'
const defaultBirthDate = `${new Date().getFullYear() - 30}-01-01`
const draftBirthDate = ref<string | undefined>(undefined)
// Ver Profile.vue: con keep-contents-mounted el calendario no salta al mes del
// `value`, así que lo remontamos en cada apertura.
const datePickerKey = ref(0)

const existing = User.get() || {}
const data = reactive({
  firstname: existing.firstname || '',
  lastname: existing.lastname || '',
  phone: existing.phone || '',
  birth_date: existing.birth_date || '',
})

// Texto del botón: la fecha cargada o la invitación a elegirla.
const birthDateLabel = computed(() => {
  const date = parseApiDate(data.birth_date)
  if (!date) return 'Seleccionar'

  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

function openDatePicker() {
  // Sin fecha previa abrimos ~30 años atrás: arrancar en "hoy" con :max=hoy
  // muestra una grilla casi toda deshabilitada y parece rota.
  draftBirthDate.value = data.birth_date || defaultBirthDate
  datePickerKey.value += 1
  showDatePicker.value = true
}

function onDateChange(event: any) {
  const iso = event.detail.value
  if (!iso) return
  // IonDatetime devuelve ISO; el backend espera YYYY-MM-DD.
  data.birth_date = String(iso).split('T')[0]
  // Con show-default-buttons esto llega al confirmar: ya podemos cerrar.
  showDatePicker.value = false
}

function save() {
  form.value.validate().then((r: any) => {
    if (!r.valid) return
    sending.value = true
    useProfile()
      .update(data)
      .then((user: any) => {
        store.dispatch('ui/toastr/success', 'Datos guardados.')
        if (user?.profile_complete === false) {
          store.dispatch('ui/toastr/danger', 'Todavía faltan datos obligatorios.')
          sending.value = false
          return
        }
        ionRouter.navigate('/', 'forward', 'replace')
      })
      .catch(() => {
        sending.value = false
      })
  })
}
</script>
