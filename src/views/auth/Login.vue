<template>
  <graduados-blank body="white" :hideFabButton="true">
    <Form ref="form" class="content">
      <ion-img src="/assets/logo/logo.png" />
      <div>
        <Field v-model="email" name="email" v-slot="{ field }" rules="required">
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput v-bind="field" />
          </IonItem>
          <ErrorMessage name="email" #default="{ message }">
            <ion-text color="danger"
              ><small>{{ message }}</small></ion-text
            ></ErrorMessage
          >
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
            <ion-text color="danger"
              ><small>{{ message }}</small></ion-text
            ></ErrorMessage
          >
        </Field>
        <div>
          <ion-text
            color="medium"
            router-link="/recuperar-contrasena"
            class="ion-margin-vertical"
            ><small>¿Olvidaste tu contraseña?</small></ion-text
          >
        </div>
      </div>
      <div>
        <ion-button
          @click="login()"
          :disabled="sending"
          expand="full"
          shape="round"
          >{{ sending ? 'Ingresando...' : 'Ingresar' }}</ion-button
        >
        <div class="ion-text-center">
          <ion-text color="medium"
            >¿Aún no tenés una cuenta?
            <span @click="register()">Registrate</span>
          </ion-text>
        </div>
      </div>
    </Form>
  </graduados-blank>
</template>

<script setup lang="ts">
import { useAuth } from '@/uses/auth'
import FormPassword from '@/views/app/components/form/FormPassword.vue'
import {
  IonButton,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  useIonRouter,
} from '@ionic/vue'
import { ErrorMessage, Field, Form } from 'vee-validate'
import { ref } from 'vue'

const sending = ref(false)
const form = ref(false)
const email = ref('user@mail.com')
const password = ref('123456')

const ionRouter = useIonRouter()

function login() {
  form.value.validate().then((v) => {
    if (v.valid) {
      sending.value = true
      useAuth()
        .login(email.value, password.value)
        .then(() => {
          ionRouter.navigate('/', 'forward', 'replace')
        })
        .catch((err) => {
          form.value.setErrors(err.response.data || { email: 'Hubo un error' })
          sending.value = false
        })
    }
  })
}

function register() {
  ionRouter.push({ name: 'register' })
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
</style>
