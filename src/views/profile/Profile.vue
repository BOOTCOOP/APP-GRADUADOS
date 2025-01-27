<template>
  <graduados-app
    header-title="Mi cuenta"
    :header-show-back-button="true"
    body="white"
  >
    <Form
      ref="form"
      class="profile ion-text-center ion-margin-top ion-margin-bottom"
      v-if="profile.id"
    >
      <!-- Imagen de perfil -->
      <profile-picture
        @image-changed="setImage"
        :thumb="profile.thumb"
      ></profile-picture>

      <!-- Campo Nombre -->
      <Field
        v-model="profile.firstname"
        label="Nombre"
        name="firstname"
        v-slot="{ field }"
        rules="required"
      >
        <IonItem>
          <IonLabel position="floating">Nombre</IonLabel>
          <IonInput v-bind="field" />
        </IonItem>
        <ErrorMessage name="firstname" #default="{ message }">
          <ion-text color="danger"
            ><small>{{ message }}</small></ion-text
          >
        </ErrorMessage>
      </Field>

      <!-- Campo Apellido -->
      <Field
        v-model="profile.lastname"
        label="Apellido"
        name="lastname"
        v-slot="{ field }"
        rules="required"
      >
        <IonItem>
          <IonLabel position="floating">Apellido</IonLabel>
          <IonInput v-bind="field" />
        </IonItem>
        <ErrorMessage name="lastname" #default="{ message }">
          <ion-text color="danger"
            ><small>{{ message }}</small></ion-text
          >
        </ErrorMessage>
      </Field>

      <!-- Campo Email -->
      <Field
        v-model="profile.email"
        label="Email"
        name="email"
        v-slot="{ field }"
        rules="required|email"
      >
        <IonItem>
          <IonLabel position="floating">Email</IonLabel>
          <IonInput v-bind="field" />
        </IonItem>
        <ErrorMessage name="email" #default="{ message }">
          <ion-text color="danger"
            ><small>{{ message }}</small></ion-text
          >
        </ErrorMessage>
      </Field>

      <!-- Campo Teléfono -->
      <Field
        v-model="profile.phone"
        label="Teléfono"
        name="phone"
        v-slot="{ field }"
        rules="required|numeric"
      >
        <IonItem>
          <IonLabel position="floating">Teléfono</IonLabel>
          <IonInput type="tel" v-bind="field" />
        </IonItem>
        <ErrorMessage name="phone" #default="{ message }">
          <ion-text color="danger"
            ><small>{{ message }}</small></ion-text
          >
        </ErrorMessage>
      </Field>
    </Form>

    <template #footer>
      <ion-button
        :disabled="sending || !profile.id"
        @click="saveProfile"
        shape="round"
        expand="full"
        color="primary"
      >
        {{ sending ? 'Guardando...' : 'Guardar' }}
      </ion-button>
    </template>
  </graduados-app>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonInput, IonText, useIonRouter } from '@ionic/vue'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { Form, Field, ErrorMessage } from 'vee-validate'
import ProfilePicture from './ProfilePicture.vue'
import { useProfile } from '@/uses/profile'

const router = useIonRouter()
const store = useStore()
const sending = ref(false)
const profile = ref({
  id: 0,
  firstname: '',
  lastname: '',
  email: '',
  phone: '', 
  thumb: '',
  images: [],
})

setTimeout(() => {
  useProfile()
    .get()
    .then((p) => {
      profile.value = p
    })
}, 500)

function saveProfile() {
  sending.value = true
  useProfile()
    .update(profile.value)
    .then(() => {
      store.dispatch('ui/toastr/create', 'Datos guardados.')
    })
    .finally(() => {
      sending.value = false
    })
}

function setImage(data) {
  profile.value.thumb = data.thumb
  profile.value.images = [data.id]
}
</script>
