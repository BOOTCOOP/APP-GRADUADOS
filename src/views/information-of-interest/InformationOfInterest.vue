<template>
  <graduados-app header-title="Información de interés">  
    <!-- Búsqueda y filtros -->
    <div class="search-filter-container ion-margin-bottom">
      <FormSearchBar 
        v-model="searchQuery"
        placeholder="Buscar información de interés..."
        class="search-bar"
      />
      
      <ion-button 
        size="small" 
        fill="outline" 
        color="primary"
        @click="openCategoryFilter"
        class="filter-button"
      >
        <ion-icon slot="start" :icon="filterOutline"></ion-icon>
        Categorías
        <ion-badge color="primary" v-if="selectedCategory !== 'all'" class="filter-badge">
          1
        </ion-badge>
      </ion-button>
    </div>

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
          <div v-for="(categoryItems, categoryName) in categorizedItems(filteredItems(items))" 
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
              <ion-card v-for="info in categoryItems" :key="info.id" class="interest-card">
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
                  
                  <div class="icon-wrapper">
                    <a :href="info.url" target="_blank" @click.stop>
                      <ion-button fill="clear" size="small" class="action-button">
                        <ion-icon :icon="openOutline" color="primary"></ion-icon>
                      </ion-button>
                    </a>
                  </div>
                </ion-card-content>
              </ion-card>
            </div>
          </div>

          <!-- Mensaje si no hay resultados -->
          <div v-if="filteredItems(items).length === 0" class="no-results">
            <ion-text color="medium">
              <p>No se encontró información que coincida con tu búsqueda.</p>
            </ion-text>
          </div>
        </template>
    </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { 
  IonText, 
  IonCard, 
  IonCardContent, 
  IonSkeletonText, 
  IonIcon, 
  IonButton, 
  IonBadge, 
  actionSheetController 
} from '@ionic/vue';
import { 
  openOutline, 
  filterOutline, 
  documentTextOutline,
  giftOutline,
  linkOutline,
  schoolOutline,
  businessOutline,
  informationCircleOutline
} from 'ionicons/icons';
import InfinitePagination from '../app/components/pagination/InfinitePagination.vue';
import FormSearchBar from '../app/components/form/FormSearchBar.vue';

// Estados reactivos
const searchQuery = ref('');
const selectedCategory = ref('all');

// Función para categorizar elementos automáticamente
function categorizeItem(item: any): string {
  const title = item.title?.toLowerCase() || '';
  const content = item.content?.toLowerCase() || '';
  const url = item.url?.toLowerCase() || '';
  const fullText = `${title} ${content} ${url}`;
  
  // Reglamentos y normativas
  const regulationKeywords = ['reglamento', 'normativa', 'estatuto', 'código', 'resolución', 'ordenanza', 'decreto', 'ley'];
  if (regulationKeywords.some(keyword => fullText.includes(keyword))) {
    return 'Reglamentos';
  }
  
  // Beneficios y descuentos
  const benefitKeywords = ['beneficio', 'descuento', 'promoción', 'oferta', 'convenio', 'acuerdo', 'ventaja'];
  if (benefitKeywords.some(keyword => fullText.includes(keyword))) {
    return 'Beneficios';
  }
  
  // Enlaces útiles y recursos
  const linkKeywords = ['enlace', 'link', 'sitio', 'página', 'portal', 'sistema', 'plataforma'];
  if (linkKeywords.some(keyword => fullText.includes(keyword))) {
    return 'Enlaces útiles';
  }
  
  // Información académica
  const academicKeywords = ['académico', 'universidad', 'facultad', 'grado', 'título', 'carrera'];
  if (academicKeywords.some(keyword => fullText.includes(keyword))) {
    return 'Información académica';
  }
  
  // Servicios
  const serviceKeywords = ['servicio', 'atención', 'consulta', 'trámite', 'gestión'];
  if (serviceKeywords.some(keyword => fullText.includes(keyword))) {
    return 'Servicios';
  }
  
  return 'General';
}

// Función para obtener el ícono de cada categoría
function getCategoryIcon(categoryName: string): string {
  switch (categoryName) {
    case 'Reglamentos': return documentTextOutline;
    case 'Beneficios': return giftOutline;
    case 'Enlaces útiles': return linkOutline;
    case 'Información académica': return schoolOutline;
    case 'Servicios': return businessOutline;
    default: return informationCircleOutline;
  }
}

