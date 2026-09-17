<template>
  <graduados-app header-title="Información de interés" :header-show-back-button="true">
    <InfinitePagination fetch-data-store="interests/fetchAll">
        <template #skeleton>
          <ion-card class="interest-card" v-for="i in [1,2,3,4,5,6,7]" :key="i">
            <ion-card-content class="card-content">
              <div class="content-wrapper">
                <div class="header-section">
                  <ion-skeleton-text :animated="true" style="width:80px; height:16px; border-radius: 12px;"></ion-skeleton-text>
                  <ion-skeleton-text :animated="true" style="width:60%; height:24px; margin-top: 8px;"></ion-skeleton-text>
                </div>
                <div class="description-section">
                  <ion-skeleton-text :animated="true" style="width:90%; height:16px; margin-top: 8px;"></ion-skeleton-text>
                  <ion-skeleton-text :animated="true" style="width:70%; height:16px; margin-top: 4px;"></ion-skeleton-text>
                </div>
              </div>
              <div class="icon-wrapper">
                <ion-skeleton-text :animated="true" style="width:24px; height:24px; border-radius: 50%;"></ion-skeleton-text>
              </div>
            </ion-card-content>
          </ion-card>
        </template>

        <template #default="{ items }">
          <!-- Mostrar por categorías -->
          <div v-for="(categoryItems, categoryName) in categorizedItems(items)"
               :key="categoryName" 
               class="category-section">
            
            <div class="category-header ion-margin-vertical">
              <ion-icon 
                :icon="getCategoryIcon(String(categoryName))" 
                color="primary" 
                class="category-icon"
              ></ion-icon>
              <ion-text color="primary" class="category-title">
                <h3>{{ categoryName }}</h3>
              </ion-text>
            </div>

            <!-- Items de la categoría -->
            <div class="category-items">
              <!--
                La card ENTERA abre el enlace. Antes el único punto tappable era
                un ícono de ~32px en la esquina: tocar el título o la descripción
                no hacía nada. Es un <a> real (no una card con @click) para que
                mantenga el long-press de "copiar enlace" y el foco por teclado.
              -->
              <a
                v-for="info in categoryItems"
                :key="info.id"
                class="interest-link"
                :href="info.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ion-card class="interest-card">
                  <ion-card-content class="card-content">
                    <div class="content-wrapper">
                      <div class="header-section">
                        <ion-badge
                          :color="getCategoryColor(String(categoryName))"
                          class="category-badge"
                        >
                          {{ categoryName }}
                        </ion-badge>
                        <ion-text color="dark" class="item-title">
                          <h4>{{ info.title }}</h4>
                        </ion-text>
                      </div>
                      <div class="description-section">
                        <div class="info-content" v-html="getShortDescription(info.content)"></div>
                      </div>
                    </div>

                    <!-- Ícono decorativo: indica "abre un sitio externo", ya no
                         es el único blanco del tap. -->
                    <div class="icon-wrapper">
                      <ion-icon :icon="openOutline" color="primary" aria-hidden="true"></ion-icon>
                    </div>
                  </ion-card-content>
                </ion-card>
              </a>
            </div>
          </div>

          <!-- Mensaje si no hay resultados -->
          <div v-if="items.length === 0" class="no-results">
            <ion-text color="medium">
              <p>No hay información de interés disponible por el momento.</p>
            </ion-text>
          </div>
        </template>
    </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
import {
  IonText,
  IonCard,
  IonCardContent,
  IonSkeletonText,
  IonIcon,
  IonBadge
} from '@ionic/vue';
import {
  openOutline,
  libraryOutline,
  businessOutline,
  documentTextOutline,
  schoolOutline,
  informationCircleOutline
} from 'ionicons/icons';
import InfinitePagination from '../app/components/pagination/InfinitePagination.vue';

