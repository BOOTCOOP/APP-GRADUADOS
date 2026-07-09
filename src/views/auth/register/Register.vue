<template>
  <graduados-blank body="white" :hideFabButton="true">
    <ion-text class="ion-margin-bottom">
      <h5 style="display: flex; align-items: center">
        <ion-icon
          @click="stepBack"
          class="ion-margin-end"
          v-show="canGoBack"
          color="primary"
          :ios="arrowBackOutline"
          :md="arrowBackOutline"
        ></ion-icon>
        <strong>Registro</strong>
      </h5>
    </ion-text>

    <!-- PASO 1: DNI -->
    <Form v-if="stage === 'dni'" ref="dniForm">
      <ion-card class="info-card ion-margin-bottom">
        <ion-card-content>
          <div class="info-content">
            <ion-icon :icon="informationCircleOutline" color="primary"></ion-icon>
            <ion-text>
              <p><strong>Ingresá tu DNI para comenzar.</strong></p>
              <p class="info-detail">
                Verificamos tu identidad contra el padrón de la facultad para darte
                acceso a los beneficios de graduados.
              </p>
            </ion-text>
          </div>
        </ion-card-content>
      </ion-card>

      <Field v-model="dni" name="dni" v-slot="{ field }" rules="required|numeric">
        <IonItem>
          <IonLabel position="floating">DNI</IonLabel>
          <IonInput v-bind="field" inputmode="numeric" />
        </IonItem>
        <ErrorMessage name="dni" #default="{ message }">
          <ion-text color="danger"><small>{{ message }}</small></ion-text>
        </ErrorMessage>
      </Field>
    </Form>

    <!-- PASO 2 (Caso B): email + password + tipo (+ documento si otra universidad) -->
    <Form v-else-if="stage === 'form'" ref="registerForm">
      <ion-card class="info-card ion-margin-bottom">
        <ion-card-content>
          <div class="info-content">
            <ion-icon :icon="informationCircleOutline" color="primary"></ion-icon>
            <ion-text>
              <p><strong>Usá un email al que tengas acceso.</strong></p>
              <p class="info-detail">
                Te enviaremos un enlace para confirmar tu cuenta y ahí recibirás tus
                constancias.
              </p>
            </ion-text>
          </div>
        </ion-card-content>
      </ion-card>

      <Field
        v-model="data.email"
        name="email"
        v-slot="{ field }"
        rules="required|email"
      >
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput v-bind="field" type="email" inputmode="email" />
        </IonItem>
        <ErrorMessage name="email" #default="{ message }">
          <ion-text color="danger"><small>{{ message }}</small></ion-text>
        </ErrorMessage>
      </Field>

      <Field name="password" v-slot="{ field }" rules="passwordIsValid">
        <FormPasswordValidation
          v-bind="field"
          v-model:password="data.password"
          v-model:password_confirmation="data.password_confirmation"
          @password-is-valid="(v) => (passwordValidation = v)"
        ></FormPasswordValidation>
        <ErrorMessage name="password" #default="{ message }">
          <ion-text color="danger"><small>{{ message }}</small></ion-text>
        </ErrorMessage>
      </Field>

      <!-- Selector de tipo (4 opciones) -->
      <div class="graduate-type ion-margin-top">
        <ion-card
          v-for="type in userTypes"
          :key="type.id"
          :class="{ selected: data.type_id === type.id }"
          @click="selectType(type.id)"
        >
          <ion-card-content>
            <ion-text>{{ type.label }}</ion-text>
            <ion-icon
              :md="schoolOutline"
              :ios="schoolOutline"
              size="large"
              color="primary"
            ></ion-icon>
          </ion-card-content>
        </ion-card>
        <ion-text v-if="typeError" color="danger">
          <small>Elegí una categoría para continuar.</small>
        </ion-text>
      </div>

      <!-- Documento (solo Graduado otra universidad = 4) -->
      <div v-if="isOtherUniversity(data.type_id)" class="ion-margin-top">
        <ion-text color="medium">
          <p><small>Para validar tu título de otra universidad podés adjuntar el
          documento ahora o hacerlo más tarde desde tu perfil.</small></p>
        </ion-text>

        <label v-if="!verifyLater && !documento" class="box" for="documento">
          <input
            type="file"
            id="documento"
            name="documento"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            @change="onDocumentPicked"
          />
          <div class="container">
            <ion-icon color="primary" size="large" :md="cloudUploadOutline" :ios="cloudUploadOutline"></ion-icon>
            <ion-text>Adjuntar documento</ion-text>
            <ion-text color="medium"><small>PDF/JPG/PNG/WEBP · máx 5 MB</small></ion-text>
          </div>
        </label>
        <div v-if="documento && !verifyLater" class="box">
          <div class="container">
            <ion-icon color="primary" size="large" :md="documentOutline" :ios="documentOutline"></ion-icon>
            <ion-text>{{ documento.name }}</ion-text>
            <ion-text color="primary" @click="clearDocument"><small>Quitar</small></ion-text>
          </div>
        </div>

        <IonItem lines="none" class="ion-margin-top">
          <IonCheckbox v-model="verifyLater" @ionChange="onVerifyLaterChange" slot="start"></IonCheckbox>
          <IonLabel class="ion-text-wrap"><small>Verificar luego (subir el documento más tarde)</small></IonLabel>
        </IonItem>
        <ion-text v-if="docError" color="danger">
          <small>Adjuntá el documento o marcá "Verificar luego" para continuar.</small>
        </ion-text>
      </div>
    </Form>

    <!-- REVISÁ TU MAIL (Caso A y B) -->
    <div v-else-if="stage === 'checkMail'" class="ion-text-center ion-padding">
      <ion-icon :icon="mailOutline" color="primary" style="font-size: 64px"></ion-icon>
      <ion-text><h6><strong>Revisá tu correo</strong></h6></ion-text>
      <ion-text color="medium" v-if="mailMode === 'A'">
        <p><small>
          Ya existe una cuenta asociada a ese DNI. Te enviamos un enlace a
          <strong>{{ maskedEmail }}</strong> para que crees tu contraseña.
        </small></p>
      </ion-text>
      <ion-text color="medium" v-else>
        <p><small>
          Te enviamos un enlace de confirmación<span v-if="maskedEmail"> a
          <strong>{{ maskedEmail }}</strong></span>. Confirmá tu cuenta y volvé a
          iniciar sesión.
        </small></p>
      </ion-text>
      <ion-text
        v-if="mailMode === 'A'"
        color="primary"
        class="link"
        @click="goToDispute"
      ><small>No tengo acceso a ese mail</small></ion-text>
    </div>

    <!-- DISPUTA / CONTACTAR ADMINISTRACIÓN -->
    <div v-else-if="stage === 'dispute'">
      <ion-card class="info-card ion-margin-bottom">
        <ion-card-content>
          <div class="info-content">
            <ion-icon :icon="alertCircleOutline" color="warning"></ion-icon>
            <ion-text>
              <p><strong>Necesitamos validar tu identidad manualmente.</strong></p>
              <p class="info-detail">{{ disputeReasonText }}</p>
            </ion-text>
          </div>
        </ion-card-content>
      </ion-card>

      <Form ref="disputeForm">
        <Field v-model="contacto" name="contacto" v-slot="{ field }" rules="required|email">
          <IonItem>
            <IonLabel position="floating">Email de contacto</IonLabel>
            <IonInput v-bind="field" type="email" />
          </IonItem>
          <ErrorMessage name="contacto" #default="{ message }">
            <ion-text color="danger"><small>{{ message }}</small></ion-text>
          </ErrorMessage>
        </Field>
        <ion-text color="medium">
          <p><small>
            A este email te va a contactar administración y puede llegarte el
            enlace para crear tu contraseña.
          </small></p>
        </ion-text>
      </Form>
    </div>

    <!-- DISPUTA ENVIADA -->
    <div v-else-if="stage === 'disputeDone'" class="ion-text-center ion-padding">
      <ion-icon :icon="checkmarkCircleOutline" color="success" style="font-size: 64px"></ion-icon>
      <ion-text><h6><strong>Solicitud recibida</strong></h6></ion-text>
      <ion-text color="medium">
        <p><small>Administración revisará tu caso y te responderá al email que informaste. Gracias.</small></p>
      </ion-text>
    </div>

    <!-- CUENTA YA EXISTENTE -->
    <div v-else-if="stage === 'accountExists'" class="ion-text-center ion-padding">
      <ion-icon :icon="alertCircleOutline" color="medium" style="font-size: 64px"></ion-icon>
      <ion-text><h6><strong>Ya tenés una cuenta</strong></h6></ion-text>
      <ion-text color="medium">
        <p><small>Existe una cuenta activa para ese DNI. Iniciá sesión con tu contraseña.</small></p>
      </ion-text>
    </div>

    <template #blank-footer>
      <ion-button
        v-if="footerButton"
        :disabled="sending"
        shape="round"
        color="primary"
        @click="footerButton.action"
        expand="full"
      >{{ sending ? 'Enviando...' : footerButton.text }}</ion-button>
    </template>
  </graduados-blank>
