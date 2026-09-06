<template>
  <section class="next-steps" aria-label="Pasos para completar la inscripción">
    <h3 class="next-steps__title">
      <ion-icon :icon="alertCircleOutline" aria-hidden="true"></ion-icon>
      Tu inscripción todavía no está confirmada
    </h3>

    <p class="next-steps__lead">
      Queda como preinscripción hasta que el Centro de Graduadas y Graduados
      verifique {{ needsDiploma && isPaid ? 'tu documentación y el pago' : needsDiploma ? 'tu documentación' : 'el pago' }}.
      También te lo enviamos por mail.
    </p>

    <ol class="next-steps__list">
      <li v-if="needsDiploma">
        Enviá una foto o escaneo de tu <strong>título</strong> a
        <a :href="`mailto:${EMAIL_CONTACTO}`">{{ EMAIL_CONTACTO }}</a>,
        para acreditar tu condición de graduada/o de otra universidad.
      </li>
      <li v-if="isPaid">
        Hacé la transferencia por <strong>{{ priceLabel }}</strong> y enviá el
        <strong>comprobante</strong> a
        <a :href="`mailto:${EMAIL_COMPROBANTE}`">{{ EMAIL_COMPROBANTE }}</a>.
        Sin el comprobante el trámite no queda completo.
      </li>
    </ol>

    <div v-if="isPaid" class="next-steps__account">
      <h4 class="next-steps__subtitle">Datos para la transferencia</h4>
      <dl class="account-list">
        <div v-for="dato in DATOS_TRANSFERENCIA" :key="dato.label" class="account-row">
          <dt>{{ dato.label }}</dt>
          <dd>{{ dato.value }}</dd>
        </div>
      </dl>
      <p class="next-steps__hint">
        Indicá tu nombre y el del curso en el concepto de la transferencia.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { alertCircleOutline } from "ionicons/icons";
import { computed } from "vue";
import {
  DATOS_TRANSFERENCIA,
  EMAIL_COMPROBANTE,
  EMAIL_CONTACTO,
} from "@/utils/transferencia";

// Qué falta después de preinscribirse a un curso. Se muestra en el detalle del
// curso una vez inscripto y en el resultado de "mi selección"; el mismo texto
// viaja por mail (emails/programa-enrollment en la API).
const props = withDefaults(
  defineProps<{
    /** Graduada/o de otra universidad: tiene que acreditar el título. */
    needsDiploma?: boolean;
    /** Precio ya formateado del curso; null/vacío = gratuito. */
    priceLabel?: string | null;
  }>(),
  { needsDiploma: false, priceLabel: null }
);

const isPaid = computed(() => Boolean(props.priceLabel));
</script>

<style scoped>
.next-steps {
  padding: var(--app-spacing-lg);
  background: var(--app-surface-alt);
  border: 1px solid var(--app-border);
  border-left: 3px solid var(--ion-color-warning);
  border-radius: var(--app-radius-md);
  text-align: left;
}

.next-steps__title {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-xs);
  margin: 0 0 var(--app-spacing-sm);
  font-size: 15px;
  font-weight: 700;
  color: var(--app-text-title);
}

.next-steps__title ion-icon {
  flex-shrink: 0;
  font-size: 18px;
  color: var(--ion-color-warning-shade);
}

.next-steps__lead {
  margin: 0 0 var(--app-spacing-md);
  font-size: 14px;
  line-height: 1.5;
  color: var(--app-text-body);
}

.next-steps__list {
  margin: 0;
  padding-left: var(--app-spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-sm);
  font-size: 14px;
  line-height: 1.5;
  color: var(--app-text-body);
}

.next-steps__account {
  margin-top: var(--app-spacing-lg);
}

.next-steps__subtitle {
  margin: 0 0 var(--app-spacing-sm);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  color: var(--app-text-secondary);
}

.account-list {
  margin: 0;
}

.account-row {
  display: flex;
  gap: var(--app-spacing-sm);
  padding: 6px 0;
  border-bottom: 1px solid var(--app-border);
  font-size: 13px;
  line-height: 1.45;
}

.account-row:last-child {
  border-bottom: 0;
}

.account-row dt {
  flex-shrink: 0;
  width: 78px;
  font-weight: 700;
  color: var(--app-text-secondary);
}

.account-row dd {
  margin: 0;
  min-width: 0;
  word-break: break-word;
  color: var(--app-text-body);
}

.next-steps__hint {
  margin: var(--app-spacing-sm) 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--app-text-secondary);
}
</style>
