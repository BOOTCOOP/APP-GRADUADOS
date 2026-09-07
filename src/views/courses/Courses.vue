<template>
    <graduados-app header-title="Cursos de Perfeccionamiento">
        <template #header-end>
            <ion-button v-if="isLoggedIn" color="primary" @click="goToHistory()">
                <ion-icon src="/assets/icons/history-2.svg"></ion-icon>
            </ion-button>
        </template>

        <!-- Sección de Mis Cursos -->
        <MyCourses v-if="validMyCourses.length > 0" :items="validMyCourses"></MyCourses>

        <!-- Sección de Búsqueda y Filtros -->
        <div class="search-filter-section ion-padding">
            <ion-searchbar
                v-model="searchTerm"
                placeholder="Buscar cursos por nombre o palabra clave..."
                :debounce="500"
                @ionInput="onSearchChange"
                show-clear-button="focus"
                class="custom-searchbar"
            ></ion-searchbar>
            
            <!-- Filtros -->
            <div class="filters-container ion-margin-top">
                <ion-chip 
                    :class="{ 'active': selectedFilter === 'todos' }"
                    @click="setFilter('todos')"
                    color="primary"
                >
                    <ion-label>Todos</ion-label>
                </ion-chip>
                <ion-chip 
                    :class="{ 'active': selectedFilter === 'disponibles' }"
                    @click="setFilter('disponibles')"
                    outline
                >
                    <ion-label>Disponibles</ion-label>
                </ion-chip>
                <ion-chip 
                    :class="{ 'active': selectedFilter === 'graduados_uba' }"
                    @click="setFilter('graduados_uba')"
                    outline
                >
                    <ion-icon :icon="starOutline" size="small"></ion-icon>
                    <ion-label>Solo Graduados UBA</ion-label>
                </ion-chip>
            </div>

            <!-- Filtro por modalidad. Se aplica del lado del cliente, igual que
                 en el listado de talleres: la API no filtra por modalidad. -->
            <div class="filters-container ion-margin-top">
                <ion-chip
                    v-for="opcion in MODALIDADES"
                    :key="opcion.value"
                    :class="{ 'active': selectedModality === opcion.value }"
                    @click="setModality(opcion.value)"
                    outline
                >
                    <ion-label>{{ opcion.label }}</ion-label>
                </ion-chip>
            </div>
        </div>

        <InfinitePagination
            fetch-data-store="courses/fetchAll"
            :filters="filters"
            :key="filterKey"
            empty-results-text="No se encontraron cursos que coincidan con tu búsqueda"
        >
            <template #skeleton>
                <Skeleton></Skeleton>
            </template>

            <template #default="{ items }">
                <div class="courses-section">
                    <ion-text class="section-title">
                        <h2>{{ getSectionTitle(filteredCourses(items).length) }}</h2>
                    </ion-text>
                    <div class="courses-grid ion-margin-top">
                        <Course
                            :course="course"
                            v-for="course in filteredCourses(items)"
                            :key="(course as any).id"
                            :inscribed="validMyCourses.find((c: any) => c.id == (course as any).id)"
                        ></Course>
                    </div>
                </div>
            </template>
        </InfinitePagination>

        <!-- Barra de "mi selección": sólo cuando hay algo seleccionado. -->
        <template #footer v-if="cartCount > 0">
            <EnrollmentCartBar />
        </template>
    </graduados-app>
</template>
  
  <script setup lang="ts">
import "swiper/css";
import { 
    IonButton, 
    IonIcon, 
    IonText, 
    IonSearchbar, 
    IonChip, 
    IonLabel, 
    useIonRouter 
} from '@ionic/vue';
import { ref, computed, watch } from "vue";
import { useStore } from 'vuex';
import { starOutline } from 'ionicons/icons';
import { useCurrentUser } from '@/uses/currentUser';
import { modalityKind } from '@/utils/modality';

import MyCourses from "./components/MyCourses.vue";
import Course from "./components/Course.vue";
import Skeleton from "./Skeleton.vue";
import InfinitePagination from "../app/components/pagination/InfinitePagination.vue";
import EnrollmentCartBar from "@/components/EnrollmentCartBar.vue";
import { useEnrollmentCart } from "@/uses/enrollmentCart";

import "@ionic/vue/css/ionic-swiper.css";

const { count: cartCount } = useEnrollmentCart();

