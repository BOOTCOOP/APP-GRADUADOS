<template>
  <graduados-app header-title="Mi selección" :header-show-back-button="true">
    <div v-if="checking" class="cart-loading">
      <ion-skeleton-text
        v-for="i in [1, 2, 3]"
        :key="i"
        :animated="true"
        style="width: 100%; height: 96px; border-radius: var(--app-radius-md)"
      ></ion-skeleton-text>
    </div>

    <EmptyState
      v-else-if="!items.length"
      :icon="cartOutline"
      title="Todavía no seleccionaste nada"
      message="Agregá talleres y cursos desde sus listados y después inscribite a todos juntos desde acá."
    />

    <div v-else class="cart-list">
      <ion-text color="medium" class="cart-intro">
        <small>
          Vas a inscribirte a {{ enrollable.length }}
          {{ enrollable.length === 1 ? "actividad" : "actividades" }}.
          <template v-if="blocked.length">
            Hay {{ blocked.length }} que ya no
            {{ blocked.length === 1 ? "está disponible" : "están disponibles" }}.
          </template>
        </small>
      </ion-text>

      <article
        v-for="item in items"
        :key="`${item.type}-${item.id}`"
        class="cart-item"
        :class="{ 'cart-item--blocked': reasonFor(item) }"
      >
        <div class="cart-item__body">
          <span class="cart-item__kind">
            {{ item.type === "workshop" ? "Taller" : "Curso" }}
          </span>
          <h3 class="cart-item__title">{{ item.title }}</h3>

          <p class="cart-item__meta" v-if="item.teachers">
            <ion-icon :icon="personCircleOutline" aria-hidden="true"></ion-icon>
            <span>{{ item.teachers }}</span>
          </p>
          <p class="cart-item__meta" v-if="item.start">
            <ion-icon :icon="calendarOutline" aria-hidden="true"></ion-icon>
            <span>{{ formatDate(item.start) }}</span>
          </p>

          <p class="cart-item__reason" v-if="reasonFor(item)">
            <ion-icon :icon="alertCircleOutline" aria-hidden="true"></ion-icon>
            <span>{{ reasonFor(item) }}</span>
          </p>
        </div>

        <ion-button
          fill="clear"
          color="medium"
          class="cart-item__remove"
          :aria-label="`Quitar ${item.title} de mi selección`"
          @click="remove(item.type, item.id)"
        >
          <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
        </ion-button>
      </article>
    </div>

    <template #footer v-if="items.length && !checking">
      <div v-if="!isLoggedIn">
        <ion-button
          expand="full"
          shape="round"
          color="primary"
          @click="goToLogin('/mi-seleccion')"
        >
          <ion-icon :icon="schoolOutline" slot="start"></ion-icon>
          Iniciá sesión para inscribirte
        </ion-button>
        <ion-text color="medium" class="ion-text-center footer-note">
          <small>Tu selección se guarda: al volver del login sigue acá.</small>
        </ion-text>
      </div>

      <div v-else>
        <ion-button
          expand="full"
          shape="round"
          color="primary"
          :disabled="!enrollable.length || !canOperate || submitting"
          @click="confirm"
        >
          <ion-spinner v-if="submitting" name="crescent"></ion-spinner>
          <template v-else>
            <ion-icon :icon="schoolOutline" slot="start"></ion-icon>
            Inscribirme ({{ enrollable.length }})
          </template>
        </ion-button>
        <ion-text color="medium" class="ion-text-center footer-note" v-if="footerNote">
          <small>{{ footerNote }}</small>
        </ion-text>
      </div>
    </template>
  </graduados-app>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonSkeletonText,
  IonSpinner,
  IonText,
  useIonRouter,
} from "@ionic/vue";
import {
  alertCircleOutline,
  calendarOutline,
  cartOutline,
  personCircleOutline,
  schoolOutline,
  trashOutline,
} from "ionicons/icons";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import EmptyState from "@/components/EmptyState.vue";
import { parseApiDate } from "@/libs/dates";
import { useCurrentUser } from "@/uses/currentUser";
import { useEnrollmentCart, type CartItem } from "@/uses/enrollmentCart";
import { useRequireAuth } from "@/uses/requireAuth";
import { refreshUser } from "@/uses/session";

const store = useStore();
const router = useIonRouter();

const { canOperate, operabilityIssue } = useCurrentUser();
const { isLoggedIn, goToLogin } = useRequireAuth();
const { items, remove, clear, refresh, setLastResult } = useEnrollmentCart();

const checking = ref(true);
const submitting = ref(false);

// Motivo por el que un ítem ya no se puede inscribir, indexado por `type-id`.
// Se llena al entrar revalidando contra la API: entre que la persona armó la
// selección y llegó acá, un taller pudo llenarse o vencer.
const reasons = ref<Record<string, string>>({});