</template>

<script setup lang="ts">
import { useAuth } from '@/uses/auth'
import { USER_TYPES, isOtherUniversity } from '@/utils/userTypes'
import FormPasswordValidation from '@/views/app/components/form/FormPasswordValidation.vue'
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  useIonRouter,
} from '@ionic/vue'
import {
  alertCircleOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  cloudUploadOutline,
  documentOutline,
  informationCircleOutline,
  mailOutline,
  schoolOutline,
} from 'ionicons/icons'
import { ErrorMessage, Field, Form, defineRule } from 'vee-validate'
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'

const MAX_DOC_BYTES = 5 * 1024 * 1024
const userTypes = USER_TYPES

defineRule('passwordIsValid', () => {
  if (passwordValidation.value) return true
  return 'Revisá las contraseñas'
})

const ionRouter = useIonRouter()
const store = useStore()

const dniForm = ref<any>(null)
const registerForm = ref<any>(null)
const disputeForm = ref<any>(null)

const sending = ref(false)
const passwordValidation = ref<boolean | null>(null)

// Máquina de estados del wizard: dni → form | checkMail | dispute
const stage = ref<'dni' | 'form' | 'checkMail' | 'dispute' | 'disputeDone' | 'accountExists'>('dni')

const dni = ref('')
const contacto = ref('')
const maskedEmail = ref('')
const mailMode = ref<'A' | 'B'>('B')
const disputeReason = ref<string>('')

