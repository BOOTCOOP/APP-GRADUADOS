<template>
  <graduados-app header-title="Contacto" :header-show-back-button="true">
    <div class="contacto-container">
      <!-- Enlaces de interés -->
      <section class="links">
        <h2 class="section-title">Enlaces de interés</h2>

        <!--
          Botones reales (no ion-card con @click): así el tap, el foco y el
          teclado funcionan sin agregar role/tabindex a mano, y se entiende que
          la fila COMPLETA es tappable, no solo el ícono.
        -->
        <button type="button" class="link-row" @click="goToWhatsapp">
          <span class="link-icon whatsapp">
            <ion-icon :icon="logoWhatsapp" aria-hidden="true"></ion-icon>
          </span>
          <span class="link-text">
            <span class="link-title">Atención y consultas</span>
            <span class="link-sub">Escribinos por WhatsApp</span>
          </span>
          <ion-icon class="link-chevron" :icon="chevronForwardOutline" aria-hidden="true"></ion-icon>
        </button>

        <button type="button" class="link-row" @click="goToYoutube">
          <span class="link-icon youtube">
            <ion-icon :icon="logoYoutube" aria-hidden="true"></ion-icon>
          </span>
          <span class="link-text">
            <span class="link-title">Canal de YouTube</span>
            <span class="link-sub">Videos de la Facultad</span>
          </span>
          <ion-icon class="link-chevron" :icon="chevronForwardOutline" aria-hidden="true"></ion-icon>
        </button>
      </section>

      <!-- Redes sociales -->
      <section class="socials">
        <h2 class="section-title">Seguinos en redes</h2>

        <div class="social-grid">
          <button
            type="button"
            class="social-tile"
            aria-label="Facebook del Centro de Graduados"
            @click="goToFacebook()"
          >
            <ion-icon :icon="logoFacebook" aria-hidden="true"></ion-icon>
            <span>Facebook</span>
          </button>

          <button
            type="button"
            class="social-tile"
            aria-label="X del Centro de Graduados"
            @click="goToTwitter()"
          >
            <font-awesome-icon icon="fa-brands fa-x-twitter" aria-hidden="true" />
            <span>X</span>
          </button>

          <button
            type="button"
            class="social-tile"
            aria-label="Instagram del Centro de Graduados"
            @click="goToInstagram()"
          >
            <ion-icon :icon="logoInstagram" aria-hidden="true"></ion-icon>
            <span>Instagram</span>
          </button>
        </div>
      </section>
    </div>
  </graduados-app>
</template>

<script setup lang="ts">
import {
  logoWhatsapp,
  logoYoutube,
  logoFacebook,
  logoInstagram,
  chevronForwardOutline
} from 'ionicons/icons';

import { IonIcon } from '@ionic/vue';

import {
  openExternal,
  openWhatsapp,
  openYoutubeChannel,
  FACEBOOK_URL,
  TWITTER_URL,
  INSTAGRAM_URL,
} from '@/uses/externalLinks';
import { tapFeedback } from '@/uses/haptics';

/*
 * Todos los destinos viven en src/uses/externalLinks.ts. El de WhatsApp pasó de
 * `web.whatsapp.com/send?phone=…` (que en el celular abre el cliente WEB y
 * muestra el cartel de "escaneá el QR") a `wa.me/…`, que el sistema operativo
 * reconoce como link de la app y abre el chat directo en WhatsApp.
 */
function goToWhatsapp() {
  tapFeedback();
  openWhatsapp();
}

// Al canal, NO a la playlist de "Actividades Online": son destinos distintos.
function goToYoutube() {
  tapFeedback();
  openYoutubeChannel();
}

// Funciones para redes sociales
function goToFacebook() {
  tapFeedback();
  openExternal(FACEBOOK_URL);
}

function goToTwitter() {
  tapFeedback();
  openExternal(TWITTER_URL);
}

function goToInstagram() {
  tapFeedback();
  openExternal(INSTAGRAM_URL);
}
</script>

<style scoped>
/* El padding horizontal ya lo pone el layout (.page-body): antes se sumaba y
   quedaban 32px de gutter en un celular angosto. */
.contacto-container {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-xl);
}

.section-title {
  margin: 0 0 var(--app-spacing-md);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--app-text-secondary);
}

/* ── Enlaces de interés ─────────────────────────── */
.links {
  display: flex;
  flex-direction: column;
}

.link-row {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-md);
  width: 100%;
  text-align: left;
  appearance: none;
  font-family: inherit;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  box-shadow: var(--app-shadow-sm);
  padding: var(--app-spacing-md) var(--app-spacing-lg);
  margin-bottom: var(--app-spacing-md);
  min-height: 72px;
  cursor: pointer;
  transition: box-shadow var(--app-duration) var(--app-ease),
              transform var(--app-duration-fast) var(--app-ease);
  -webkit-tap-highlight-color: transparent;
}

.link-row:hover {
  box-shadow: var(--app-shadow-md);
}

.link-row:active {
  transform: scale(0.99);
  box-shadow: var(--app-shadow-xs);
}

.link-row:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}

/*
 * Ícono con el color real de la marca sobre un tinte suave. Antes los logos
 * iban en `color="medium"` (gris) y la única pista de color era una barrita
 * vertical pegada al borde derecho de la card, que se leía como un glitch.
 */
.link-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.link-icon ion-icon {
  font-size: 24px;
}

.link-icon.whatsapp {
  background: rgba(37, 211, 102, 0.12);
}
.link-icon.whatsapp ion-icon {
  color: #128C4A; /* verde WhatsApp oscurecido para llegar a 4.5:1 sobre el tinte */
}

.link-icon.youtube {
  background: rgba(255, 0, 0, 0.10);
}
.link-icon.youtube ion-icon {
  color: #D90000;
}

.link-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.link-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--app-text-title);
  line-height: 1.3;
}

.link-sub {
  font-size: 13px;
  color: var(--app-text-secondary);
  line-height: 1.3;
}

.link-chevron {
  font-size: 18px;
  color: var(--app-text-secondary);
  flex-shrink: 0;
}

/* ── Redes sociales ─────────────────────────────── */
/* Grid propio en lugar de ion-grid/row/col: menos anidado y gaps consistentes
   con el resto de la app. */
.social-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--app-spacing-md);
}

.social-tile {
  appearance: none;
  font-family: inherit;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  box-shadow: var(--app-shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--app-spacing-sm);
  padding: var(--app-spacing-lg) var(--app-spacing-sm);
  min-height: 88px;
  cursor: pointer;
  transition: box-shadow var(--app-duration) var(--app-ease),
              transform var(--app-duration-fast) var(--app-ease);
  -webkit-tap-highlight-color: transparent;
}

.social-tile:hover {
  box-shadow: var(--app-shadow-md);
}

.social-tile:active {
  transform: scale(0.97);
  box-shadow: var(--app-shadow-xs);
}

.social-tile:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}

.social-tile ion-icon,
.social-tile :deep(svg) {
  font-size: 26px;
  width: 26px;
  height: 26px;
  color: var(--app-text-title);
}

.social-tile span {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-secondary);
}
</style>