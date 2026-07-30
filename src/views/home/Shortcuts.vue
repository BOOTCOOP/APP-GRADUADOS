<template>
  <!-- Logo Hero -->
  <div class="logo-hero">
    <img :src="logoUrl" alt="UBA Derecho" class="logo-img" />
  </div>

  <!-- Shortcuts Grid -->
  <nav class="shortcuts-grid" aria-label="Accesos rápidos">
    <button
      v-for="(item, i) in shortcuts"
      :key="item.label"
      type="button"
      class="shortcut-card"
      :class="{ 'span-2': item.full }"
      :style="{ '--card-color': item.color, '--stagger': `${i * 28}ms` }"
      @click="go(item)"
    >
      <span class="shortcut-icon-wrap">
        <ion-icon :icon="item.icon" aria-hidden="true" />
      </span>
      <span class="shortcut-label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useIonRouter, IonIcon } from '@ionic/vue';
import {
  ribbonOutline,
  schoolOutline,
  logoYoutube,
  briefcaseOutline,
  libraryOutline,
  newspaperOutline,
  informationCircleOutline,
  giftOutline,
  callOutline,
} from 'ionicons/icons';
import { openYoutubePlaylist } from '@/uses/externalLinks';
import { tapFeedback } from '@/uses/haptics';

const router = useIonRouter();

const logoUrl = import.meta.env.BASE_URL + 'assets/logo/logo.png';

interface Shortcut {
  label: string;
  icon: string;
  color: string;
  route?: string;
  action?: () => void;
  full?: boolean;
}

const shortcuts: Shortcut[] = [
  { label: 'Cursos',                 icon: ribbonOutline,            route: '/cursos',                 color: '#7A35AB' },
  { label: 'Talleres y Jornadas',    icon: schoolOutline,            route: '/talleres',               color: '#2563EB' },
  { label: 'Actividades Online',     icon: logoYoutube,              action: openYoutubePlaylist,      color: '#DC2626' },
  { label: 'Búsqueda Laboral',       icon: briefcaseOutline,         route: '/busqueda-laboral',       color: '#D97706' },
  { label: 'Bibliografía',           icon: libraryOutline,           route: '/material-bibliografico', color: '#059669' },
  { label: 'Noticias',               icon: newspaperOutline,         route: '/noticias',               color: '#0891B2' },
  { label: 'Información de Interés', icon: informationCircleOutline,  route: '/informacion-de-interes', color: '#4338CA' },
  { label: 'Beneficios',             icon: giftOutline,              route: '/beneficios',             color: '#B45309' },
  { label: 'Contacto',               icon: callOutline,              route: '/contacto',               color: '#475569', full: true },
];

function go(item: Shortcut) {
  tapFeedback();

  if (item.action) return item.action();
  if (item.route) router.push(item.route);
}
</script>

<style scoped>
/* ── Logo Hero ──────────────────────────────────── */
.logo-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--app-spacing-lg) var(--app-spacing-xl) var(--app-spacing-sm);
}
.logo-img {
  /* Se adapta al ancho real del dispositivo en vez de fijar 200px: en pantallas
     angostas deja de comerse el alto que necesita la grilla. */
  width: clamp(150px, 48vw, 210px);
  height: auto;
  object-fit: contain;
}

/* ── Shortcuts Grid ─────────────────────────────── */
/*
 * `auto-fit` + minmax en vez de `1fr 1fr` fijo: en un celular angosto quedan 2
 * columnas como ahora, pero en pantallas grandes (celulares anchos, tablets,
 * web) aparecen 3 o 4 en lugar de estirar dos cards gigantes. Al no depender de
 * media queries se adapta a cualquier tamaño y densidad.
 */
.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
  gap: var(--app-spacing-md);
  padding: var(--app-spacing-sm) 0 var(--app-spacing-lg);
}

/* ── Individual Card ────────────────────────────── */
.shortcut-card {
  position: relative;
  /* Reset del <button>: usamos botón real para foco y teclado gratis. */
  appearance: none;
  border: 1px solid var(--app-border);
  font-family: inherit;
  width: 100%;
  margin: 0;

  background: var(--app-surface);
  border-radius: var(--app-radius-md);
  box-shadow: var(--app-shadow-sm);
  /* Padding fluido: en pantallas chicas se compacta solo. */
  padding: clamp(14px, 4vw, 20px) var(--app-spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--app-spacing-md);
  /* Alto mínimo consistente aunque el label ocupe 1 o 2 líneas: evita que la
     grilla quede escalonada cuando Android agranda la fuente del sistema. */
  min-height: 128px;
  cursor: pointer;
  transition: box-shadow var(--app-duration) var(--app-ease),
              transform var(--app-duration-fast) var(--app-ease);
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  /* Entrada escalonada: la grilla se arma de arriba a abajo al abrir el inicio. */
  animation: shortcut-in var(--app-duration-slow) var(--app-ease) both;
  animation-delay: var(--stagger, 0ms);
}
.shortcut-card:hover {
  box-shadow: var(--app-shadow-md);
}
.shortcut-card:active {
  transform: scale(0.97);
  box-shadow: var(--app-shadow-xs);
}
.shortcut-card:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}
.shortcut-card.span-2 {
  grid-column: 1 / -1;
  flex-direction: row;
  padding: var(--app-spacing-lg) var(--app-spacing-xl);
  justify-content: center;
  gap: var(--app-spacing-lg);
  min-height: 0;
}

@keyframes shortcut-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Icon Wrap ──────────────────────────────────── */
.shortcut-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: var(--app-radius-sm);
  background-color: color-mix(in srgb, var(--card-color) 12%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.shortcut-icon-wrap ion-icon {
  font-size: 26px;
  color: var(--card-color);
}

/* Fallback for browsers without color-mix */
@supports not (background: color-mix(in srgb, red 10%, transparent)) {
  .shortcut-icon-wrap {
    background-color: rgba(0, 0, 0, 0.06);
  }
}

/* ── Label ──────────────────────────────────────── */
.shortcut-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--app-text-title);
  text-align: center;
  line-height: 1.3;
  letter-spacing: -0.1px;
  /* Con la fuente del sistema al 130% un label largo se iba a 3 líneas y
     descuadraba la fila: lo limitamos a 2 con elipsis. */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.span-2 .shortcut-label {
  font-size: 15px;
  text-align: left;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}

@media (prefers-reduced-motion: reduce) {
  .shortcut-card {
    animation: none;
  }
}
</style>
