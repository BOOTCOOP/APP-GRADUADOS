<template>
  <graduados-app
    header-title="Mi cuenta"
    :header-show-back-button="true"
    body="white"
  >
    <template #header-end>
      <ion-button color="dark" @click="showOptions" v-show="profile.id">
        <ion-icon
          :ios="ellipsisHorizontalCircleOutline"
          :md="ellipsisHorizontalCircleOutline"
        ></ion-icon>
        <ion-text class="ion-margin-start">Más</ion-text>
      </ion-button>
    </template>

    <div
      class="ion-text-center ion-margin-top ion-margin-bottom"
      v-if="!profile.id && loading"
    >
      <ion-thumbnail>
        <ion-skeleton-text :animated="true"></ion-skeleton-text>
      </ion-thumbnail>
      <div class="ion-margin-top" v-for="i in [0, 1, 2]" :key="i">
        <ion-label>
          <p><ion-skeleton-text :animated="true" style="height: 10px; width: 20%"></ion-skeleton-text></p>
          <h1><ion-skeleton-text :animated="true" style="height: 30px; width: 100%"></ion-skeleton-text></h1>
        </ion-label>
      </div>
    </div>

    <Form
      ref="form"
      class="profile ion-text-center ion-margin-top ion-margin-bottom"
      v-if="profile.id"
    >
      <profile-picture @image-changed="setImage" :thumb="profile.thumb"></profile-picture>

      <Field
        v-model="profile.firstname"
        label="nombre"
        name="firstname"
        v-slot="{ field }"
        rules="required"
      >
        <IonItem>
          <IonLabel position="floating">Nombre</IonLabel>
          <IonInput v-bind="field" />
        </IonItem>
        <ErrorMessage name="firstname" #default="{ message }">
          <ion-text color="danger"><small>{{ message }}</small></ion-text>
        </ErrorMessage>
      </Field>

      <Field
        v-model="profile.lastname"
        label="apellido"
        name="lastname"
        v-slot="{ field }"
        rules="required"
      >
        <IonItem>
          <IonLabel position="floating">Apellido</IonLabel>
          <IonInput v-bind="field" />
        </IonItem>
        <ErrorMessage name="lastname" #default="{ message }">
          <ion-text color="danger"><small>{{ message }}</small></ion-text>
        </ErrorMessage>
      </Field>

      <!-- Email y DNI: solo lectura (no editables por contrato) -->
      <IonItem>
        <IonLabel position="floating">Email</IonLabel>
        <IonInput :value="profile.email" readonly />
      </IonItem>
      <IonItem>
        <IonLabel position="floating">DNI</IonLabel>
        <IonInput :value="profile.dni" readonly />
      </IonItem>

      <Field v-model="profile.phone" name="phone" v-slot="{ field }">
        <IonItem>
          <IonLabel position="floating">Teléfono</IonLabel>
          <IonInput v-bind="field" type="tel" inputmode="tel" />
        </IonItem>
      </Field>

      <IonItem>
        <IonLabel position="stacked">Fecha de nacimiento</IonLabel>
        <IonDatetimeButton datetime="profileBirthDate" v-if="profile.birth_date"></IonDatetimeButton>
        <ion-note v-else slot="end">Sin definir</ion-note>
      </IonItem>
      <ion-modal :keep-contents-mounted="true">
        <IonDatetime
          id="profileBirthDate"
          presentation="date"
          :value="profile.birth_date"
          :max="today"
          @ionChange="onDateChange"
          cancel-text="Cancelar"
          done-text="Confirmar"
        ></IonDatetime>
      </ion-modal>

      <!-- Tipo de usuario + estado de validación -->
      <IonItem lines="none" class="type-row">
        <IonLabel>Categoría</IonLabel>
        <type-validation-badge :status="typeValidationStatus" slot="end" />
      </IonItem>
      <IonItem>
        <IonSelect
          v-model="selectedType"
          placeholder="Categoría"
          interface="alert"
          @ionChange="onTypeChange"
        >
          <ion-select-option
            v-for="type in userTypes"
            :key="type.id"
            :value="type.id"
          >{{ type.label }}</ion-select-option>
        </IonSelect>
      </IonItem>
      <ion-text
        v-if="showValidateLink"
        color="primary"
        class="validate-link"
        @click="goToValidation"
      ><small>Validar mi tipo de usuario</small></ion-text>
    </Form>

    <template #footer>
      <ion-button
        :disabled="sending || !profile.id"
        @click="saveProfile"
        shape="round"
        expand="full"
        color="primary"
      >{{ sending ? "Guardando..." : "Guardar" }}</ion-button>
    </template>
  </graduados-app>
</template>

<script setup lang="ts">
import TypeValidationBadge from "@/components/TypeValidationBadge.vue";
import { useCurrentUser } from "@/uses/currentUser";
import { useProfile } from "@/uses/profile";
import { USER_TYPES, isGraduateType, isOtherUniversity } from "@/utils/userTypes";
import {
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonSelect,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  useIonRouter,
} from "@ionic/vue";
import { ellipsisHorizontalCircleOutline, lockClosedOutline } from "ionicons/icons";
import { ErrorMessage, Field, Form } from "vee-validate";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import ProfilePicture from "./ProfilePicture.vue";