const typeError = ref(false)
const docError = ref(false)
const verifyLater = ref(false)
const documento = ref<File | null>(null)

const data = reactive({
  email: '',
  password: '',
  password_confirmation: '',
  type_id: null as number | null,
})

const canGoBack = computed(() => stage.value === 'form')

const disputeReasonText = computed(() => {
  if (disputeReason.value === 'multiple')
    return 'Tu DNI figura más de una vez en el padrón. Dejanos un contacto y lo resolvemos.'
  if (disputeReason.value === 'no_email')
    return 'No encontramos un email asociado a tu DNI en el padrón. Dejanos un contacto.'
  return 'No pudiste resolverlo automáticamente. Dejanos un contacto y te ayudamos.'
})

const footerButton = computed(() => {
  switch (stage.value) {
    case 'dni':
      return { text: 'Continuar', action: submitDni }
    case 'form':
      return { text: 'Finalizar', action: submitRegister }
    case 'checkMail':
      return { text: 'Ir al login', action: goToLogin }
    case 'dispute':
      return { text: 'Enviar solicitud', action: submitDispute }
    case 'disputeDone':
    case 'accountExists':
      return { text: 'Ir al login', action: goToLogin }
    default:
      return null
  }
})

function selectType(id: number) {
  data.type_id = id
  typeError.value = false
  docError.value = false
  // Al cambiar de tipo, limpiamos el documento si ya no aplica.
  if (!isOtherUniversity(id)) {
    documento.value = null
    verifyLater.value = false
  }
}

function onVerifyLaterChange() {
  if (verifyLater.value) {
    documento.value = null
    docError.value = false
  }
}

function onDocumentPicked(event: any) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > MAX_DOC_BYTES) {
    store.dispatch('ui/toastr/danger', 'El documento supera los 5 MB.')
    event.target.value = ''
    return
  }
  documento.value = file
  verifyLater.value = false
  docError.value = false
}

function clearDocument() {
  documento.value = null
}

// PASO 1 -----------------------------------------------------------------
async function submitDni() {
  const valid = await dniForm.value.validate()
  if (!valid.valid) return

  sending.value = true
  try {
    const res: any = await useAuth().checkDni(dni.value)
    if (res.case === 'B') {
      stage.value = 'form'
    } else if (res.case === 'A') {
      await startCaseA()
    } else {
      disputeReason.value = res.reason || ''
      stage.value = 'dispute'
    }
  } catch (e: any) {
    store.dispatch('ui/toastr/danger', 'No pudimos verificar el DNI. Intentá de nuevo.')
  } finally {
    sending.value = false
  }
}

