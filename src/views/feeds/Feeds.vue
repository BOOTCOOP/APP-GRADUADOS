<template>
  <graduados-app header-title="Noticias">
    <!-- Barra de búsqueda -->
    <div class="search-container ion-padding-horizontal">
      <FormSearchBar 
        placeholder="Buscar noticias por palabra clave..."
        @updated="handleSearchUpdate"
      />
    </div>

    <!-- Filtros de categoría -->
    <div class="filters-container ion-padding-horizontal">
      <ion-button 
        fill="outline" 
        size="small" 
        @click="showCategoryFilter"
        class="filter-button"
      >
        <ion-icon :icon="funnelOutline" slot="start"></ion-icon>
        {{ getCategoryLabel() }}
      </ion-button>
      
      <div v-if="selectedCategory !== 'todas'" class="active-filter">
        <ion-chip 
          :color="getCategoryColor()" 
          @click="clearCategoryFilter"
        >
          <ion-label>{{ getCategoryLabel() }}</ion-label>
          <ion-icon :icon="closeOutline" size="small"></ion-icon>
        </ion-chip>
      </div>
    </div>

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

      <template #default>
        <div v-if="filteredNews.length === 0 && searchQuery" class="no-results">
          <ion-icon :icon="searchOutline" size="large" color="medium"></ion-icon>
          <ion-text color="medium">
            <p>No se encontraron noticias que coincidan con "{{ searchQuery }}"</p>
          </ion-text>
        </div>

        <div v-else-if="filteredNews.length === 0 && selectedCategory !== 'todas'" class="no-results">
          <ion-icon :icon="funnelOutline" size="large" color="medium"></ion-icon>
          <ion-text color="medium">
            <p>No se encontraron noticias en la categoría "{{ getCategoryLabel() }}"</p>
          </ion-text>
        </div>

        <!-- Estadísticas de resultados -->
        <div v-if="filteredNews.length > 0" class="results-stats">
          <ion-text color="medium">
            <small>
              Mostrando {{ filteredNews.length }} 
              {{ filteredNews.length === 1 ? 'noticia' : 'noticias' }}
              {{ selectedCategory !== 'todas' ? `en ${getCategoryLabel()}` : '' }}
              {{ searchQuery ? `con "${searchQuery}"` : '' }}
            </small>
          </ion-text>
        </div>

        <ion-card 
          :router-link="'/noticia/'+feed.slug" 
          class="news-card" 
          :class="{ 'featured-card': index < 3 }"
          v-for="(feed, index) in filteredNews" 
          :key="feed.id"
        >
          <div class="card-header">
            <ion-thumbnail class="featured-image">
              <img 
                :alt="feed.title" 
                :src="feed.thumb.absolute_path"
                @error="handleImageError"
              />
            </ion-thumbnail>
            <ion-chip 
              :color="getCategoryColorForNews(feed.category)" 
              class="category-chip"
            >
              <ion-label>{{ getCategoryLabelForNews(feed.category) }}</ion-label>
            </ion-chip>
            
            <!-- Badge para noticias destacadas -->
            <div v-if="index < 3" class="featured-badge">
              <ion-icon :icon="starOutline" size="small"></ion-icon>
            </div>
          </div>
          
          <div class="card-content">
            <div class="card-meta">
              <ion-icon :icon="timeOutline" size="small" color="medium"></ion-icon>
              <ion-text color="medium">
                <small>{{ formatDate(feed.date) }}</small>
              </ion-text>
            </div>
            
            <h2 class="card-title" :class="{ 'featured-title': index < 3 }">
              {{ feed.title }}
            </h2>
            
            <div v-if="feed.content" class="card-summary">
              <ion-text color="medium">
                {{ getNewsPreview(feed.content) }}
              </ion-text>
            </div>

            <!-- Indicador de lectura -->
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
import { IonSkeletonText, IonText, IonCard, IonList, IonItem, IonLabel, IonThumbnail, IonButton, IonIcon, IonChip } from '@ionic/vue';
import { 
  funnelOutline, 
  closeOutline, 
  searchOutline, 
  timeOutline, 
  starOutline, 
  chevronForwardOutline 
} from 'ionicons/icons';
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import InfinitePagination from '../app/components/pagination/InfinitePagination.vue';
import FormSearchBar from '../app/components/form/FormSearchBar.vue';

interface NewsItem {
  id: number;
  slug: string;
  title: string;
  content?: string;
  date: string;
  thumb: {
    absolute_path: string;
  };
  category?: string;
}

// Categorías disponibles
const categories = [
  { value: 'todas', label: 'Todas las noticias', color: 'primary' },
  { value: 'academicas', label: 'Académicas', color: 'success' },
  { value: 'eventos', label: 'Eventos', color: 'warning' },
  { value: 'institucionales', label: 'Institucionales', color: 'tertiary' },
  { value: 'graduados', label: 'Graduados', color: 'secondary' }
];

const store = useStore();
const searchQuery = ref('');
const allNews = ref<NewsItem[]>([]);
const selectedCategory = ref('todas');

// Funciones para manejar categorías
function getCategoryLabel(): string {
  const category = categories.find(cat => cat.value === selectedCategory.value);
  return category ? category.label : 'Todas las noticias';
}

function getCategoryColor(): string {
  const category = categories.find(cat => cat.value === selectedCategory.value);
  return category ? category.color : 'primary';
}

