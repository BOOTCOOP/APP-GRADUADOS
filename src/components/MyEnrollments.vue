<template>
  <section v-if="sortedItems.length" class="my-enrollments">
    <div class="section-head">
      <ion-text class="section-title">{{ title }}</ion-text>

      <!-- Sólo tiene sentido cuando hay algo más que el que ya se ve. -->
      <button
        v-if="sortedItems.length > 1"
        type="button"
        class="see-all"
        @click="openList"
      >
        Ver más ({{ sortedItems.length }})
        <ion-icon :icon="chevronForwardOutline" aria-hidden="true"></ion-icon>
      </button>
    </div>

    <!--
      Banner del próximo, no un carrusel de todos: es el dato que se mira de
      reojo al entrar. El resto vive en el modal de "Ver más".

      La card no lleva más alto fijo: antes eran 70px con 50px de padding, así
      que un título de dos líneas empujaba la fila de la fecha fuera de la card
      y se veía cortada por la mitad.
    -->
    <button type="button" class="banner" @click="goTo(next)">
      <span class="banner__title">{{ next.title }}</span>
      <span class="banner__meta">
        <ion-icon :icon="timeOutline" aria-hidden="true"></ion-icon>
        <span>{{ startLabel(next) }}</span>
      </span>
    </button>

    <ion-modal :is-open="isOpen" @didDismiss="isOpen = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ title }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="isOpen = false">Cerrar</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <!-- Ordenados por fecha de inicio: primero el que arranca antes. -->
        <button
          v-for="item in sortedItems"
          :key="item.id"
          type="button"
          class="list-row"
          @click="goTo(item)"
        >
          <span class="list-row__text">
            <span class="list-row__title">{{ item.title }}</span>
            <span class="list-row__meta">
              <ion-icon :icon="timeOutline" aria-hidden="true"></ion-icon>
              {{ startLabel(item) }}
            </span>
          </span>
          <ion-icon
            class="list-row__chevron"
            :icon="chevronForwardOutline"
            aria-hidden="true"
          ></ion-icon>
        </button>
      </ion-content>
    </ion-modal>
  </section>
</template>

<script setup lang="ts">
import {
  IonText,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  useIonRouter,
} from "@ionic/vue";
import { timeOutline, chevronForwardOutline } from "ionicons/icons";
import { computed, ref } from "vue";
import { sortByStartDate } from "@/utils/activities";

/*
 * Banner de "lo que tengo inscripto y todavía no pasó". Lo usan Cursos y
 * Talleres: eran dos componentes casi idénticos (MyCourses / MyActivities) y
 * cualquier arreglo había que hacerlo dos veces.
 */
const prop = defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true },
  // Ruta del detalle: 'courses.show' o 'activities.show'.
  routeName: { type: String, required: true },
});

const isOpen = ref(false);
const router = useIonRouter();

const sortedItems = computed(() => sortByStartDate(prop.items as any[]));
const next = computed<any>(() => sortedItems.value[0]);

/*
 * `beginning` es el texto relativo que manda la API ("en 1 semana"); `start`, la
 * fecha. Se muestran juntos porque "en 3 días" solo no dice qué día es, y la
 * fecha sola obliga a hacer la cuenta.
 */
function startLabel(item: any): string {
  const parts = [item?.start, item?.beginning].filter(Boolean);

  return parts.length ? parts.join(" · ") : "Próximamente";
}

function openList() {
  isOpen.value = true;
}

function goTo(item: any) {
  isOpen.value = false;
  router.push({ name: prop.routeName, params: { slug: item.id } });
}
</script>

<style scoped>
.my-enrollments {
  margin-bottom: var(--app-spacing-lg, 16px);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm, 8px);
  margin-bottom: var(--app-spacing-sm, 8px);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--app-text-title);
}

.see-all {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 0;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ion-color-primary);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.see-all ion-icon {
  font-size: 14px;
}

.banner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--app-spacing-sm, 8px);
  width: 100%;
  /* El padding manda el alto: con el título en dos líneas la card crece en
     vez de recortarlo. */
  padding: var(--app-spacing-lg, 16px);
  border: none;
  border-radius: var(--app-radius-md, 12px);
  background: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast, #fff);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  box-shadow: var(--app-shadow-sm);
  transition: transform var(--app-duration-fast, 120ms) var(--app-ease);
  -webkit-tap-highlight-color: transparent;
}

.banner:active {
  transform: scale(0.99);
}

.banner:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}

.banner__title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.35;
}

/* El ícono va en la misma línea base que el texto: suelto dentro de un <p>
   quedaba desalineado y encimado con la fecha. */
.banner__meta,
.list-row__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  opacity: 0.9;
}

.list-row {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-md, 12px);
  width: 100%;
  padding: var(--app-spacing-md, 12px);
  margin-bottom: var(--app-spacing-sm, 8px);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md, 12px);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.list-row__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.list-row__title {
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--app-text-title);
}

.list-row__meta {
  color: var(--app-text-secondary);
  opacity: 1;
}

.list-row__chevron {
  flex-shrink: 0;
  font-size: 18px;
  color: var(--app-text-secondary);
}
</style>
