<template>
  <graduados-blank body="white" :hideFabButton="true">
    <div class="login-hero">
      <ion-img :src="logo" alt="Logo Graduados" />
    </div>

    <Form ref="form">
      <Field v-model="dni" name="dni" v-slot="{ field }" rules="required|numeric">
        <IonItem>
          <IonLabel position="floating">DNI</IonLabel>
          <IonInput v-bind="field" inputmode="numeric" />
        </IonItem>
        <ErrorMessage name="dni" #default="{ message }">
          <ion-text color="danger"><small>{{ message }}</small></ion-text>
        </ErrorMessage>
      </Field>

      <Field
        name="password"
        v-model="password"
        label="contraseña"
        v-slot="{ field }"
        rules="required"
      >
        <FormPassword v-model="password" v-bind="field" label="Contraseña" />
        <ErrorMessage name="password" #default="{ message }">
          <ion-text color="danger"><small>{{ message }}</small></ion-text>
        </ErrorMessage>
      </Field>

      <ion-text
        :router-link="{ name: 'forgot-password', query: { redirect: route.query.redirect } }"
        class="forgot-link"
      ><small>¿Olvidaste tu contraseña?</small></ion-text>

      <!-- Registro sin confirmar (409 pending) -->
      <ion-card v-if="pending" class="pending-card ion-margin-top">
        <ion-card-content>
          <ion-text color="dark">
            <p><strong>Tenés un registro sin confirmar.</strong></p>
            <p class="pending-detail">
              Revisá tu correo o pedí reenviar el enlace de verificación.
            </p>
          </ion-text>

          <div v-if="changingEmail" class="ion-margin-top">
            <IonItem>
              <IonLabel position="floating">Nuevo email</IonLabel>
              <IonInput v-model="newEmail" type="email" inputmode="email" />
            </IonItem>
          </div>

          <div class="pending-actions ion-margin-top">
            <ion-button
              size="small"
              fill="outline"
              :disabled="resending"
              @click="resend()"
            >{{ resending ? 'Enviando...' : (changingEmail ? 'Enviar al nuevo mail' : 'Reenviar') }}</ion-button>
            <ion-button
              size="small"
              fill="clear"
              :disabled="resending"
              @click="toggleChangeEmail()"
            >{{ changingEmail ? 'Cancelar' : 'Cambiar mail' }}</ion-button>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-button
        @click="login()"
        :disabled="sending"
        expand="full"
        shape="round"
        >{{ sending ? 'Ingresando...' : 'Ingresar' }}</ion-button
      >

      <div class="login-form-footer">
        <ion-text color="medium"
          >¿Aún no tenés una cuenta?
          <span @click="register()">Registrate</span>
        </ion-text>
      </div>
    </Form>
  </graduados-blank>
</template>

<script setup lang="ts">
import logo from '@/assets/logo/logo.png'
import { useAuth } from '@/uses/auth'
import FormPassword from '@/views/app/components/form/FormPassword.vue'
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  useIonRouter,
} from '@ionic/vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { safeRedirect } from '@/uses/requireAuth'

const sending = ref(false)
const form = ref<any>(false)
const dni = ref('')
const password = ref('')

const pending = ref(false)
const changingEmail = ref(false)
const newEmail = ref('')
const resending = ref(false)

const ionRouter = useIonRouter()
const route = useRoute()
const store = useStore()

function login() {
  form.value.validate().then((v) => {
    if (v.valid) {
      sending.value = true
      pending.value = false
      useAuth()
        .login(dni.value, password.value)
        .then(() => {
          // Si el login se disparó desde una acción/ruta protegida, volvemos ahí.
          ionRouter.navigate(safeRedirect(route.query.redirect) ?? '/', 'forward', 'replace')
        })
        .catch((err) => {
          sending.value = false
          const status = err.response?.status
          const data = err.response?.data || {}

          if (status === 409 && data.pending) {
            // Registro sin confirmar: ofrecer reenviar / cambiar mail.
            pending.value = true
            store.dispatch('ui/toastr/create', data.dni)
          } else if (status === 422) {
            // Credenciales incorrectas (DNI o password).
            form.value.setErrors({ dni: data.dni || 'Las credenciales no coinciden con nuestros registros' })
          } else {
            form.value.setErrors({ dni: 'Hubo un error' })
          }
        })
    }
  })
}

function toggleChangeEmail() {
  changingEmail.value = !changingEmail.value
  if (!changingEmail.value) newEmail.value = ''
}

function resend() {
  resending.value = true
  const email = changingEmail.value ? newEmail.value : undefined
  useAuth()
    .resendRegistration({ dni: dni.value, email })
    .then((res: any) => {
      if (res.status === 'not_found') {
        store.dispatch('ui/toastr/danger', 'No encontramos un registro pendiente para ese DNI.')
      } else {
        store.dispatch(
          'ui/toastr/success',
          res.masked_email
            ? `Te reenviamos el enlace a ${res.masked_email}`
            : 'Te reenviamos el enlace de verificación.'
        )
        changingEmail.value = false
        newEmail.value = ''
      }
    })
    .catch(() => {
      store.dispatch('ui/toastr/danger', 'No pudimos reenviar el enlace. Intentá de nuevo.')
    })
    .finally(() => {
      resending.value = false
    })
}

function register() {
  ionRouter.push({ name: 'register', query: { redirect: route.query.redirect } })
}
</script>

<style scoped>
.content {
  min-height: calc(100vh - var(--ion-padding, 16px) - var(--ion-padding, 16px));
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

ion-img {
  width: 80%;
  margin: 0 auto;
}

.pending-card {
  border-left: 4px solid var(--ion-color-warning);
}

.pending-detail {
  font-size: 13px;
  color: var(--ion-color-medium);
  margin: 4px 0 0 0;
}

.pending-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