function getCategoryColorForNews(categoryValue?: string): string {
  const category = categories.find(cat => cat.value === categoryValue);
  return category ? category.color : 'primary';
}

function getCategoryLabelForNews(categoryValue?: string): string {
  const category = categories.find(cat => cat.value === categoryValue);
  return category ? category.label : 'Institucional';
}

function clearCategoryFilter(): void {
  selectedCategory.value = 'todas';
}

function showCategoryFilter(): void {
  // Blur any focused element to prevent aria-hidden conflicts
  try {
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement).blur();
    }
  } catch (e) {
    // Si falla, no es crítico - silencioso para producción
  }
  
  const options = categories.map(category => ({
    text: category.label,
    handler: () => {
      selectedCategory.value = category.value;
    },
  }));

  // Agregar opción de cancelar
  options.push({
    text: 'Cancelar',
    handler: () => {
      // No hacer nada, solo cerrar
    }
  });

  store.dispatch('ui/action/show', options);
}

// Función para formatear fecha
function formatDate(dateString: string): string {
  try {
    // Si la fecha viene en formato DD/MM/YYYY, la convertimos
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      if (isNaN(date.getTime())) {
        return dateString; // Si no se puede parsear, devolver original
      }
      
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    // Si viene en formato ISO estándar
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return dateString; // Si no se puede parsear, devolver original
    }
    
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString; // En caso de error, devolver la fecha original
  }
}

// Función para crear preview del contenido
function getNewsPreview(content: string): string {
  if (!content) return '';
  
  // Remover tags HTML y obtener solo texto
  const cleanText = content.replace(/<[^>]*>/g, '');
  
  // Limitar a 150 caracteres
  return cleanText.length > 150 
    ? cleanText.substring(0, 150) + '...'
    : cleanText;
}

// Función para manejar errores de imagen
function handleImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = '/assets/logo/logo.png'; // Imagen por defecto
}

// Función para categorizar automáticamente las noticias
function categorizeNews(feed: NewsItem): string {
  const text = (feed.title + ' ' + (feed.content || '')).toLowerCase();
  
  // Palabras clave para cada categoría
  const keywords = {
    eventos: ['evento', 'charla', 'congreso', 'seminario', 'jornada', 'taller', 'conferencia', 'simposio', 'encuentro', 'feria'],
    academicas: ['académico', 'doctorado', 'maestría', 'carrera', 'curso', 'programa', 'educación', 'investigación', 'tesis', 'cátedra', 'facultad'],
    institucionales: ['institucional', 'universidad', 'uba', 'derecho', 'autoridades', 'resolución', 'normativa', 'convenio', 'protocolo'],
    graduados: ['graduado', 'egresado', 'alumni', 'título', 'diploma', 'profesional', 'colegio', 'matricula']
  };
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      return category;
    }
  }
  
  return 'institucionales'; // Categoría por defecto
}

// Función para manejar la búsqueda
function handleSearchUpdate(query: string) {
  searchQuery.value = query.toLowerCase().trim();
}

// Computed para filtrar noticias
const filteredNews = computed(() => {
  let filtered = allNews.value;
  
  // Filtrar por categoría
  if (selectedCategory.value !== 'todas') {
    filtered = filtered.filter(feed => feed.category === selectedCategory.value);
  }
  
  // Filtrar por búsqueda
  if (searchQuery.value) {
    filtered = filtered.filter((feed: NewsItem) => {
      const title = feed.title?.toLowerCase() || '';
      const content = feed.content?.toLowerCase() || '';
      
      return title.includes(searchQuery.value) || content.includes(searchQuery.value);
    });
  }
  
  return filtered;
});

// Cargar noticias al montar el componente
onMounted(async () => {
  try {
    const response = await store.dispatch('feeds/fetchAll');
    const newsData = response.data.data || [];
    
    // Categorizar automáticamente cada noticia
    allNews.value = newsData.map((feed: NewsItem) => ({
      ...feed,
      category: categorizeNews(feed)
    }));
  } catch (error) {
    allNews.value = [];
  }
});
</script>

<style scoped>
.search-container {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 8px;
}

.filters-container {
  background: white;
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-button {
  --border-radius: 20px;
  height: 32px;
}

.active-filter {
  display: flex;
  align-items: center;
}

.active-filter ion-chip {
  margin: 0;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 32px 16px;
}

.no-results ion-icon {
  margin-bottom: 16px;
}

.results-stats {
  padding: 8px 16px;
  background: #f8f9fa;
  border-left: 4px solid var(--ion-color-primary);
  margin: 0 16px 16px 16px;
  border-radius: 0 8px 8px 0;
}

/* Nuevos estilos para tarjetas mejoradas */
.news-card {
  margin: 0 16px 16px 16px;
  --border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  position: relative;
}

.news-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.featured-card {
  border: 2px solid var(--ion-color-primary);
  box-shadow: 0 4px 12px rgba(var(--ion-color-primary-rgb), 0.2);
}

.featured-card:hover {
  box-shadow: 0 6px 20px rgba(var(--ion-color-primary-rgb), 0.3);
}

.card-header {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.featured-card .card-header {
  height: 220px; /* Más altura para noticias destacadas */
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

.category-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  --border-radius: 12px;
  font-size: 0.75rem;
  z-index: 2;
  backdrop-filter: blur(8px);
}

.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--ion-color-warning);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  z-index: 2;
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

.featured-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ion-color-primary);
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