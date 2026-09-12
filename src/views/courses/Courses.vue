<template>
    <graduados-app header-title="Cursos de Perfeccionamiento" :header-show-back-button="true">
        <template #header-end>
            <ion-button v-if="isLoggedIn" color="primary" @click="goToHistory()">
                <ion-icon src="/assets/icons/history-2.svg"></ion-icon>
            </ion-button>
        </template>

        <!-- Sección de Mis Cursos -->
        <MyCourses v-if="validMyCourses.length > 0" :items="validMyCourses"></MyCourses>

        <!-- Sección de Búsqueda y Filtros -->
        <div class="search-filter-section">
            <ion-searchbar
                v-model="searchTerm"
                placeholder="Buscar por nombre o tema"
                :debounce="500"
                @ionInput="onSearchChange"
                show-clear-button="focus"
                class="custom-searchbar"
            ></ion-searchbar>

            <!-- Cada hilera de filtros lleva su rótulo: dos filas de chips
                 sueltas no dejaban ver que eran criterios distintos.
                 Con un solo chip ("Todos") no hay nada que elegir, así que la
                 fila entera se guarda en vez de fingir una opción. -->
            <div class="filter-group" v-if="filtrosDisponibles.length > 1">
                <p class="filter-group__label" id="filtro-cursos-label">Mostrar</p>
                <div class="filters-container" role="group" aria-labelledby="filtro-cursos-label">
                    <button
                        v-for="opcion in filtrosDisponibles"
                        :key="opcion.value"
                        type="button"
                        class="filter-chip"
                        :class="{ 'is-active': selectedFilter === opcion.value }"
                        :aria-pressed="selectedFilter === opcion.value"
                        @click="setFilter(opcion.value)"
                    >
                        <ion-icon v-if="opcion.icon" :icon="opcion.icon" aria-hidden="true"></ion-icon>
                        {{ opcion.label }}
                    </button>
                </div>
            </div>

            <!-- Filtro por modalidad. Se aplica del lado del cliente, igual que
                 en el listado de talleres: la API no filtra por modalidad.
                 Sólo se ofrece si los cursos traídos la informan: hasta que
                 producción tenga el cambio que agrega `modality` al listado,
                 estas opciones no filtraban nada real. -->
            <div class="filter-group" v-if="modalityAvailable">
                <p class="filter-group__label" id="filtro-modalidad-label">Modalidad</p>
                <div class="filters-container" role="group" aria-labelledby="filtro-modalidad-label">
                    <button
                        v-for="opcion in MODALIDADES"
                        :key="opcion.value"
                        type="button"
                        class="filter-chip"
                        :class="{ 'is-active': selectedModality === opcion.value }"
                        :aria-pressed="selectedModality === opcion.value"
                        @click="setModality(opcion.value)"
                    >
                        {{ opcion.label }}
                    </button>
                </div>
            </div>
        </div>

        <InfinitePagination
            ref="pagination"
            fetch-data-store="courses/fetchAll"
            :filters="filters"
            :per-page="PER_PAGE"
            :key="filterKey"
            empty-results-text="No se encontraron cursos que coincidan con tu búsqueda"
        >
            <template #skeleton>
                <Skeleton></Skeleton>
            </template>

            <template #default="{ items }">
                <div class="courses-section">
                    <ion-text class="section-title">
                        <h2>{{ getSectionTitle(visibleCourses(items).length) }}</h2>
                    </ion-text>

                    <!-- El vacío de InfinitePagination sólo cubre "la API no
                         devolvió nada". Si el filtro por modalidad deja la lista
                         en cero, antes quedaba el título con (0) y nada debajo. -->
                    <EmptyState
                        v-if="!visibleCourses(items).length"
                        :icon="schoolOutline"
                        title="Sin cursos para este filtro"
                        :message="emptyFilterMessage"
                    />

                    <div v-else class="courses-grid ion-margin-top">
                        <Course
                            :course="course"
                            v-for="course in visibleCourses(items)"
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
    useIonRouter
} from '@ionic/vue';
import { ref, computed, watch } from "vue";
import { useStore } from 'vuex';
import { starOutline, schoolOutline } from 'ionicons/icons';
import { useCurrentUser } from '@/uses/currentUser';
import { modalityKind } from '@/utils/modality';
import { sortByCourseNumber } from '@/utils/courses';

import MyCourses from "./components/MyCourses.vue";
import Course from "./components/Course.vue";
import Skeleton from "./Skeleton.vue";
import InfinitePagination from "../app/components/pagination/InfinitePagination.vue";
import EmptyState from "@/components/EmptyState.vue";
import EnrollmentCartBar from "@/components/EnrollmentCartBar.vue";
import { useEnrollmentCart } from "@/uses/enrollmentCart";

