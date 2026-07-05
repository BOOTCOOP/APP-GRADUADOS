<template>
  <graduados-app header-title="Validación de tipo" :header-show-back-button="true" body="white">
    <div class="ion-margin-top ion-text-center">
      <type-validation-badge :status="typeValidationStatus" />
    </div>

    <ion-text class="ion-margin-top">
      <p><strong>Tu categoría:</strong> {{ typeLabel(user?.type_id) || '—' }}</p>
    </ion-text>

    <!-- Aprobado -->
    <div v-if="typeValidationStatus === 2" class="ion-margin-top">
      <ion-text color="medium"><p><small>Tu tipo de usuario está verificado. No hay nada más que hacer.</small></p></ion-text>
    </div>

    <!-- Pendiente -->
    <div v-else-if="typeValidationStatus === 1" class="ion-margin-top">
      <ion-text color="medium"><p><small>Tu validación está en revisión. Te avisaremos cuando haya novedades. Podés inscribirte mientras tanto.</small></p></ion-text>
    </div>

    <!-- Sin-registro o rechazado -->
    <div v-else class="ion-margin-top">
      <ion-text color="medium" v-if="typeValidationStatus === 3">
        <p><small>La validación de tu tipo fue rechazada. {{ isOtherUniversity(user?.type_id) ? 'Volvé a enviar el documento corregido.' : 'Contactá a administración.' }}</small></p>
      </ion-text>

      <!-- Otra universidad: subir documento -->
      <div v-if="isOtherUniversity(user?.type_id)">
        <ion-text color="medium">
          <p><small>Adjuntá el documento que acredita tu título de otra universidad.</small></p>
        </ion-text>

        <label v-if="!documento" class="box" for="typeDoc">
          <input type="file" id="typeDoc" name="documento" accept=".pdf,.jpg,.jpeg,.png,.webp" @change="onPicked" />
          <div class="container">
            <ion-icon color="primary" size="large" :md="cloudUploadOutline" :ios="cloudUploadOutline"></ion-icon>
            <ion-text>Adjuntar documento</ion-text>
            <ion-text color="medium"><small>PDF/JPG/PNG/WEBP · máx 5 MB</small></ion-text>
          </div>
        </label>
        <div v-else class="box">
          <div class="container">
            <ion-icon color="primary" size="large" :md="documentOutline" :ios="documentOutline"></ion-icon>
            <ion-text>{{ documento.name }}</ion-text>
            <ion-text color="primary" @click="documento = null"><small>Quitar</small></ion-text>
          </div>
        </div>
      </div>

      <!-- UBA / Título en trámite: lo valida el admin -->
      <div v-else-if="isGraduateType(user?.type_id)">
        <ion-text color="medium"><p><small>Administración validará tu tipo de usuario. No necesitás adjuntar documentación.</small></p></ion-text>
      </div>

      <!-- Otros -->
      <div v-else>
        <ion-text color="medium"><p><small>Tu categoría no requiere validación.</small></p></ion-text>
      </div>
    </div>

    <template #footer>
      <ion-button
        v-if="showSubmit"
        :disabled="!documento || sending"
        shape="round"
        expand="full"
        color="primary"
        @click="submit"
      >{{ sending ? 'Enviando...' : 'Enviar documento' }}</ion-button>
    </template>
  </graduados-app>
</template>

<script setup lang="ts">
import TypeValidationBadge from "@/components/TypeValidationBadge.vue";
import { useCurrentUser } from "@/uses/currentUser";
import { useProfile } from "@/uses/profile";
import { refreshUser } from "@/uses/session";
import { isGraduateType, isOtherUniversity, typeLabel } from "@/utils/userTypes";
import { IonButton, IonIcon, IonText, useIonRouter } from "@ionic/vue";
import { cloudUploadOutline, documentOutline } from "ionicons/icons";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

const MAX_DOC_BYTES = 5 * 1024 * 1024;
const store = useStore();
const ionRouter = useIonRouter();
const { user, typeValidationStatus } = useCurrentUser();

const documento = ref<File | null>(null);
const sending = ref(false);

// La pantalla es 100% reactiva a useCurrentUser: al refrescar, el badge y las
// acciones disponibles se recalculan solos.
onMounted(() => refreshUser());

// Solo "otra universidad" (4) puede subir documento, cuando está sin-registro (null) o rechazado (3).
const showSubmit = computed(
  () =>
    isOtherUniversity(user.value?.type_id) &&
    (typeValidationStatus.value === null || typeValidationStatus.value === 3)
);

function onPicked(event: any) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (file.size > MAX_DOC_BYTES) {
    store.dispatch("ui/toastr/danger", "El documento supera los 5 MB.");
    event.target.value = "";
    return;
  }
  documento.value = file;
}

function submit() {
  if (!documento.value) return;
  sending.value = true;
  const fd = new FormData();
  fd.append("documento", documento.value);
  useProfile()
    .typeValidation(fd)
    .then(() => {
      store.dispatch("ui/toastr/success", "Documento enviado. Tu validación quedó en revisión.");
      documento.value = null;
      ionRouter.navigate("/perfil", "back", "replace");
    })
    .catch(() => {
      sending.value = false;
    });
}
</script>

<style scoped>
.box {
  padding: 32px;
  border: dashed 1px #cacbcc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
}
.box input[type="file"] {
  display: none;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
</style>
