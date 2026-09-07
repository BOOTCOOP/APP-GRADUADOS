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

      <IonItem>
        <IonLabel position="stacked">Fecha de nacimiento</IonLabel>
        <!-- El botón "Seleccionar" seteaba showDatePicker, pero el modal no
             tenía is-open: no abría nada. Un único control, siempre visible,
             con el modal atado al ref. -->
        <ion-button
          fill="clear"
          size="small"
          slot="end"
          @click="showDatePicker = true"
        >
          {{ birthDateLabel }}
        </ion-button>
      </IonItem>
      <ion-modal
        :is-open="showDatePicker"
        @didDismiss="showDatePicker = false"
        :keep-contents-mounted="true"
      >
        <IonDatetime
          id="birthDate"
          presentation="date"
          :value="data.birth_date"
          :max="today"
          @ionChange="onDateChange"
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
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonText,
  useIonRouter,
} from '@ionic/vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'

const ionRouter = useIonRouter()
const store = useStore()
const form = ref<any>(null)
const sending = ref(false)
const showDatePicker = ref(false)
const today = new Date().toISOString()

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

function onDateChange(event: any) {
  const iso = event.detail.value
  if (!iso) return
  // IonDatetime devuelve ISO; el backend espera YYYY-MM-DD.
  data.birth_date = iso.split('T')[0]
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