const key = (item: CartItem) => `${item.type}-${item.id}`;
const reasonFor = (item: CartItem) => reasons.value[key(item)] ?? null;

const blocked = computed(() => items.value.filter((item) => reasonFor(item)));
const enrollable = computed(() => items.value.filter((item) => !reasonFor(item)));

const footerNote = computed(() => {
  if (!canOperate.value && operabilityIssue.value) return operabilityIssue.value;
  if (!enrollable.value.length) {
    return "Ninguna de las actividades seleccionadas admite inscripción en este momento.";
  }
  return "";
});

function formatDate(value?: string): string {
  const date = parseApiDate(value);
  if (!date) return "Fecha por confirmar";

  return date.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function unavailableReason(data: any): string | null {
  if (data.is_enrolled) return "Ya estás inscripto.";
  if (data.is_ended) return "La actividad ya finalizó.";
  if (data.is_full) return "Se quedó sin cupos.";
  if (data.registration_closed) return "Las inscripciones están cerradas.";
  return null;
}

// Revalidación: pedimos cada ítem al detalle público y refrescamos el snapshot
// guardado (título, docentes, fecha) además del motivo de bloqueo.
async function revalidate() {
  const results = await Promise.all(
    items.value.map(async (item) => {
      const action = item.type === "workshop" ? "workshops/fetch" : "courses/fetch";

      try {
        const response = await store.dispatch(action, item.id);
        const data = response.data.data;

        refresh(item.type, item.id, {
          title: data.title ?? item.title,
          teachers: data.teachers ?? item.teachers,
          start: data.start ?? item.start,
          modality: data.modality ?? item.modality,
        });

        return [key(item), unavailableReason(data)] as const;
      } catch {
        return [key(item), "No pudimos verificar esta actividad."] as const;
      }
    })
  );

  reasons.value = Object.fromEntries(
    results.filter(([, reason]) => reason) as Array<[string, string]>
  );
}

function confirm() {
  return store.dispatch("ui/alert/confirm", {
    header: "Inscripción",
    subHeader: `¿Confirmás tu inscripción a ${enrollable.value.length} ${
      enrollable.value.length === 1 ? "actividad" : "actividades"
    }?`,
    handler: submit,
  });
}

async function submit() {
  if (submitting.value) return;
  submitting.value = true;

  // Los bloqueados no se mandan, pero sí se listan en el resultado: si no,
  // desaparecen sin explicación al vaciarse la selección.
  const notSent = blocked.value.map((item) => ({
    type: item.type,
    id: item.id,
    title: item.title,
    reason: reasonFor(item) as string,
  }));

  const payload = enrollable.value.map((item) => ({ type: item.type, id: item.id }));

  try {
    const response = await store.dispatch("enrollments/batch", payload);

    setLastResult({
      enrolled: response.data.enrolled ?? [],
      failed: [...(response.data.failed ?? []), ...notSent],
    });

    clear();
    router.navigate("/mi-seleccion/resultado", "forward", "replace");
  } catch {
    // 422 global (payload inválido o usuario no habilitado): el toast lo muestra
    // el interceptor. Revalidamos por si el estado de la oferta cambió.
    await revalidate();
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  // Gate al día: `can_operate` decide si el botón de confirmar se habilita.
  refreshUser();

  await revalidate();
  checking.value = false;
});
</script>

<style scoped>
.cart-loading {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-md);
}

.cart-intro {
  display: block;
  margin-bottom: var(--app-spacing-md);
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-md);
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: var(--app-spacing-sm);
  padding: var(--app-spacing-lg);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  box-shadow: var(--app-shadow-sm);
}

.cart-item--blocked {
  opacity: 0.7;
}

.cart-item__body {
  flex: 1;
  min-width: 0;
}

.cart-item__kind {
  display: inline-block;
  margin-bottom: var(--app-spacing-xs);
  padding: 3px 8px;
  border-radius: var(--app-radius-pill);
  background: var(--app-primary-soft);
  color: var(--ion-color-primary-shade);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.cart-item__title {
  margin: 0 0 var(--app-spacing-sm);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--app-text-title);
}

.cart-item__meta,
.cart-item__reason {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-xs);
  margin: 0 0 4px;
  font-size: 13px;
  color: var(--app-text-secondary);
}

.cart-item__meta ion-icon {
  flex-shrink: 0;
  font-size: 15px;
  color: var(--ion-color-primary);
}

.cart-item__reason {
  margin-top: var(--app-spacing-sm);
  color: var(--ion-color-danger-shade);
  font-weight: 600;
}

.cart-item__reason ion-icon {
  flex-shrink: 0;
  font-size: 15px;
}

.cart-item__remove {
  --padding-start: 8px;
  --padding-end: 8px;
  margin: 0;
  min-width: var(--app-tap-target);
  min-height: var(--app-tap-target);
}

.footer-note small {
  display: block;
  padding-top: var(--app-spacing-sm);
  line-height: 1.4;
}
</style>