// Función para obtener el color de cada categoría
function getCategoryColor(categoryName: string): string {
  switch (categoryName) {
    case 'Reglamentos': return 'danger';
    case 'Beneficios': return 'success';
    case 'Enlaces útiles': return 'warning';
    case 'Información académica': return 'primary';
    case 'Servicios': return 'secondary';
    default: return 'medium';
  }
}

// Función para filtrar elementos
function filteredItems(items: any[]) {
  if (!items) return [];
  
  let filtered = items;
  
  // Filtro por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter((item: any) => {
      return (
        item.title?.toLowerCase().includes(query) ||
        item.content?.toLowerCase().includes(query) ||
        item.url?.toLowerCase().includes(query)
      );
    });
  }
  
  // Filtro por categoría
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((item: any) => {
      const category = categorizeItem(item);
      return category === selectedCategory.value;
    });
  }
  
  return filtered;
}

// Función para agrupar elementos por categorías
function categorizedItems(items: any[]) {
  const categories: { [key: string]: any[] } = {};
  
  items.forEach((item: any) => {
    const category = categorizeItem(item);
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(item);
  });
  
  // Ordenar las categorías según prioridad
  const orderedCategories: { [key: string]: any[] } = {};
  const categoryOrder = ['Reglamentos', 'Beneficios', 'Enlaces útiles', 'Información académica', 'Servicios', 'General'];
  
  categoryOrder.forEach(categoryName => {
    if (categories[categoryName] && categories[categoryName].length > 0) {
      orderedCategories[categoryName] = categories[categoryName];
    }
  });
  
  return orderedCategories;
}

// Función para mostrar filtros de categorías
async function openCategoryFilter() {
  const actionSheet = await actionSheetController.create({
    header: 'Filtrar por categoría',
    buttons: [
      { text: 'Todas las categorías', handler: () => { selectedCategory.value = 'all'; } },
      { text: 'Reglamentos', handler: () => { selectedCategory.value = 'Reglamentos'; } },
      { text: 'Beneficios', handler: () => { selectedCategory.value = 'Beneficios'; } },
      { text: 'Enlaces útiles', handler: () => { selectedCategory.value = 'Enlaces útiles'; } },
      { text: 'Información académica', handler: () => { selectedCategory.value = 'Información académica'; } },
      { text: 'Servicios', handler: () => { selectedCategory.value = 'Servicios'; } },
      { text: 'General', handler: () => { selectedCategory.value = 'General'; } },
      { text: 'Cancelar', role: 'cancel' }
    ]
  });
  await actionSheet.present();
}

// Función para obtener descripción resumida
function getShortDescription(content: string): string {
  if (!content) return '';
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
}
</script>

<style scoped>
/* Contenedor de búsqueda y filtros */
.search-filter-container {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  padding: 16px;
}

.search-bar {
  flex: 1;
  margin-bottom: 0 !important;
}

.filter-button {
  flex-shrink: 0;
  min-height: 44px;
}

.filter-badge {
  margin-left: 4px;
  font-size: 10px;
}

/* Sección de categorías */
.category-section {
  margin-bottom: 24px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 12px;
}

.category-icon {
  font-size: 24px;
}

.category-title h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.category-items {
  padding: 0 16px;
}

/* Cards mejoradas */
.interest-card {
  margin-bottom: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.interest-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
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
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--ion-color-dark);
}

.description-section {
  margin-top: 4px;
}

.info-content {
  color: var(--ion-color-medium);
  font-size: 0.9rem;
  line-height: 1.4;
}

.icon-wrapper {
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
}

.action-button {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  min-height: 32px;
  border-radius: 50%;
}

.action-button:hover {
  --background: var(--ion-color-primary-tint);
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

/* Responsive design */
@media (max-width: 768px) {
  .search-filter-container {
    padding: 12px;
    gap: 6px;
  }
  
  .category-header {
    padding: 0 12px;
  }
  
  .category-items {
    padding: 0 12px;
  }
  
  .card-content {
    padding: 12px;
    gap: 12px;
  }
  
  .category-title h3 {
    font-size: 1.1rem;
  }
  
  .item-title h4 {
    font-size: 0.95rem;
  }
  
  .info-content {
    font-size: 0.85rem;
  }
}
</style>