// Caso A: reclamo por mail del legacy -------------------------------------
async function startCaseA() {
  try {
    const res: any = await useAuth().register({ dni: dni.value })
    if (res.status === 'claim_sent') {
      maskedEmail.value = res.masked_email || ''
      mailMode.value = 'A'
      stage.value = 'checkMail'
    } else if (res.status === 'dispute_required') {
      disputeReason.value = res.reason || ''
      stage.value = 'dispute'
    }
  } catch (e: any) {
    if (e.response?.status === 409) {
      stage.value = 'accountExists'
    } else {
      store.dispatch('ui/toastr/danger', 'No pudimos iniciar el registro. Intentá de nuevo.')
    }
  }
}

// PASO 2 (Caso B) ---------------------------------------------------------
async function submitRegister() {
  const valid = await registerForm.value.validate()
  if (!data.type_id) {
    typeError.value = true
    return
  }
  // Otra universidad: exige documento o el opt-in explícito de "verificar luego".
  if (isOtherUniversity(data.type_id) && !documento.value && !verifyLater.value) {
    docError.value = true
    return
  }
  if (!valid.valid) return

  sending.value = true
  try {
    const payload = buildRegisterPayload()
    const res: any = await useAuth().register(payload)
    if (res.status === 'verify_sent') {
      maskedEmail.value = res.masked_email || ''
      mailMode.value = 'B'
      stage.value = 'checkMail'
    } else if (res.status === 'dispute_required') {
      disputeReason.value = res.reason || ''
      stage.value = 'dispute'
    }
  } catch (e: any) {
    const status = e.response?.status
    if (status === 409) {
      stage.value = 'accountExists'
    } else if (status === 422 && e.response.data?.errors) {
      registerForm.value.setErrors(e.response.data.errors)
    } else {
      store.dispatch('ui/toastr/danger', 'No pudimos completar el registro. Intentá de nuevo.')
    }
  } finally {
    sending.value = false
  }
}

function buildRegisterPayload(): any {
  const base = {
    dni: dni.value,
    email: data.email,
    password: data.password,
    password_confirmation: data.password_confirmation,
    type_id: data.type_id,
  }
  // Solo mandamos multipart si hay documento (Caso B, tipo 4, sin "verificar luego").
  if (isOtherUniversity(data.type_id as number) && documento.value && !verifyLater.value) {
    const fd = new FormData()
    Object.entries(base).forEach(([k, v]) => fd.append(k, String(v)))
    fd.append('documento', documento.value)
    return fd
  }
  return base
}

// DISPUTA ----------------------------------------------------------------
function goToDispute() {
  stage.value = 'dispute'
}

async function submitDispute() {
  const valid = await disputeForm.value.validate()
  if (!valid.valid) return

  sending.value = true
  try {
    await useAuth().dispute({ dni: dni.value, contacto: contacto.value })
    stage.value = 'disputeDone'
  } catch (e: any) {
    if (e.response?.status === 409 && e.response?.data?.status === 'account_exists') {
      stage.value = 'accountExists'
    } else if (e.response?.status === 422 && e.response?.data?.message) {
      store.dispatch('ui/toastr/danger', e.response.data.message)
    } else {
      store.dispatch('ui/toastr/danger', 'No pudimos enviar la solicitud. Intentá de nuevo.')
    }
  } finally {
    sending.value = false
  }
}

function stepBack() {
  if (stage.value === 'form') stage.value = 'dni'
}

function goToLogin() {
  ionRouter.navigate('/login', 'forward', 'replace')
}
</script>

<style scoped>
ion-item ion-icon {
  align-self: end;
}
.graduate-type {
  margin-top: 24px;
}

.graduate-type ion-card ion-card-content {
  border: 1px solid var(--ion-color-step-750);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.graduate-type ion-card.selected ion-card-content {
  border-color: var(--ion-color-primary);
}

.graduate-type ion-card ion-text {
  flex-grow: 1;
  max-width: 60vw;
}

.link {
  display: inline-block;
  margin-top: 16px;
  cursor: pointer;
  text-decoration: underline;
}

.box {
  padding: 32px;
  border: dashed 1px #cacbcc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
}

.box input[type='file'] {
  display: none;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* Tarjetas informativas */
.info-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 4px solid var(--ion-color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-card ion-card-content {
  padding: 12px 16px;
}

.info-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.info-content ion-icon {
  font-size: 28px;
  min-width: 28px;
  margin-top: 2px;
}

.info-content ion-text p {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ion-color-dark);
}

.info-content ion-text p:last-child {
  margin-bottom: 0;
}

.info-detail {
  color: var(--ion-color-medium) !important;
  font-size: 13px !important;
}
</style>
