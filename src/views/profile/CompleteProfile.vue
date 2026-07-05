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
        <IonDatetimeButton datetime="birthDate" v-if="data.birth_date"></IonDatetimeButton>
        <ion-button v-else fill="clear" size="small" @click="showDatePicker = true">Seleccionar</ion-button>
      </IonItem>
      <ion-modal :keep-contents-mounted="true">
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
import User from '@/utils/user'
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonText,
  useIonRouter,
} from '@ionic/vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { reactive, ref } from 'vue'
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
