<template>
  <!--
    Layout con divs propios y NO con ion-header/ion-content/ion-footer.
    Un ion-modal con `--height: auto` colapsa el ion-content a 0px de alto (el
    ion-content necesita un contenedor con altura definida para calcular su
    scroll), así que el modal se veía vacío: solo el título y el botón. Con un
    contenedor normal el modal mide lo que mide su contenido, y el scroll lo
    maneja `.sheet-body` cuando hace falta.
  -->
  <ion-modal :is-open="open" class="apply-modal" @didDismiss="close">
    <div class="sheet">
      <header class="sheet-head">
        <h2>{{ submitted ? "Postulación enviada" : "Confirmar postulación" }}</h2>
        <button type="button" class="sheet-close" aria-label="Cerrar" @click="close">
          <ion-icon :icon="closeOutline" aria-hidden="true"></ion-icon>
        </button>
      </header>

      <div class="sheet-body">
        <!-- Éxito -->
        <SuccessState
          v-if="submitted"
          variant="check"
          title="¡Listo, ya estás postulado/a!"
          :message="successMessage"
        >
          <template #details>
            <button v-if="job?.email" type="button" class="cv-card" @click="sendCv">
              <span class="cv-icon">
                <ion-icon :icon="mailOutline" aria-hidden="true"></ion-icon>
              </span>
              <span class="cv-text">
                <span class="cv-label">Enviá tu CV a</span>
                <span class="cv-value">{{ job.email }}</span>
                <span v-if="job.title" class="cv-subject">Asunto: {{ job.title }}</span>
              </span>
              <ion-icon class="cv-chevron" :icon="chevronForwardOutline" aria-hidden="true"></ion-icon>
            </button>
          </template>
        </SuccessState>

        <template v-else>
          <div class="job-summary">
            <span class="job-summary-label">Te vas a postular a</span>
            <span class="job-summary-title">{{ job?.title }}</span>
            <span v-if="job?.company" class="job-summary-company">{{ job.company }}</span>
          </div>

          <span class="data-caption">Tus datos</span>

          <div v-if="loadingProfile" class="data-card">
            <div class="data-skeleton">
              <ion-skeleton-text :animated="true" style="width: 60%; height: 14px" />
              <ion-skeleton-text :animated="true" style="width: 75%; height: 14px" />
              <ion-skeleton-text :animated="true" style="width: 45%; height: 14px" />
            </div>
          </div>

          <template v-else>
            <!-- Lo que ya tenemos: solo lectura, no se vuelve a tipear -->
            <div v-if="knownRows.length" class="data-card">
              <div v-for="row in knownRows" :key="row.label" class="data-row">
                <span class="data-label">{{ row.label }}</span>
                <span class="data-value">{{ row.value }}</span>
              </div>
            </div>

            <!--
              Y SOLO lo que falta se pide. Antes se bloqueaba el botón cuando la
              cuenta no tenía email o DNI, y como la API no siempre los devuelve
              quedaba un callejón sin salida: no había forma de postularse.
            -->
            <div v-if="missingFields.length" class="missing-fields">
              <p class="missing-intro">
                <ion-icon :icon="alertCircleOutline" aria-hidden="true"></ion-icon>
                <span>Esto no lo tenemos en tu cuenta. Completalo para postularte:</span>
              </p>

              <div v-for="field in missingFields" :key="field.key" class="field">
                <label :for="`apply-${field.key}`">{{ field.label }}</label>
                <input
                  :id="`apply-${field.key}`"
                  v-model="extra[field.key]"
                  class="text-input"
                  :type="field.type"
                  :inputmode="field.inputmode"
                  :autocapitalize="field.key === 'email' ? 'off' : 'words'"
                  :placeholder="field.placeholder"
                />
                <span v-if="field.hint" class="field-hint">{{ field.hint }}</span>
              </div>
            </div>

            <p v-else class="data-hint">
              Se toman de tu cuenta. Si algo no está bien, actualizalo en
              <span class="data-link" @click="goToProfile">Mi cuenta</span>.
            </p>
          </template>

          <p class="legal-note">
            La postulación implica una declaración jurada sobre la corrección y
            veracidad de los datos proporcionados, como así también sobre el
            cumplimiento de los requisitos.
          </p>

          <p v-if="errorMessage" class="submit-error">
            <ion-icon :icon="alertCircleOutline" aria-hidden="true"></ion-icon>
            {{ errorMessage }}
          </p>
        </template>
      </div>

      <footer class="sheet-foot">
        <ion-button v-if="submitted" expand="block" shape="round" @click="close">
          Listo
        </ion-button>
        <ion-button
          v-else
          expand="block"
          shape="round"
          :disabled="sending || !canSubmit"
          @click="submit"
        >
          <ion-spinner v-if="sending" name="crescent" class="btn-spinner"></ion-spinner>
          {{ sending ? "Enviando…" : "Confirmar postulación" }}
        </ion-button>
      </footer>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonButton,
  IonIcon,
  IonSpinner,
  IonSkeletonText,
  useIonRouter,
} from "@ionic/vue";
import {
  closeOutline,
  mailOutline,
  chevronForwardOutline,
  alertCircleOutline,
} from "ionicons/icons";
import { ref, reactive, watch, computed } from "vue";
import { useStore } from "vuex";
import SuccessState from "@/components/SuccessState.vue";
import { useCurrentUser } from "@/uses/currentUser";
import { useProfile } from "@/uses/profile";
import { openExternal } from "@/uses/externalLinks";

