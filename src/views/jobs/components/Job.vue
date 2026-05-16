<template>
  <ion-card class="job-card">
    <ion-card-content class="job-card-content">
      <!-- Título del puesto (destacado) -->
      <ion-text color="dark" class="job-title" @click="showDetail">
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
        <ion-text color="medium" class="job-date">
          <small>📅 Publicado: {{ job.created_at }}</small>
        </ion-text>

        <!-- Botón de acción -->
        <ion-button
          size="small"
          fill="outline"
          color="primary"
          @click="showDetail"
          class="job-action-btn"
        >
          Ver más
          <ion-icon
            :md="arrowForwardOutline"
            :ios="arrowForwardOutline"
            slot="end"
          ></ion-icon>
        </ion-button>
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
  IonButton,
  useIonRouter,
} from "@ionic/vue";

import { defineProps } from "vue";
import {
  locationOutline,
  businessOutline,
  desktopOutline,
  homeOutline,
  arrowForwardOutline,
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
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.job-card-content {
  padding: 16px;
}

.job-title {
  cursor: pointer;
  margin-bottom: 8px;
}

.job-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark);
  line-height: 1.3;
}

.job-title:hover h3 {
  color: var(--ion-color-primary);
  text-decoration: underline;
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
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

.job-date {
  flex: 1;
}

.job-action-btn {
  --border-radius: 20px;
  height: 32px;
}

@media (max-width: 768px) {
  .job-footer {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .job-action-btn {
    width: 100%;
  }
}
</style>
