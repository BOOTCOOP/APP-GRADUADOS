<template>
  <!--
    Navegación en la raíz de la card. Antes solo el título (un <ion-text>, ni
    enfocable ni alcanzable por teclado) y un botón "Ver más" de 32px llevaban al
    detalle: empresa, ubicación, modalidad y fecha eran zonas muertas.
  -->
  <ion-card
    class="job-card is-tappable"
    role="button"
    tabindex="0"
    :aria-label="`Ver detalle de la búsqueda ${job.title}`"
    @click="showDetail"
    @keydown.enter.prevent="showDetail"
    @keydown.space.prevent="showDetail"
  >
    <ion-card-content class="job-card-content">
      <!-- Título del puesto (destacado) -->
      <ion-text color="dark" class="job-title">
        <h3>{{ job.title }}</h3>
      </ion-text>

      <!-- Empresa/Institución -->
      <ion-text color="medium" class="job-company">
        <p>
          <strong>{{ job.company }}</strong>
        </p>
      </ion-text>

      <!-- Información principal: Ubicación y Modalidad -->
      <div class="job-info-row">
        <div class="job-info-item">
          <ion-icon
            :md="locationOutline"
            :ios="locationOutline"
            color="primary"
          ></ion-icon>
          <ion-text color="dark">
            <small>{{ job.location || "No especificado" }}</small>
          </ion-text>
        </div>

        <div class="job-info-item">
          <ion-icon
            :md="
              job.modality === 'Presencial'
                ? businessOutline
                : job.modality === 'Híbrido'
                ? desktopOutline
                : homeOutline
            "
            :ios="
              job.modality === 'Presencial'
                ? businessOutline
                : job.modality === 'Híbrido'
                ? desktopOutline
                : homeOutline
            "
            :color="
              job.modality === 'Presencial'
                ? 'success'
                : job.modality === 'Híbrido'
                ? 'warning'
                : 'secondary'
            "
          ></ion-icon>
          <ion-text
            :color="
              job.modality === 'Presencial'
                ? 'success'
                : job.modality === 'Híbrido'
                ? 'warning'
                : 'secondary'
            "
          >
            <small
              ><strong>{{ job.modality }}</strong></small
            >
          </ion-text>
        </div>
      </div>

      <!-- Fecha de publicación -->
      <div class="job-footer">
        <span class="job-date">
          <!-- Ícono SVG en vez del emoji 📅: el emoji se renderiza distinto en
               cada plataforma y desalinea la línea de texto. -->
          <ion-icon :icon="calendarOutline" aria-hidden="true"></ion-icon>
          Publicado: {{ job.created_at }}
        </span>

        <span class="job-action-hint">
          Ver más
          <ion-icon :icon="arrowForwardOutline" aria-hidden="true"></ion-icon>
        </span>
      </div>

      <!-- Slot para contenido adicional -->
      <slot name="info"></slot>
      <slot></slot>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  useIonRouter,
} from "@ionic/vue";

import {
  locationOutline,
  businessOutline,
  desktopOutline,
  homeOutline,
  arrowForwardOutline,
  calendarOutline,
} from "ionicons/icons";

const prop = defineProps<{
  job: any;
}>();

const router = useIonRouter();

function showDetail() {
  router.push({ name: "jobs.show", params: { slug: prop.job.id } });
}
</script>

<style scoped>
.job-card {
  position: relative;
  /* Radio, sombra y feedback de tap vienen del estilo global de
     `ion-card.is-tappable` (theme/global.css). */
  margin: 0 0 var(--app-spacing-md);
}

.job-card-content {
  padding: var(--app-spacing-lg);
}

.job-title {
  display: block;
  margin-bottom: var(--app-spacing-sm);
}

.job-title h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: var(--app-text-title);
  line-height: 1.35;
  letter-spacing: -0.2px;
}

.job-company {
  margin-bottom: 12px;
}

.job-company p {
  margin: 0;
  font-size: 14px;
}

.job-info-row {
  display: flex;
  gap: 16px;
  margin: 12px 0;
  flex-wrap: wrap;
}

.job-info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.job-info-item ion-icon {
  font-size: 18px;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--app-spacing-sm);
  margin-top: var(--app-spacing-lg);
  padding-top: var(--app-spacing-md);
  border-top: 1px solid var(--app-border);
}

.job-date {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--app-text-secondary);
  min-width: 0;
}

.job-date ion-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.job-action-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--ion-color-primary);
}

.job-action-hint ion-icon {
  font-size: 14px;
}
</style>