const props = defineProps<{
  open: boolean;
  job: any;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "applied"): void;
}>();

const store = useStore();
const router = useIonRouter();
const { user } = useCurrentUser();

const sending = ref(false);
const submitted = ref(false);
const loadingProfile = ref(false);
const errorMessage = ref("");

/** Lo que la persona completa a mano porque su cuenta no lo tiene. */
const extra = reactive<Record<string, string>>({
  nombre: "",
  apellido: "",
  email: "",
  dni: "",
});

const successMessage = computed(() =>
  props.job?.email
    ? "Registramos tu postulación. Para completarla, enviá tu CV al correo de la búsqueda."
    : "Registramos tu postulación. La institución se va a contactar con vos."
);

/** Datos de la cuenta (los que el backend ya conoce). */
const account = computed(() => {
  const u: any = user.value ?? {};

  return {
    nombre: (u.firstname ?? "").trim(),
    apellido: (u.lastname ?? "").trim(),
    email: (u.email ?? "").trim(),
    dni: String(u.dni ?? "").trim(),
  };
});

/**
 * Payload final: lo de la cuenta manda, y lo tipeado solo rellena huecos.
 * El PHP legacy no sabe quién inició sesión (no hay token en juego), así que
 * estos cuatro campos SÍ viajan en el POST — la diferencia con la web es que no
 * se los pedimos si ya los tenemos.
 */
const applicant = computed(() => ({
  nombre: account.value.nombre || extra.nombre.trim(),
  apellido: account.value.apellido || extra.apellido.trim(),
  email: account.value.email || extra.email.trim(),
  dni: account.value.dni || extra.dni.trim(),
}));

const knownRows = computed(() =>
  [
    {
      label: "Nombre",
      value: [account.value.nombre, account.value.apellido].filter(Boolean).join(" "),
    },
    { label: "Email", value: account.value.email },
    { label: "DNI", value: account.value.dni },
  ].filter((row) => Boolean(row.value))
);

const FIELD_DEFS = [
  { key: "nombre", label: "Nombre", type: "text", inputmode: "text", placeholder: "Tu nombre", hint: "" },
  { key: "apellido", label: "Apellido", type: "text", inputmode: "text", placeholder: "Tu apellido", hint: "" },
  { key: "email", label: "Email", type: "email", inputmode: "email", placeholder: "tucorreo@ejemplo.com", hint: "" },
  {
    key: "dni",
    label: "DNI",
    type: "text",
    inputmode: "numeric",
    placeholder: "11111111",
    hint: "Solo números, sin puntos ni espacios.",
  },
] as const;

/** Campos que el PHP exige y que la cuenta no trae. */
const missingFields = computed(() =>
  FIELD_DEFS.filter((f) => !account.value[f.key as keyof typeof account.value])
);

