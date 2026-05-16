<template>
  <!-- Logo Hero -->
  <div class="logo-hero">
    <img :src="logoUrl" alt="UBA Derecho" class="logo-img" />
  </div>

  <!-- Shortcuts Grid -->
  <div class="shortcuts-grid">
    <div
      v-for="item in shortcuts"
      :key="item.label"
      class="shortcut-card"
      :class="{ 'span-2': item.full }"
      @click="item.action ? item.action() : router.push(item.route!)"
      :style="{ '--card-color': item.color }"
    >
      <div class="shortcut-icon-wrap">
        <ion-icon :icon="item.icon" />
      </div>
      <span class="shortcut-label">{{ item.label }}</span>
    </div>
  </div>
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

const router = useIonRouter();

const logoUrl = (process.env.BASE_URL ?? '/') + 'assets/logo/logo.png';

function openYouTubeChannel() {
  window.open(
    'https://www.youtube.com/playlist?list=PL9y1i2ILzxlDxl8KFJHJrG294F2ert4Qy',
    '_system'
  );
}

const shortcuts = [
  { label: 'Cursos',                   icon: ribbonOutline,             route: '/cursos',                   color: '#7A35AB' },
  { label: 'Talleres y Jornadas',      icon: schoolOutline,             route: '/talleres',                 color: '#2563EB' },
  { label: 'Actividades Online',       icon: logoYoutube,               action: openYouTubeChannel,         color: '#DC2626' },
  { label: 'Búsqueda Laboral',         icon: briefcaseOutline,          route: '/busqueda-laboral',         color: '#D97706' },
  { label: 'Biblioteca',               icon: libraryOutline,            route: '/material-bibliografico',   color: '#059669' },
  { label: 'Noticias',                 icon: newspaperOutline,          route: '/noticias',                 color: '#0891B2' },
  { label: 'Información de Interés',   icon: informationCircleOutline,  route: '/informacion-de-interes',   color: '#4338CA' },
  { label: 'Beneficios',               icon: giftOutline,               route: '/beneficios',               color: '#B45309' },
  { label: 'Contacto',                 icon: callOutline,               route: '/contacto',                 color: '#64748B', full: true },
];
</script>

<style scoped>
/* ── Logo Hero ──────────────────────────────────── */
.logo-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 24px 6px;
}
.logo-img {
  width: 200px;
  max-width: 60vw;
  height: auto;
  object-fit: contain;
}

/* ── Shortcuts Grid ─────────────────────────────── */
.shortcuts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 10px 16px 24px;
}

/* ── Individual Card ────────────────────────────── */
.shortcut-card {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  padding: 18px 10px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.14s ease, box-shadow 0.14s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.shortcut-card:active {
  transform: scale(0.94);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
.shortcut-card.span-2 {
  grid-column: span 2;
  flex-direction: row;
  padding: 18px 24px;
  justify-content: flex-start;
  gap: 16px;
}

/* ── Icon Wrap ──────────────────────────────────── */
.shortcut-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background-color: color-mix(in srgb, var(--card-color) 14%, transparent);
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
    background-color: rgba(0, 0, 0, 0.08);
  }
}

/* ── Label ──────────────────────────────────────── */
.shortcut-label {
  font-size: 12px;
  font-weight: 700;
  color: #1A1A2E;
  text-align: center;
  line-height: 1.35;
  letter-spacing: -0.1px;
}
.span-2 .shortcut-label {
  font-size: 14px;
  text-align: left;
}
</style>
