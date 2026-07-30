<template>
  <graduados-app header-title="Actividades Online" :header-show-back-button="true">
    <div class="youtube-card">
      <div class="youtube-icon-wrap">
        <ion-icon :icon="logoYoutube" aria-hidden="true"></ion-icon>
      </div>

      <h2>Canal Oficial de YouTube</h2>

      <p class="youtube-description">
        Todas nuestras <strong>actividades online</strong>: seminarios, conferencias
        y contenido del Centro de Graduados de la Facultad de Derecho de la UBA.
      </p>

      <ul class="youtube-features">
        <li v-for="feature in features" :key="feature.label">
          <ion-icon :icon="feature.icon" aria-hidden="true"></ion-icon>
          <span>{{ feature.label }}</span>
        </li>
      </ul>

      <ion-button
        expand="block"
        color="danger"
        size="large"
        class="youtube-button"
        @click="openYoutubePlaylist"
      >
        <ion-icon :icon="logoYoutube" slot="start" aria-hidden="true"></ion-icon>
        Ver el canal
      </ion-button>
    </div>
  </graduados-app>
</template>

<script lang="ts" setup>
/*
 * Pantalla de cortesía para deep-links viejos (una notificación con
 * `classifieds.index` todavía puede caer acá). El camino normal ya NO pasa por
 * esta vista: el acceso rápido del inicio y el ítem del menú abren la playlist
 * directamente (src/uses/externalLinks.ts).
 *
 * Se limpiaron ~180 líneas de CSS y cinco funciones de la versión "avisos" que
 * esta pantalla reemplazó, más un `dispatch('avisos/fetchAvisos')` en onMounted
 * cuyo resultado no se renderizaba en ningún lado (un request por visita, para
 * nada) y varios console.log en producción.
 */
import { IonIcon, IonButton } from '@ionic/vue'
import { logoYoutube, playCircleOutline, libraryOutline, schoolOutline } from 'ionicons/icons'
import { openYoutubePlaylist } from '@/uses/externalLinks'

const features = [
  { icon: playCircleOutline, label: 'Conferencias en vivo' },
  { icon: libraryOutline, label: 'Material académico' },
  { icon: schoolOutline, label: 'Seminarios especializados' },
]
</script>

<style scoped>
.youtube-card {
  max-width: 480px;
  margin: 0 auto;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-lg);
  box-shadow: var(--app-shadow-sm);
  padding: var(--app-spacing-xl);
  text-align: center;
}

.youtube-icon-wrap {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--app-spacing-lg);
  border-radius: var(--app-radius-md);
  background: rgba(255, 0, 0, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
}

.youtube-icon-wrap ion-icon {
  font-size: 34px;
  color: #D90000;
}

.youtube-card h2 {
  margin: 0 0 var(--app-spacing-md);
  font-size: 20px;
  font-weight: 700;
  color: var(--app-text-title);
  letter-spacing: -0.3px;
}

.youtube-description {
  margin: 0 0 var(--app-spacing-xl);
  font-size: 14px;
  line-height: 1.55;
  color: var(--app-text-body);
}

.youtube-features {
  list-style: none;
  margin: 0 0 var(--app-spacing-xl);
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-md);
  text-align: left;
}

.youtube-features li {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-md);
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-body);
}

.youtube-features ion-icon {
  font-size: 20px;
  color: var(--ion-color-primary);
  flex-shrink: 0;
}

.youtube-button {
  --border-radius: var(--app-radius-md);
  margin: 0;
}
</style>