const canSubmit = computed(() => {
  if (loadingProfile.value) return false;

  const a = applicant.value;

  if (!a.nombre || !a.apellido) return false;
  // Validación mínima acorde a lo que valida el formulario de la web.
  if (!/^\S+@\S+\.\S+$/.test(a.email)) return false;
  if (!/^\d{7,8}$/.test(a.dni)) return false;

  return true;
});

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;

    submitted.value = false;
    errorMessage.value = "";
    sending.value = false;
    extra.nombre = "";
    extra.apellido = "";
    extra.email = "";
    extra.dni = "";

    /*
     * El usuario guardado en localStorage puede no traer email/dni (es el motivo
     * por el que Mi cuenta los muestra vacíos). Si faltan, los pedimos frescos a
     * GET /profile, que además deja el localStorage actualizado para el resto de
     * la app. Si el backend tampoco los devuelve, se piden por pantalla.
     */
    const a = account.value;
    if (!a.email || !a.dni) {
      loadingProfile.value = true;
      useProfile()
        .me()
        .catch(() => {
          /* si falla, se piden por pantalla */
        })
        .finally(() => {
          loadingProfile.value = false;
        });
    }
  }
);

function close() {
  emit("close");
}

function goToProfile() {
  close();
  router.push("/perfil");
}

function sendCv() {
  const subject = encodeURIComponent(props.job?.title ?? "Postulación");
  openExternal(`mailto:${props.job.email}?subject=${subject}`);
}

function submit() {
  if (sending.value || !canSubmit.value) return;

  sending.value = true;
  errorMessage.value = "";

  store
    .dispatch("jobs/apply", { id: props.job?.id, ...applicant.value })
    .then(() => {
      submitted.value = true;
      emit("applied");
    })
    .catch((error: any) => {
      /*
       * El PHP responde 200 con el motivo en el cuerpo, así que cuando viene un
       * `legacyMessage` lo mostramos tal cual: es el mismo texto que ve alguien
       * postulándose desde la web (búsqueda vencida, ya postulado, etc.) y es
       * más útil que un mensaje genérico nuestro.
       */
      if (error?.legacyMessage) {
        errorMessage.value = error.legacyMessage;
        return;
      }

      errorMessage.value =
        "No pudimos enviar la postulación. Revisá tu conexión y probá de nuevo.";
    })
    .finally(() => {
      sending.value = false;
    });
}
</script>

<style scoped>
.apply-modal {
  --border-radius: var(--app-radius-lg);
  --width: min(94vw, 420px);
  --height: auto;
  --background: var(--app-surface);
}

.sheet {
  display: flex;
  flex-direction: column;
  /* Techo del modal: si el contenido crece, scrollea el body y el pie queda fijo */
  max-height: 88vh;
  background: var(--app-surface);
}

/* ── Encabezado ─────────────────────────────────────────────────────────── */
.sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-md);
  padding: var(--app-spacing-lg);
  border-bottom: 1px solid var(--app-border);
  flex-shrink: 0;
}

.sheet-head h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: var(--app-text-title);
}

.sheet-close {
  appearance: none;
  background: transparent;
  border: none;
  width: var(--app-tap-target);
  height: var(--app-tap-target);
  margin: calc(var(--app-tap-target) / -4) calc(var(--app-tap-target) / -4) 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.sheet-close ion-icon {
  font-size: 22px;
  color: var(--app-text-body);
}

.sheet-close:active {
  background: var(--app-surface-alt);
}

/* ── Cuerpo ─────────────────────────────────────────────────────────────── */
.sheet-body {
  padding: var(--app-spacing-lg);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  min-height: 0;
}

/* ── Pie ────────────────────────────────────────────────────────────────── */
.sheet-foot {
  padding: var(--app-spacing-md) var(--app-spacing-lg)
    calc(var(--app-spacing-md) + var(--ion-safe-area-bottom, 0px));
  border-top: 1px solid var(--app-border);
  flex-shrink: 0;
}

/* ── Resumen de la búsqueda ─────────────────────────────────────────────── */
.job-summary {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--app-spacing-md);
  margin-bottom: var(--app-spacing-lg);
  border-radius: var(--app-radius-sm);
  background: var(--app-primary-soft);
}

