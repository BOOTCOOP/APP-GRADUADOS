<template>
  <graduados-app header-title="Material Bibliográfico">
    <div class="filters" v-if="true">
      <FormSearchBar
        placeholder="Buscar material bibliográfico..."
        @updated="(value) => (searchText = value)"
      />
      <IonButton 
        color="medium" 
        @click="showFileTypeFilters" 
        class="ion-margin-start"
        ref="fileFilterButton"
      >
        <IonIcon :md="filterOutline" :ios="filterOutline"></IonIcon>
      </IonButton>
      <IonButton 
        color="medium" 
        @click="showCategoryFilters" 
        class="ion-margin-start"
        ref="categoryFilterButton"
      >
        <IonIcon :md="libraryOutline" :ios="libraryOutline"></IonIcon>
      </IonButton>
    </div>

    <InfinitePagination
      fetch-data-store="bibliographies/fetchAll"
      :filters="filters"
      :has-searcher="false"
      empty-results-text="No hay material bibliográfico para mostrar"
    >
      <template #skeleton>
        <Skeleton></Skeleton>
      </template>

      <template #default="{ items }">
        <IonList class="ion-margin-top">
          <BibliographyItem
            :file="bibliography"
            v-for="(bibliography, index) in filteredBibliographies(items)"
            :key="`bibliography-${bibliography.id}-${index}`"
          ></BibliographyItem>
        </IonList>
      </template>
    </InfinitePagination>
  </graduados-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonList, IonButton, IonIcon } from '@ionic/vue'
import { filterOutline, libraryOutline } from 'ionicons/icons'
import { useStore } from 'vuex'

import Skeleton from '../activities/Skeleton.vue'
import InfinitePagination from '../app/components/pagination/InfinitePagination.vue'
import BibliographyItem from './components/BibliographyItem.vue'
import FormSearchBar from '../app/components/form/FormSearchBar.vue'

const filters = ref({
  // TODO: Agregar filtros de material bibliográfico
})

const store = useStore()
const searchText = ref("")
const selectedFileTypes = ref<string[]>([])
const selectedCategories = ref<string[]>([])
const fileFilterButton = ref()
const categoryFilterButton = ref()

// Función para categorizar bibliografías basado en la primera palabra del theme
const categorizeBibliography = (theme: string) => {
  if (!theme) return 'OTROS';
  
  // Tomar la primera palabra y convertir a mayúscula
  const firstWord = theme.trim().split(' ')[0].toUpperCase();
  
  // Verificar si es una de las categorías válidas (con y sin tilde)
  if (firstWord === 'LEGISLACIÓN' || firstWord === 'LEGISLACION') {
    return 'LEGISLACIÓN';
  }
  if (firstWord === 'DOCTRINA') {
    return 'DOCTRINA';
  }
  if (firstWord === 'JURISPRUDENCIA') {
    return 'JURISPRUDENCIA';
  }
  
  // Si no coincide con ninguna, va a "OTROS"
  return 'OTROS';
}

// Función para mostrar filtros de tipo de archivo
const showFileTypeFilters = async () => {
  // Quitar el focus del botón antes de mostrar el modal
  if (fileFilterButton.value?.$el) {
    fileFilterButton.value.$el.blur()
  }
  
  // Pequeño delay para permitir que el blur tome efecto
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // Obtenemos todos los tipos de archivo únicos de los datos
  const fileTypes = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'txt', 'rtf', 'odt']
  
  const actions = fileTypes.map(fileType => ({
    text: selectedFileTypes.value.includes(fileType) 
      ? `✓ ${fileType.toUpperCase()}` 
      : fileType.toUpperCase(),
    handler: () => {
      if (selectedFileTypes.value.includes(fileType)) {
        // Remover el filtro
        selectedFileTypes.value = selectedFileTypes.value.filter(t => t !== fileType)
      } else {
        // Agregar el filtro
        selectedFileTypes.value.push(fileType)
      }
    }
  }))

  // Agregar opción para limpiar filtros
  actions.push({
    text: "Limpiar filtros",
    handler: () => {
      selectedFileTypes.value = []
    }
  })

  try {
    await store.dispatch("ui/action/show", actions)
  } catch (error) {
    // Error silencioso para producción
  }
}

// Función para mostrar filtros de categoría
const showCategoryFilters = async () => {
  // Quitar el focus del botón antes de mostrar el modal
  if (categoryFilterButton.value?.$el) {
    categoryFilterButton.value.$el.blur()
  }
  
  // Pequeño delay para permitir que el blur tome efecto
  await new Promise(resolve => setTimeout(resolve, 50))
  
  // Mostrar siempre las categorías fijas, independientemente de si tienen datos
  const fixedCategories = ['LEGISLACIÓN', 'DOCTRINA', 'JURISPRUDENCIA', 'OTROS']
  
  const actions = fixedCategories.map(category => ({
    text: selectedCategories.value.includes(category) 
      ? `✓ ${category}` 
      : category,
    handler: () => {
      if (selectedCategories.value.includes(category)) {
        // Remover el filtro
        selectedCategories.value = selectedCategories.value.filter(c => c !== category)
      } else {
        // Agregar el filtro
        selectedCategories.value.push(category)
      }
    }
  }))

  // Agregar opción para limpiar filtros
  actions.push({
    text: "Limpiar filtros de categoría",
    handler: () => {
      selectedCategories.value = []
    }
  })

  try {
    await store.dispatch("ui/action/show", actions)
  } catch (error) {
    // Error silencioso para producción
  }
}

// Función para filtrar bibliografías del lado cliente
const filteredBibliographies = (bibliographies: any[]) => {
  if (!bibliographies) return [];

  return bibliographies.filter((bibliography) => {
    // Filtro por búsqueda de texto
    if (searchText.value && searchText.value.trim() !== "") {
      const searchTerm = searchText.value.toLowerCase().trim();
      let matchesSearch = false;
      
      // Buscar en el tema/título
      if (bibliography.theme && bibliography.theme.toLowerCase().includes(searchTerm)) {
        matchesSearch = true;
      }

      // Buscar en los nombres de archivos
      if (bibliography.files && Array.isArray(bibliography.files)) {
        for (const file of bibliography.files) {
          if (file.name && file.name.toLowerCase().includes(searchTerm)) {
            matchesSearch = true;
            break;
          }
        }
      }

      if (!matchesSearch) {
        return false;
      }
    }

    // Filtro por tipo de archivo
    if (selectedFileTypes.value.length > 0) {
      let hasSelectedFileType = false;
      
      if (bibliography.files && Array.isArray(bibliography.files)) {
        for (const file of bibliography.files) {
          if (file.extension && selectedFileTypes.value.includes(file.extension.toLowerCase())) {
            hasSelectedFileType = true;
            break;
          }
        }
      }

      if (!hasSelectedFileType) {
        return false;
      }
    }

    // Filtro por categoría
    if (selectedCategories.value.length > 0) {
      const bibliographyCategory = categorizeBibliography(bibliography.theme);
      
      if (!selectedCategories.value.includes(bibliographyCategory)) {
        return false;
      }
    }

    return true;
  });
};
</script>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  padding: 16px;
}
</style>