import "@ionic/vue/css/ionic-swiper.css";

const { count: cartCount } = useEnrollmentCart();

// El catálogo se ordena por la numeración del nombre, no por el orden en que
// pagina el backend, así que conviene que entre completo de una: con páginas de
// 8 se veía la primera tanda ordenada entre sí y la lista se reacomodaba al
// llegar la siguiente. Son ~12 cursos por período; el scroll infinito sigue
// disponible si algún día se pasa de este tope.
const PER_PAGE = 40;

const FILTROS = [
    { value: 'todos', label: 'Todos', icon: null },
    { value: 'disponibles', label: 'Disponibles', icon: null },
    { value: 'graduados_uba', label: 'Solo Graduados UBA', icon: starOutline },
] as const;

// El backend no filtra por modalidad, así que se resuelve acá sobre la página
// ya traída — mismo criterio que Activities.vue para talleres.
const MODALIDADES = [
    { value: 'all', label: 'Todas las modalidades' },
    { value: 'presencial', label: 'Presencial' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hibrida', label: 'Híbrida' },
] as const;

const searchTerm = ref('');
const selectedFilter = ref<string>('todos');
const selectedModality = ref<string>('all');
const filterKey = ref(0);
const pagination = ref<any>(null);

// Qué campos informa realmente el listado. Se decide con las respuestas que
// traen cursos y NO con `items` en vivo: al cambiar de filtro la lista se vacía
// mientras se recarga, y mirando ese hueco los chips parecían dejar de estar
// soportados — se ocultaban y reseteaban el filtro recién elegido.
const camposInformados = ref<Record<string, boolean>>({});

watch(
    () => pagination.value?.items,
    (items: any[] | undefined) => {
        if (!items?.length) return;

        camposInformados.value = {
            can_enroll: items.some((course: any) => course?.can_enroll !== undefined),
            is_only_for_graduado_uba: items.some(
                (course: any) => course?.is_only_for_graduado_uba !== undefined
            ),
            modality: items.some((course: any) => Boolean(course?.modality)),
        };
    },
    { immediate: true }
);

// `modalityKind` cae en "presencial" cuando no reconoce el texto, así que sin
// este chequeo un listado sin `modality` se ofrecía como si fuera todo
// presencial y "Virtual"/"Híbrida" no devolvían nunca nada.
const modalityAvailable = computed(() => camposInformados.value.modality === true);

// Ninguno de los dos filtros de esta fila estaba funcionando:
//
// - "Disponibles" no viajaba al backend ni se aplicaba acá, así que devolvía los
//   mismos cursos y sólo cambiaba el título de la sección. Ahora se resuelve con
//   `can_enroll`, el mismo flag con el que la card decide si ofrece inscribirse.
// - "Solo Graduados UBA" manda `is_only_for_graduado_uba` como parámetro, pero
//   ese filtro no existe en la API: la respuesta viene igual de completa.
//
// Los dos dependen de un campo del listado, así que se ofrecen sólo si la
// respuesta lo trae. Mejor no mostrar el chip que mostrar uno mudo.
const CAMPO_REQUERIDO: Record<string, string> = {
    disponibles: 'can_enroll',
    graduados_uba: 'is_only_for_graduado_uba',
};

const filtrosDisponibles = computed(() =>
    FILTROS.filter((opcion) => {
        const campo = CAMPO_REQUERIDO[opcion.value];

        return !campo || camposInformados.value[campo] === true;
    })
);

// Los dos filtros que se aplican en el cliente pueden dejar la lista en cero con
// la API devolviendo cursos; el mensaje tiene que decir cuál aflojar.
const emptyFilterMessage = computed(() => {
    if (selectedModality.value !== 'all') {
        return 'Ningún curso coincide con la modalidad elegida. Probá con “Todas las modalidades”.';
    }

    if (selectedFilter.value === 'disponibles') {
        return 'Por ahora no hay cursos con la inscripción abierta. Probá con “Todos”.';
    }

    return 'Ningún curso coincide con los filtros elegidos.';
});

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

// Si el listado se queda sin modalidades (otra búsqueda, otro filtro) la fila se
// oculta: hay que soltar la selección o seguiría filtrando sin que se vea.
watch(modalityAvailable, (disponible) => {
    if (!disponible) selectedModality.value = 'all';
});

// Ídem con la fila "Mostrar": un chip que deja de ofrecerse no puede quedar
// activo, o seguiría filtrando sin control visible para desactivarlo.
watch(filtrosDisponibles, (opciones) => {
    if (!opciones.some((opcion) => opcion.value === selectedFilter.value)) {
        setFilter('todos');
    }
});

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
// ("Presencial", "A distancia", etc.) a las cuatro claves conocidas. Los cursos
// sin modalidad informada no entran en ningún filtro puntual: antes caían todos
// en "presencial" por el default de modalityKind.
function filteredCourses(items: any[]) {
    let resultado = items;

    // "Disponibles" sólo cambiaba el título de la sección: no se aplicaba en
    // ningún lado (tampoco viaja al backend, ver `filters`). Ahora filtra por el
    // mismo flag que decide si la card ofrece inscribirse.
    if (selectedFilter.value === 'disponibles') {
        resultado = resultado.filter((course: any) => course.can_enroll === true);
    }

    if (selectedModality.value !== 'all') {
        resultado = resultado.filter(
            (course: any) => course.modality && modalityKind(course.modality) === selectedModality.value
        );
    }

    return resultado;
}

// Lo que efectivamente se pinta: filtrado + ordenado por la numeración de la
// carga ("01 - …", "02 - …"). La API ya ordena así desde el cambio en
// CourseDataProvider; esto sostiene el orden si responde una versión anterior.
function visibleCourses(items: any[]) {
    return sortByCourseNumber(filteredCourses(items));
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
    background: var(--app-surface-alt, #FAFAFC);
    border: 1px solid var(--app-border, rgba(23, 22, 28, 0.08));
    border-radius: var(--app-radius-md, 16px);
    padding: var(--app-spacing-md, 12px);
    margin: var(--app-spacing-lg, 16px) 0;
}

.custom-searchbar {
    --background: var(--app-surface, #fff);
    --border-radius: var(--app-radius-sm, 10px);
    --box-shadow: none;
    --color: var(--app-text-title, #17161C);
    --placeholder-color: var(--app-text-secondary, #6B6B78);
    --icon-color: var(--ion-color-primary);
    padding: 0;
}

.filter-group {
    margin-top: var(--app-spacing-md, 12px);
}

.filter-group__label {
    margin: 0 0 var(--app-spacing-sm, 8px);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: var(--app-text-secondary, #6B6B78);
}

.filters-container {
    display: flex;
    gap: var(--app-spacing-sm, 8px);
    flex-wrap: wrap;
    justify-content: flex-start;
}

/*
 * Chips propios en vez de <ion-chip>. Con los props `color`/`outline`, Ionic
 * escribe `background` y `color` directo sobre el host y esas declaraciones le
 * ganan a `--background`/`--color`: el chip activo quedaba con fondo casi
 * transparente y texto blanco, ilegible. Un <button> además da foco por teclado
 * y `aria-pressed`, que el chip no tenía.
 */
.filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 0 14px;
    border-radius: var(--app-radius-pill, 100px);
    border: 1px solid var(--app-border-strong, rgba(23, 22, 28, 0.14));
    background: var(--app-surface, #fff);
    color: var(--app-text-body, #4A4A55);
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    line-height: 1;
    cursor: pointer;
    transition: background var(--app-duration-fast, 120ms) var(--app-ease),
                border-color var(--app-duration-fast, 120ms) var(--app-ease),
                color var(--app-duration-fast, 120ms) var(--app-ease);
}

.filter-chip ion-icon {
    font-size: 16px;
}

.filter-chip:hover {
    border-color: var(--ion-color-primary);
    color: var(--ion-color-primary);
}

.filter-chip:focus-visible {
    outline: 2px solid var(--ion-color-primary);
    outline-offset: 2px;
}

.filter-chip.is-active,
.filter-chip.is-active:hover {
    background: var(--ion-color-primary);
    border-color: var(--ion-color-primary);
    color: var(--ion-color-primary-contrast, #fff);
    font-weight: 600;
    box-shadow: var(--app-shadow-primary, 0 4px 16px rgba(171, 73, 204, 0.22));
}

.courses-section {
    margin-top: var(--app-spacing-xl, 24px);
}

.section-title h2 {
    color: var(--app-text-title, #17161C);
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0;
}

.courses-grid {
    display: flex;
    flex-direction: column;
    gap: var(--app-spacing-md, 12px);
}

/* Mejoras generales de diseño */
ion-searchbar.custom-searchbar {
    --clear-button-color: var(--ion-color-primary);
    --search-icon-color: var(--ion-color-primary);
}

/* Responsive design */
@media (min-width: 768px) {
    .courses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--app-spacing-lg, 16px);
    }
}
</style>
