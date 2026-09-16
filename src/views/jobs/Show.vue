<template>
  <graduados-app
    header-title="Búsqueda laboral"
    :header-show-back-button="true"
    body="white"
  >
    <div v-if="loading">
      <ion-thumbnail
        style="width: 100%; height: 15vh"
        class="ion-margin-bottom"
      >
        <ion-skeleton-text
          :animated="true"
          style="width: 100%; height: 15vh"
        ></ion-skeleton-text>
      </ion-thumbnail>

      <ion-skeleton-text
        :animated="true"
        style="width: 100%; height: 20px"
      ></ion-skeleton-text>
      <ion-skeleton-text
        :animated="true"
        style="width: 40%; height: 20px"
      ></ion-skeleton-text>

      <div class="ion-padding-top">
        <ion-skeleton-text
          :animated="true"
          style="width: 100%"
          v-for="i in [1, 2, 3, 4, 5, 6]"
          :key="i"
        ></ion-skeleton-text>
        <ion-skeleton-text
          :animated="true"
          style="width: 20%"
        ></ion-skeleton-text>
      </div>
    </div>

    <div v-if="!loading && job">
      <ion-thumbnail class="ion-margin-bottom">
        <ion-img src="/assets/jobs/job.png"></ion-img>
      </ion-thumbnail>

      <ion-text
        ><h3>{{ job.title }}</h3></ion-text
      >

      <div class="tabs">
        <div
          class="tab"
          :class="{ selected: tab == 'information' }"
          @click="tab = 'information'"
        >
          Información
        </div>
        <div
          class="tab"
          :class="{ selected: tab == 'requirements' }"
          @click="tab = 'requirements'"
        >
          Requisitos
        </div>
        <!-- No hay solapa "Contacto" a propósito: el teléfono y el mail solo se
             alcanzan por el botón "Contactar" del pie, que es el que registra la
             postulación (ver applyAndOpenEmail). Mostrarlos como links acá
             dejaba escribir el mail sin pasar por ese registro. -->
      </div>

      <div class="ion-padding-top ion-margin-top content">
        <template v-if="tab == 'information'">
          <ion-text>
            <p><strong>Compañía: </strong> {{ job.company }}</p>
            <p>
              <strong>Descripción: </strong>
              <span v-html="job.description"></span>
            </p>
            <p><strong>Vacantes a cubrir: </strong> {{ job.vacancies_amount }}</p>
            <p><strong>Sector dentro de la organización: </strong> {{ job.position }}</p>
            <p><strong>Salario bruto aproximado: </strong> {{ job.salary_string }}</p>
          </ion-text>
        </template>
        <template v-if="tab == 'requirements'">
          <ion-text>
            <p><strong>Carrera: </strong> {{ job.career }}</p>
            <p v-if="job.orientation">
              <strong>Orientación: </strong> {{ job.orientation }}
            </p>
            <p v-if="job.language && !job.orientation">
              <strong>Idioma: </strong> {{ job.language }}
            </p>
            <p><strong>Tipo de búsqueda: </strong> {{ job.applicant_type }}</p>
            <p><strong>Modalidad: </strong> {{ job.modality }}</p>
            <p><strong>Horario de trabajo: </strong> {{ job.duration }}</p>
            <p><strong>Zona geográfica: </strong> {{ job.zone }}</p>
            <p><strong>Requisitos excluyentes: </strong> {{ job.experience }}</p>
          </ion-text>
        </template>
      </div>

      <!-- Componente de compartir social -->
      <SocialShare
        v-if="job && !loading"
        :share-data="{
          title: job.title,
          text: `Compañía: ${job.company} - ${
            job.description
              ? job.description.replace(/<[^>]*>/g, '').substring(0, 100) +
                '...'
              : ''
          }`,
          type: 'empleo',
          id: job.id,
        }"
      />
    </div>

    <template #footer v-if="!loading && !job.from_auth">
      <!-- Contactar: abre teléfono o mail y, cuando es por mail, registra la
           postulación en el sistema de graduados (ver applyAndOpenEmail). -->
      <ion-button
        class="ion-margin-bottom"
        color="primary"
        shape="round"
        expand="full"
        @click="contact"
        >Contactar</ion-button
      >
    </template>
  </graduados-app>
</template>

