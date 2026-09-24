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

    <!--
      Paso intermedio antes del cliente de correo: tocar "Contactar" y ver que
      se abre Gmail de la nada no explica que la postulación se hace mandando
      el CV por mail. Es un toque más, pero deja claro qué mandar, a quién y
      hasta cuándo. La postulación se registra igual al tocar "Contactar", como
      antes: este modal no cambia el tracking.
    -->
    <ion-modal :is-open="showEmailModal" @didDismiss="showEmailModal = false">
      <!--
        El ion-page NO es decorativo: sin él, ion-content se come todo el alto
        del modal y el ion-footer (con "Abrir correo") queda fuera de la vista.
      -->
      <ion-page>
        <ion-header>
          <ion-toolbar>
            <ion-title>Cómo postularte</ion-title>
            <ion-buttons slot="end">
              <ion-button aria-label="Cerrar" @click="showEmailModal = false">
                <ion-icon slot="icon-only" :icon="closeOutline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <p class="apply-intro">
            Para completar tu postulación, enviá tu CV por correo electrónico a la
            dirección de la búsqueda. El envío lo hacés desde tu propia aplicación
            de correo.
          </p>

          <p v-if="job.selection_process" class="apply-note">
            {{ job.selection_process }}
          </p>

          <!-- Copiable: en el celular, pasar el mail a otra app a mano es la
               parte más molesta de postularse. -->
          <p class="apply-label">Enviá tu CV a:</p>
          <button
            v-if="contactEmail"
            type="button"
            class="apply-email"
            @click="copyEmail"
          >
            <ion-icon :icon="mailOutline" aria-hidden="true"></ion-icon>
            <span class="apply-email__value">{{ contactEmail }}</span>
            <ion-icon
              class="apply-email__copy"
              :icon="copyOutline"
              aria-hidden="true"
            ></ion-icon>
          </button>

          <!-- Hay búsquedas cargadas sin dirección: mejor decirlo que abrir el
               cliente de correo vacío. -->
          <p v-else class="apply-note">
            Esta búsqueda no tiene una dirección de correo publicada.
            Escribinos a graduados@derecho.uba.ar y te orientamos.
          </p>

          <template v-if="job.valid_until">
            <p class="apply-label">Por favor hasta el:</p>
            <p class="apply-value">{{ job.valid_until }}</p>
          </template>

          <p class="apply-label">Con el siguiente asunto:</p>
          <button type="button" class="apply-copyable" @click="copySubject">
            <span class="apply-subject">{{ job.title }}</span>
            <ion-icon
              class="apply-copyable__icon"
              :icon="copyOutline"
              aria-hidden="true"
            ></ion-icon>
          </button>

          <p class="apply-sworn">
            <strong>Declaración jurada:</strong> la postulación implica una
            declaración jurada sobre la corrección y veracidad de los datos
            proporcionados, así como sobre el cumplimiento de los requisitos.
          </p>
        </ion-content>

        <ion-footer class="ion-padding ion-no-border">
          <div class="apply-actions">
            <ion-button
              fill="outline"
              shape="round"
              @click="showEmailModal = false"
            >
              Cerrar
            </ion-button>
            <ion-button
              v-if="contactEmail"
              shape="round"
              @click="openContactEmail"
            >
              <ion-icon slot="start" :icon="mailOutline"></ion-icon>
              Abrir correo
            </ion-button>
          </div>
        </ion-footer>
      </ion-page>
    </ion-modal>

    <template #footer v-if="!loading && !job.from_auth">
      <!-- Contactar: abre teléfono o, cuando es por mail, registra la
           postulación y muestra el modal de arriba (ver applyAndOpenEmail). -->
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
  IonButtons,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonPage,
  alertController,
  toastController,
} from "@ionic/vue";
import { closeOutline, copyOutline, mailOutline } from "ionicons/icons";
import { computed, ref, onMounted } from "vue";
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
const showEmailModal = ref(false);

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
  showEmailModal.value = true;
}

// Registra la postulación en el sistema de graduados de forma silenciosa:
// si falla no se bloquea ni se informa (el contacto por mail sigue igual).
// Recibe el id pelado, que es lo que espera la acción `jobs/apply`.
function registerApplication() {
  // El catch devuelve un valor en vez de tener cuerpo vacío: un `() => {}` es
  // error de ESLint (no-empty-function) y rompía `npm run lint`.
  store.dispatch("jobs/apply", job.value.id).catch(() => undefined);
}