// El backend no filtra por modalidad, así que se resuelve acá sobre la página
// ya traída — mismo criterio que Activities.vue para talleres.
const MODALIDADES = [
    { value: 'all', label: 'Todas las modalidades' },
    { value: 'presencial', label: 'Presencial' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hibrida', label: 'Híbrida' },
] as const;

const searchTerm = ref('');
const selectedFilter = ref('todos');
const selectedModality = ref<string>('all');
const filterKey = ref(0);

const filters = computed(() => {
    const baseFilters: any = {};
    
    // Agregar término de búsqueda si existe
    if (searchTerm.value && searchTerm.value.trim()) {
        baseFilters.search = searchTerm.value.trim();
    }
    
    // Agregar filtros específicos
    if (selectedFilter.value === 'graduados_uba') {
        baseFilters.is_only_for_graduado_uba = true;
    }
    
    return baseFilters;
});

const myCourses = ref([]);
const store = useStore();
const { isLoggedIn } = useCurrentUser();

// Cursos con inscripción registrada. Antes se descartaban los estados
// "aprobada/test/ejemplo/prueba" para ocultar datos de prueba, pero "Aprobada"
// es el estado REAL de una inscripción paga: el filtro escondía justamente las
// válidas. Sumado a que el backend mandaba `inscriptions` siempre vacío, la
// sección "Mis cursos" no se mostraba nunca.
const validMyCourses = computed(() =>
    myCourses.value.filter((course: any) => Boolean(course.inscriptions?.[0]?.status?.value))
);

// "Mis cursos" requiere sesión: solo pedimos courses/own con usuario logueado.
// El watch (y no onMounted) cubre el caso de loguearse y volver sin recargar.
watch(isLoggedIn, (logged) => {
    if (logged) {
        store.dispatch("courses/own").then((response) => {
            myCourses.value = response.data.data;
        })
    } else {
        myCourses.value = [];
    }
}, { immediate: true });

const router = useIonRouter();

function goToHistory() {
    router.push({name:'courses.history'})
}

function onSearchChange(event: CustomEvent) {
    searchTerm.value = event.detail.value;
    // Forzar recarga de la paginación
    filterKey.value += 1;
}

function setModality(value: string) {
    selectedModality.value = value;
}

// `modalityKind` normaliza el texto libre que viene de la base legacy
// ("Presencial", "A distancia", etc.) a las cuatro claves conocidas.
function filteredCourses(items: any[]) {
    if (selectedModality.value === 'all') return items;

    return items.filter((course: any) => modalityKind(course.modality) === selectedModality.value);
}

function setFilter(filter: string) {
    selectedFilter.value = filter;
    // Forzar recarga de la paginación
    filterKey.value += 1;
}

function getSectionTitle(itemsCount: number) {
    if (searchTerm.value && searchTerm.value.trim()) {
        return `Resultados de búsqueda (${itemsCount})`;
    }
    
    switch (selectedFilter.value) {
        case 'disponibles':
            return `Cursos disponibles (${itemsCount})`;
        case 'graduados_uba':
            return `Solo para Graduados UBA (${itemsCount})`;
        default:
            return `Próximos cursos (${itemsCount})`;
    }
}
</script>

<style scoped>
.search-filter-section {
    background: var(--ion-color-light, #f4f5f8);
    border-radius: 12px;
    margin: 16px 0;
}

.custom-searchbar {
    --background: white;
    --border-radius: 8px;
    --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    --color: var(--ion-color-dark);
    --placeholder-color: var(--ion-color-medium);
    --icon-color: var(--ion-color-primary);
}

.filters-container {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-bottom: 8px;
}

ion-chip {
    --background: transparent;
    --color: var(--ion-color-medium);
    border: 1px solid var(--ion-color-light-shade);
    transition: all 0.2s ease;
}

ion-chip.active {
    --background: var(--ion-color-primary);
    --color: white;
    border-color: var(--ion-color-primary);
}

ion-chip:not(.active) {
    --background: white;
    --color: var(--ion-color-dark);
}

.courses-section {
    margin-top: 24px;
}

.section-title h2 {
    color: var(--ion-color-dark);
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0;
}

.courses-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Mejoras generales de diseño */
ion-searchbar.custom-searchbar {
    --clear-button-color: var(--ion-color-primary);
    --search-icon-color: var(--ion-color-primary);
}

.filters-container ion-chip {
    font-size: 0.875rem;
    height: 32px;
    border-radius: 16px;
}

.filters-container ion-chip ion-icon {
    margin-right: 4px;
    font-size: 16px;
}

/* Responsive design */
@media (min-width: 768px) {
    .courses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 16px;
    }
}
</style>
  