<script setup lang="ts">
import {
  IonThumbnail,
  IonText,
  IonImg,
  IonSkeletonText,
  IonButton,
  alertController,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import SocialShare from "@/components/SocialShare.vue";
import { useProfile } from "@/uses/profile";

const loading = ref(true);
const route = useRoute();
const store = useStore();
const profile = useProfile();
const job = ref<any>({});
const tab = ref("information");

onMounted(() => {
  const id = route.params.slug;
  store
    .dispatch("jobs/fetch", id)
    .then((response) => {
      job.value = response.data.data;
    })
    .finally(() => (loading.value = false));
});

function contact() {
  const contactOptions: Array<{ text: string; handler: () => void }> = [];

  // Priorizar teléfono si está disponible
  if (job.value.phone) {
    contactOptions.push({
      text: `📞 Llamar: ${job.value.phone}`,
      handler: () => {
        window.open(`tel:${job.value.phone}`, "_system");
      },
    });
  }

  // Agregar email si está disponible
  if (job.value.email) {
    contactOptions.push({
      text: `📧 Enviar email: ${job.value.email}`,
      handler: () => {
        applyAndOpenEmail();
      },
    });
  }

  // Si no hay opciones de contacto
  if (contactOptions.length === 0) {
    store.dispatch(
      "ui/toastr/create",
      "No hay información de contacto disponible"
    );
    return;
  }

  // Si solo hay una opción, ejecutarla directamente
  if (contactOptions.length === 1) {
    contactOptions[0].handler();
    return;
  }

  // Si hay múltiples opciones, mostrar menú
  store.dispatch("ui/action/show", contactOptions);
}
// Contacto por email: la postulación necesita nombre y apellido en el perfil
// (la API los toma del inscripto). Se chequea localmente ANTES de llamar: si
// faltan, popup para completarlos; si están, registro silencioso + mail.
async function applyAndOpenEmail() {
  const user: any = await profile.get();

  if (!user?.firstname?.trim() || !user?.lastname?.trim()) {
    promptCompleteProfile(user);
    return;
  }

  registerApplication();
  openContactEmail();
}

// Registra la postulación en el sistema de graduados de forma silenciosa:
// si falla no se bloquea ni se informa (el contacto por mail sigue igual).
// Recibe el id pelado, que es lo que espera la acción `jobs/apply`.
function registerApplication() {
  // El catch devuelve un valor en vez de tener cuerpo vacío: un `() => {}` es
  // error de ESLint (no-empty-function) y rompía `npm run lint`.
  store.dispatch("jobs/apply", job.value.id).catch(() => undefined);
}

function openContactEmail() {
  window.open(`mailto:${job.value.email}`, "_system");
}

async function promptCompleteProfile(user: any) {
  const alert = await alertController.create({
    cssClass: "app-alert",
    header: "Completá tu perfil para continuar",
    inputs: [
      {
        name: "firstname",
        type: "text",
        placeholder: "Nombre",
        value: user?.firstname || "",
      },
      {
        name: "lastname",
        type: "text",
        placeholder: "Apellido",
        value: user?.lastname || "",
      },
    ],
    buttons: [
      { text: "Cancelar", role: "cancel" },
      {
        text: "Guardar",
        handler: (values: any) => {
          const firstname = values.firstname?.trim();
          const lastname = values.lastname?.trim();

          if (!firstname || !lastname) {
            store.dispatch("ui/toastr/create", "Completá nombre y apellido");
            return false; // mantiene el popup abierto
          }

          saveProfileAndContact(firstname, lastname);
          return true;
        },
      },
    ],
  });

  alert.present();
}

// Actualiza el perfil (el backend lo escribe en el inscripto, así "Mi cuenta"
// ya lo muestra actualizado), registra la postulación y abre el mail.
function saveProfileAndContact(firstname: string, lastname: string) {
  profile
    .update({ firstname, lastname })
    .then(() => {
      registerApplication();
      openContactEmail();
    })
    .catch(() =>
      store.dispatch(
        "ui/toastr/create",
        "No pudimos actualizar tu perfil. Probá desde Mi cuenta."
      )
    );
}

</script>

<style scoped>
ion-thumbnail {
  --size: 100%;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--ion-color-step-550);
}

.tabs .tab {
  font-size: 12px;
  color: var(--ion-color-step-550);
  padding: 10px;
  position: relative;
}

.tabs .tab.selected {
  color: var(--ion-color-primary);
  font-weight: 600;
}

.tabs .tab.selected::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: var(--ion-color-primary);
  bottom: -1px;
  left: 0;
}

.content {
  font-size: 14px;
  color: var(--ion-color-step-550);
}
</style>