// Función para categorizar elementos automáticamente
function categorizeItem(item: any): string {
  const title = item.title?.toLowerCase() || '';
  const content = item.content?.toLowerCase() || '';
  const url = item.url?.toLowerCase() || '';
  const fullText = `${title} ${content} ${url}`;
  
  // Bibliotecas
  const libraryKeywords = ['biblioteca', 'bibliotecas', 'catálogo', 'libros', 'publicaciones', 'hemeroteca', 'archivo bibliográfico'];
  if (libraryKeywords.some(keyword => fullText.includes(keyword))) {
    return 'Bibliotecas';
  }
  
  // Organismos Públicos (incluye tribunales y demás organismos del Poder Judicial:
  // eran una categoría aparte, pero con tan pocos enlaces no se justificaba)
  const publicOrgKeywords = [
    'organismo', 'ministerio', 'secretaría', 'gobierno', 'estado', 'público', 'nacional', 'municipal', 'provincial', 'afip', 'anses', 'registro civil',
    'tribunal', 'juzgado', 'corte', 'justicia', 'judicial', 'sentencia', 'jurisprudencia', 'fuero', 'cámara',
  ];
  if (publicOrgKeywords.some(keyword => fullText.includes(keyword))) {
    return 'Organismos Públicos';
  }

  // Documentación
  const docKeywords = ['documentación', 'documento', 'formulario', 'certificado', 'constancia', 'trámite', 'gestión', 'solicitud', 'reglamento', 'normativa'];
  if (docKeywords.some(keyword => fullText.includes(keyword))) {
    return 'Documentación';
  }
  
  // UBA Derecho
  const ubaKeywords = ['uba', 'universidad de buenos aires', 'facultad de derecho', 'derecho uba', 'campus virtual', 'siu', 'graduados'];
  if (ubaKeywords.some(keyword => fullText.includes(keyword))) {
    return 'UBA Derecho';
  }
  
  return 'General';
}

// Función para obtener el ícono de cada categoría
function getCategoryIcon(categoryName: string): string {
  switch (categoryName) {
    case 'Bibliotecas': return libraryOutline;
    case 'Organismos Públicos': return businessOutline;
    case 'Documentación': return documentTextOutline;
    case 'UBA Derecho': return schoolOutline;
    default: return informationCircleOutline;
  }
}

// Función para obtener el color de cada categoría
function getCategoryColor(categoryName: string): string {
  switch (categoryName) {
    case 'Bibliotecas': return 'secondary';
    case 'Organismos Públicos': return 'primary';
    case 'Documentación': return 'warning';
    case 'UBA Derecho': return 'success';
    default: return 'medium';
  }
}

// Función para agrupar elementos por categorías
function categorizedItems(items: any[]) {
  const categories: { [key: string]: any[] } = {};

  (items || []).forEach((item: any) => {
    const category = categorizeItem(item);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });
  
  // Ordenar las categorías según prioridad
  const orderedCategories: { [key: string]: any[] } = {};
  const categoryOrder = ['Bibliotecas', 'Organismos Públicos', 'Documentación', 'UBA Derecho', 'General'];
  
  categoryOrder.forEach(categoryName => {
    if (categories[categoryName] && categories[categoryName].length > 0) {
      orderedCategories[categoryName] = categories[categoryName];
    }
  });
  
  return orderedCategories;
}

// Función para obtener descripción resumida
function getShortDescription(content: string): string {
  if (!content) return '';
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
}
</script>

<style scoped>
/* Sección de categorías */
.category-section {
  margin-bottom: 24px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: var(--app-spacing-sm);
  padding: 0;
  margin-bottom: var(--app-spacing-md);
}

.category-icon {
  font-size: 20px;
}

.category-title h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.category-items {
  padding: 0;
}

/* Cards mejoradas */
.interest-link {
  display: block;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.interest-link:focus-visible {
  outline: none;
}

.interest-link:focus-visible .interest-card {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 2px;
}

.interest-card {
  margin: 0 0 var(--app-spacing-md);
  /* Elevación y feedback de tap: los da el estilo global de `a > ion-card`. */
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-md);
  padding: var(--app-spacing-lg);
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.category-badge {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  align-self: flex-start;
  border-radius: 12px;
  padding: 4px 8px;
}

.item-title h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--app-text-title);
  letter-spacing: -0.1px;
}

.description-section {
  margin-top: 4px;
}

/* `--ion-color-medium` (#9B9B9B) daba 2.8:1 sobre blanco y la descripción se
   leía como texto deshabilitado. `--app-text-secondary` cumple 4.5:1. */
.info-content {
  color: var(--app-text-secondary);
  font-size: 13px;
  line-height: 1.45;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--app-primary-soft);
}

.icon-wrapper ion-icon {
  font-size: 16px;
}

/* Mensaje sin resultados */
.no-results {
  padding: 32px 16px;
  text-align: center;
}

.no-results p {
  margin: 0;
  font-size: 1rem;
}

/*
 * Se quitó la media query <=768px que volvía a bajar padding y tipografías:
 * como casi todos los usuarios entran desde el celular, esa rama ERA el diseño
 * por defecto y dejaba el cuerpo en ~13.6px con texto gris claro. Ahora los
 * valores base ya son los buenos para mobile y escalan bien hacia arriba.
 */
</style>