const sending = ref(false);
const loading = ref(true);
const router = useIonRouter();
const store = useStore();
const form = ref<any>("");
const today = new Date().toISOString();
const userTypes = USER_TYPES;

const { typeValidationStatus } = useCurrentUser();

const profile = ref<any>({
  id: 0,
  firstname: "",
  lastname: "",
  email: "",
  dni: "",
  phone: "",
  birth_date: "",
  type_id: 0,
  thumb: "",
  images: [],
});

const selectedType = ref<number | null>(null);

// Link a "validar tipo": tipos graduado (2/4/6) que no estén ya aprobados.
const showValidateLink = computed(
  () => isGraduateType(selectedType.value as number) && typeValidationStatus.value !== 2
);

onMounted(() => {
  useProfile()
    .get()
    .then((p) => {
      loading.value = false;
      if (!p) return;
      profile.value = { ...profile.value, ...p };
      profile.value.phone = p.phone || "";
      selectedType.value = p.type_id || null;
    })
    .catch(() => {
      loading.value = false;
    });
});

function onDateChange(event: any) {
  const iso = event.detail.value;
  if (!iso) return;
  profile.value.birth_date = iso.split("T")[0];
}

function onTypeChange() {
  if (!selectedType.value || selectedType.value === profile.value.type_id) return;
  const target = selectedType.value;
  store.dispatch("ui/alert/confirm", {
    header: "Cambiar categoría",
    subHeader: "Esto recalculará la validación de tu tipo de usuario. ¿Continuar?",
    handler: () => applyTypeChange(target),
    buttons: {
      // Si cancela, revertimos el select al valor actual.
      cancel: { handler: () => (selectedType.value = profile.value.type_id) },
    },
  });
}

function applyTypeChange(target: number) {
  useProfile()
    .changeType(target)
    .then((user: any) => {
      profile.value.type_id = user.type_id;
      selectedType.value = user.type_id;
      store.dispatch("ui/toastr/success", "Categoría actualizada.");
      if (isOtherUniversity(target) && user.type_validation_status === null) {
        goToValidation();
      }
    })
    .catch(() => {
      selectedType.value = profile.value.type_id;
    });
}

function goToValidation() {
  router.push({ name: "type-validation" });
}

function showOptions() {
  store.dispatch("ui/action/show", [
    {
      text: "Cambiar contraseña",
      icon: lockClosedOutline,
      handler: () => router.push({ name: "profile.password" }),
    },
  ]);
}

function saveProfile() {
  form.value.validate().then((r: any) => {
    if (r.valid) {
      sending.value = true;
      useProfile()
        .update(profile.value)
        .then(() => {
          sending.value = false;
          store.dispatch("ui/toastr/create", "Datos guardados.");
        })
        .catch(() => {
          sending.value = false;
        });
    }
  });
}

function setImage(data: any) {
  profile.value.thumb = data.thumb;
  profile.value.images = [data.id];
}
</script>

<style>
.profile ion-thumbnail {
  margin-bottom: 40px;
  overflow: hidden;
  width: 45vw;
  height: 45vw;
  margin: auto;
  border-radius: 50%;
}

.profile ion-thumbnail ion-img {
  max-width: 50%;
  margin: auto;
  border-radius: 50%;
}

.profile .thumb {
  position: relative;
  margin: auto;
  width: 180px;
  height: 180px;
  margin-bottom: 20px;
}

.profile .thumb .button {
  width: 35px;
  height: 35px;
  background-color: var(--ion-color-primary);
  border: 1px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 3%;
  top: 76%;
}
.profile .thumb .button ion-icon {
  font-size: 20px;
}

.profile .thumb ion-img {
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
  object-position: center;
  height: 100%;
  width: 100%;
}

.profile ion-item {
  --border-radius: 12px;
  --padding-start: 16px;
  --inner-padding-end: 16px;
  --border-color: var(--app-border, rgba(0, 0, 0, 0.07));
  --border-style: solid;
  --border-width: 1px;
  --inner-border-width: 0;
  --highlight-height: 0;
  --background: white;
  margin-bottom: 16px;
  box-shadow: var(--app-shadow-sm, 0 2px 10px rgba(0, 0, 0, 0.06));
  overflow: hidden;
}

.profile ion-item::part(native) {
  border-radius: 12px;
  box-shadow: none;
}

.profile ion-item.item-has-focus {
  --border-color: var(--ion-color-primary);
  box-shadow: 0 4px 12px rgba(var(--ion-color-primary-rgb), 0.14);
}

.profile ion-select {
  --color: var(--app-text-title, #1a1a2e);
  --placeholder-color: var(--app-text-body, #4e5457);
  --placeholder-opacity: 1;
  width: 100%;
}

.profile .type-row {
  margin-bottom: 0;
}

.profile .validate-link {
  display: inline-block;
  cursor: pointer;
  text-decoration: underline;
}
</style>
