<template>
  <graduados-app header-title="Inscripción" :header-show-back-button="true" body="white">
    <SuccessState :title="title" :message="message">
      <template #details v-if="failed.length">
        <div class="failed-block">
          <h3 class="failed-title">
            <ion-icon :icon="alertCircleOutline" aria-hidden="true"></ion-icon>
            No pudimos inscribirte a
            {{ failed.length === 1 ? "una actividad" : `${failed.length} actividades` }}
          </h3>

          <ul class="failed-list">
            <li v-for="item in failed" :key="`${item.type}-${item.id}`">
              <strong>{{ item.title || "Actividad" }}</strong>
              <span>{{ item.reason }}</span>
            </li>
          </ul>

          <p class="failed-help">
            Si necesitás una de estas actividades, escribinos a
            <a href="mailto:graduados@derecho.uba.ar">graduados@derecho.uba.ar</a>.
          </p>
        </div>
      </template>
    </SuccessState>

    <template #footer>
      <ion-button shape="round" expand="full" color="primary" @click="goToActivities">
        Listo
      </ion-button>
    </template>
  </graduados-app>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, useIonRouter } from "@ionic/vue";
import { alertCircleOutline } from "ionicons/icons";
import { computed, onMounted } from "vue";
import SuccessState from "@/components/SuccessState.vue";
import { useEnrollmentCart } from "@/uses/enrollmentCart";

// El resultado vive en memoria (uses/enrollmentCart) y es de un solo uso: si se
// entra por deep-link o se recarga, no hay nada que mostrar y volvemos al listado.
const { lastResult } = useEnrollmentCart();
const router = useIonRouter();

const enrolled = computed(() => lastResult.value?.enrolled ?? []);
const failed = computed(() => lastResult.value?.failed ?? []);

const title = computed(() =>
  enrolled.value.length ? "¡Inscripción exitosa!" : "No pudimos completar la inscripción"
);

const message = computed(() => {
  const total = enrolled.value.length;

  if (!total) {
    return "Ninguna de las actividades seleccionadas admitía inscripción.";
  }

  const base =
    total === 1
      ? "Quedaste inscripto a 1 actividad."
      : `Quedaste inscripto a ${total} actividades.`;

  return `${base} Te enviamos un mail con el detalle y te vamos a avisar antes de que empiecen.`;
});

function goToActivities() {
  router.navigate("/talleres", "forward", "replace");
}

onMounted(() => {
  if (!lastResult.value) goToActivities();
});
</script>

<style scoped>
.failed-block {
  padding: var(--app-spacing-lg);
  background: var(--app-surface-alt);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  text-align: left;
}

.failed-title {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-xs);
  margin: 0 0 var(--app-spacing-md);
  font-size: 14px;
  font-weight: 700;
  color: var(--app-text-title);
}

.failed-title ion-icon {
  flex-shrink: 0;
  font-size: 18px;
  color: var(--ion-color-warning-shade);
}

.failed-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-sm);
}

.failed-list li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  line-height: 1.45;
  color: var(--app-text-secondary);
}

.failed-list strong {
  color: var(--app-text-body);
}

.failed-help {
  margin: var(--app-spacing-md) 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--app-text-secondary);
}
</style>
