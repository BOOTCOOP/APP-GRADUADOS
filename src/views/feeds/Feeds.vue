<template>
  <graduados-app header-title="Noticias" :header-show-back-button="true">
    <!--
      Sin buscador ni filtro de categorías: las categorías no existen en el
      origen (las noticias vienen del admin viejo de comunicaciones) — la app
      las adivinaba por palabras clave del título — y tanto el filtro como la
      búsqueda corrían sobre las noticias ya descargadas, no sobre las 300 y
      pico que hay. Mismo criterio que se aplicó en Información de interés.
    -->
    <InfinitePagination fetch-data-store="feeds/fetchAll">
      <template #skeleton>
        <ion-list>
          <ion-item v-for="i in [1,2,3,4,5]" :key="i" class="ion-margin-bottom">
            <ion-thumbnail slot="start">
              <ion-skeleton-text :animated="true"></ion-skeleton-text>
            </ion-thumbnail>
            <ion-label>
              <h3>
                <ion-skeleton-text :animated="true" style="width: 100%;"></ion-skeleton-text>
              </h3>
              <p>
                <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
              </p>
              <p>
                <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
              </p>
            </ion-label>
          </ion-item>
        </ion-list>
      </template>

      <!--
        `items` es la lista que administra InfinitePagination: cada página que
        baja con el scroll se agrega al final. Antes esta vista ignoraba el slot
        y hacía su propio fetch en onMounted, así que mostraba siempre las 15
        primeras noticias y el scroll infinito no servía para nada.
      -->
      <template #default="{ items }">
        <ion-card
          :router-link="'/noticia/'+feed.slug"
          class="news-card"
          v-for="feed in items"
          :key="feed.id"
        >
          <div class="card-header">
            <ion-thumbnail class="featured-image">
              <img
                :alt="feed.title"
                :src="feed.thumb?.absolute_path || FALLBACK_IMAGE"
                @error="handleImageError"
              />
            </ion-thumbnail>
          </div>

          <div class="card-content">
            <div class="card-meta">
              <ion-icon :icon="timeOutline" size="small" color="medium"></ion-icon>
              <ion-text color="medium">
                <small>{{ formatDate(feed.date) }}</small>
              </ion-text>
            </div>

            <h2 class="card-title">
              {{ feed.title }}
            </h2>

            <div v-if="feed.content" class="card-summary">
              <ion-text color="medium">
                {{ getNewsPreview(feed.content) }}
              </ion-text>
            </div>

            <div class="read-more">
              <ion-text color="primary">
                <small>Leer más</small>
              </ion-text>
              <ion-icon :icon="chevronForwardOutline" size="small" color="primary"></ion-icon>
            </div>
          </div>
        </ion-card>
      </template>
    </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
import { IonSkeletonText, IonText, IonCard, IonList, IonItem, IonLabel, IonThumbnail, IonIcon } from '@ionic/vue';
import {
  timeOutline,
  chevronForwardOutline
} from 'ionicons/icons';
import InfinitePagination from '../app/components/pagination/InfinitePagination.vue';

/*
 * Portada por defecto. Las noticias vienen del legacy de comunicaciones y casi
 * la mitad no tiene imagen cargada, así que el caso "sin thumb" es lo normal,
 * no un error. Va con BASE_URL porque el build web se sirve bajo /APP-GRADUADOS/
 * y la ruta absoluta `/assets/...` daba 404 ahí.
 */
const FALLBACK_IMAGE = import.meta.env.BASE_URL + 'assets/logo/logo.png';

// Por si la URL existe pero el archivo ya no está en el servidor viejo.
function handleImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  if (img.src.endsWith(FALLBACK_IMAGE)) return; // evita el bucle si falla el propio fallback
  img.src = FALLBACK_IMAGE;
}

// La API manda la fecha como DD/MM/YYYY; el resto contempla que algún día
// llegue en ISO.
function formatDate(dateString: string): string {
  try {
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

// El contenido es HTML del admin viejo: se limpia y se recorta para el preview.
function getNewsPreview(content: string): string {
  if (!content) return '';

  const cleanText = content.replace(/<[^>]*>/g, '');

  return cleanText.length > 150
    ? cleanText.substring(0, 150) + '...'
    : cleanText;
}
</script>

<style scoped>
.news-card {
  margin: 0 0 var(--app-spacing-md);
  overflow: hidden;
  position: relative;
}

/*
 * Banda de imagen por relación de aspecto en vez de 200px fijos: en un celular
 * chico esos 200px se comían casi media pantalla por card, y en uno ancho la
 * imagen quedaba achatada. 16:9 mantiene la proporción en cualquier ancho.
 */
.card-header {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.featured-image {
  width: 100% !important;
  height: 100% !important;
  --size: 100% !important;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .featured-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 16px;
}

.card-meta {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-title {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--ion-color-dark);
  transition: color 0.2s;
}

.card-title:hover {
  color: var(--ion-color-primary);
}

.card-summary {
  margin-top: 8px;
  line-height: 1.4;
  margin-bottom: 12px;
}

.card-summary ion-text {
  font-size: 0.9rem;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.news-card:hover .read-more {
  opacity: 1;
}

/* Estilos legacy que se mantienen */
ion-item {
  border: none;
  --inner-border-width: 0;
  --background: white;
  --border-radius: 4px;
}

/* Sobreescribir estilos antiguos de ion-card */
ion-card:not(.news-card) {
  display: flex;
}

ion-card:not(.news-card) ion-thumbnail {
  --size: 100%;
  --ion-padding: 0;
  flex-shrink: 0;
  width: 30%;
}
</style>