/*
 * Dirección a la que se manda el CV, saneada. El campo del legacy se carga a
 * mano, así que llega con espacios alrededor, a veces con varias direcciones y
 * a veces envuelto en texto ("Enviar su CV a: x@y.com"). Cualquiera de esos
 * casos arma un `mailto:` inválido y el cliente de correo lo abre SIN
 * destinatario, que es como se veía el bug.
 */
const contactEmail = computed<string>(() => {
  const raw = String(job.value?.email ?? "");
  const found = raw.match(/[^\s<>()[\],;:"]+@[^\s<>()[\],;:"]+\.[a-z]{2,}/i);

  return (found ? found[0] : raw).trim();
});

/*
 * `window.location.href` y no `window.open(..., '_system')`: es lo que ya usa
 * SocialShare para mandar un mail y el camino que el WebView de Capacitor
 * entrega al SO con la URL entera. El asunto va precargado con el título de la
 * búsqueda, que es el que el modal pide usar.
 */
function openContactEmail() {
  const subject = encodeURIComponent(job.value.title ?? "");

  showEmailModal.value = false;
  window.location.href = `mailto:${contactEmail.value}?subject=${subject}`;
}

function copyEmail() {
  return copyToClipboard(contactEmail.value, "Correo copiado al portapapeles");
}

function copySubject() {
  return copyToClipboard(job.value.title, "Asunto copiado al portapapeles");
}

async function copyToClipboard(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text ?? "");

    const toast = await toastController.create({
      message,
      duration: 2000,
      position: "bottom",
      color: "success",
      icon: copyOutline,
    });
    await toast.present();
  } catch {
    // Sin permiso de portapapeles (o contexto no seguro) el dato queda a la
    // vista para copiarlo a mano: no tiene sentido cortar la postulación.
    store.dispatch("ui/toastr/create", "No pudimos copiar el texto");
  }
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
      showEmailModal.value = true;
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
/* ── Modal "Cómo postularte" ─────────────────────── */
.apply-intro {
  margin: 0 0 var(--app-spacing-md, 12px);
  font-size: 14px;
  line-height: 1.5;
  color: var(--app-text-body, #4a4a55);
}

.apply-note {
  margin: 0 0 var(--app-spacing-md, 12px);
  padding: var(--app-spacing-sm, 8px) var(--app-spacing-md, 12px);
  background: var(--app-surface-alt);
  border-left: 3px solid var(--ion-color-primary);
  border-radius: var(--app-radius-sm, 8px);
  font-size: 13px;
  line-height: 1.45;
  color: var(--app-text-secondary);
}

.apply-label {
  margin: var(--app-spacing-md, 12px) 0 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: var(--app-text-secondary);
}

.apply-value,
.apply-subject {
  margin: 0;
  font-size: 14px;
  color: var(--app-text-title);
}

/* El asunto va en monoespaciada para que se lea como algo a copiar tal cual. */
.apply-subject {
  flex: 1;
  min-width: 0;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 13px;
  color: var(--app-text-title);
  text-align: left;
  word-break: break-word;
}

/* Mismo gesto que el mail: tocar el asunto lo copia. */
.apply-copyable {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-sm, 8px);
  width: 100%;
  padding: 8px 10px;
  background: var(--app-surface-alt);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-sm, 8px);
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.apply-copyable__icon {
  flex-shrink: 0;
  font-size: 16px;
  color: var(--app-text-secondary);
}

.apply-email {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-sm, 8px);
  width: 100%;
  padding: var(--app-spacing-md, 12px);
  background: var(--app-surface-alt);
  border: 1px dashed var(--app-border-strong, rgba(23, 22, 28, 0.14));
  border-radius: var(--app-radius-md, 12px);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.apply-email ion-icon {
  flex-shrink: 0;
  font-size: 18px;
  color: var(--ion-color-primary);
}

.apply-email__value {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-primary);
  /* Los mails largos no tienen espacios donde cortar. */
  overflow-wrap: anywhere;
}

.apply-email__copy {
  color: var(--app-text-secondary) !important;
}

.apply-sworn {
  margin: var(--app-spacing-lg, 16px) 0 0;
  padding-top: var(--app-spacing-md, 12px);
  border-top: 1px solid var(--app-border);
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--app-text-secondary);
}

.apply-actions {
  display: flex;
  gap: var(--app-spacing-sm, 8px);
}

.apply-actions ion-button {
  flex: 1;
}
</style>