.job-summary-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--ion-color-primary);
}

.job-summary-title {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--app-text-title);
}

.job-summary-company {
  font-size: 13px;
  color: var(--app-text-body);
}

/* ── Datos ──────────────────────────────────────────────────────────────── */
.data-caption {
  display: block;
  margin-bottom: var(--app-spacing-sm);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--app-text-secondary);
}

.data-card {
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-sm);
  background: var(--app-surface-alt);
  padding: var(--app-spacing-xs) var(--app-spacing-md);
}

.data-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--app-spacing-md);
  padding: var(--app-spacing-sm) 0;
}

.data-row:not(:last-child) {
  border-bottom: 1px solid var(--app-border);
}

.data-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-secondary);
  flex-shrink: 0;
}

.data-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-title);
  text-align: right;
  overflow-wrap: anywhere;
}

.data-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-sm);
  padding: var(--app-spacing-sm) 0;
}

.data-hint {
  margin: var(--app-spacing-sm) 0 0;
  font-size: 12px;
  line-height: 1.45;
  color: var(--app-text-secondary);
}

.data-link {
  color: var(--ion-color-primary);
  font-weight: 700;
  cursor: pointer;
}

/* ── Campos faltantes ───────────────────────────────────────────────────── */
.missing-fields {
  margin-top: var(--app-spacing-md);
}

.missing-intro {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0 0 var(--app-spacing-md);
  font-size: 13px;
  line-height: 1.45;
  color: var(--app-text-body);
}

.missing-intro ion-icon {
  font-size: 17px;
  color: var(--ion-color-warning);
  flex-shrink: 0;
  margin-top: 1px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: var(--app-spacing-md);
}

.field label {
  font-size: 12px;
  font-weight: 700;
  color: var(--app-text-body);
}

/* Input propio en vez de ion-item: dentro de un contenedor común (sin
   ion-content) los ion-item flotantes se comportan de forma impredecible. */
.text-input {
  width: 100%;
  font-family: inherit;
  /* 16px exactos, no menos: por debajo de 16px Safari en iOS hace zoom
     automático al enfocar el input y descuadra todo el modal. */
  font-size: 16px;
  color: var(--app-text-title);
  background: var(--app-surface);
  border: 1px solid var(--app-border-strong);
  border-radius: var(--app-radius-sm);
  padding: 0 var(--app-spacing-md);
  /* Por encima del mínimo táctil de 44px */
  height: 46px;
  outline: none;
  transition: border-color var(--app-duration) var(--app-ease);
}

.text-input:focus {
  border-color: var(--ion-color-primary);
}

.text-input::placeholder {
  color: var(--app-text-secondary);
  opacity: 1;
}

.field-hint {
  font-size: 11px;
  color: var(--app-text-secondary);
}

.legal-note {
  margin: var(--app-spacing-lg) 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--app-text-secondary);
}

.submit-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: var(--app-spacing-md) 0 0;
  padding: var(--app-spacing-md);
  border-radius: var(--app-radius-sm);
  background: rgba(254, 61, 61, 0.08);
  font-size: 13px;
  font-weight: 600;
  color: #C62828;
}

.submit-error ion-icon {
  font-size: 17px;
  flex-shrink: 0;
}

/* ── Tarjeta del CV ─────────────────────────────────────────────────────── */
.cv-card {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-md);
  width: 100%;
  text-align: left;
  appearance: none;
  font-family: inherit;
  background: var(--app-surface-alt);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  padding: var(--app-spacing-md);
  min-height: 72px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform var(--app-duration-fast) var(--app-ease);
}

.cv-card:active {
  transform: scale(0.99);
}

.cv-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--app-primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cv-icon ion-icon {
  font-size: 20px;
  color: var(--ion-color-primary);
}

.cv-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}

.cv-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--app-text-secondary);
}

.cv-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--ion-color-primary);
  overflow-wrap: anywhere;
}

.cv-subject {
  font-size: 12px;
  color: var(--app-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cv-chevron {
  font-size: 18px;
  color: var(--app-text-secondary);
  flex-shrink: 0;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}
</style>
