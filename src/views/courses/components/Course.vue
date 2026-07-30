<template>
    <!--
      La navegación va en la RAÍZ de la card, no en bloques internos. Antes el
      @click estaba solo en el título y en el bloque de datos, así que tocar el
      padding, los badges o el espacio entre filas no hacía nada — y como el
      estilo global le daba a toda ion-card el efecto de "apretado", parecía que
      el tap había fallado. `role`/`tabindex`/`keydown` replican el
      comportamiento de un botón para teclado y lectores de pantalla.
    -->
    <ion-card
        class="course-card is-tappable"
        role="button"
        tabindex="0"
        :aria-label="`Ver detalles del curso ${course.title}`"
        @click="showDetail"
        @keydown.enter.prevent="showDetail"
        @keydown.space.prevent="showDetail"
    >
        <ion-card-content>
            <!-- Estado de inscripción si está inscripto -->
            <div v-if="inscribed && hasValidInscriptionStatus" class="enrollment-status">
                <ion-badge :color="inscribed.inscriptions[0].status.class">
                    {{ inscribed.inscriptions[0].status.value }}
                </ion-badge>
            </div>
            
            <!-- Indicador UBA Graduados -->
            <div v-if="course.is_only_for_graduado_uba" class="uba-indicator">
                <ion-chip color="warning" size="small">
                    <ion-icon :icon="starOutline"></ion-icon>
                    <ion-label>Solo Graduados UBA</ion-label>
                </ion-chip>
            </div>

            <!-- Título del curso -->
            <div class="course-header">
                <ion-text class="course-title">
                    <h3>{{ course.title }}</h3>
                </ion-text>
            </div>

            <!-- Información del curso -->
            <div class="course-info ion-margin-top">
                <div class="info-row">
                    <ion-icon :icon="personCircleOutline" color="primary"></ion-icon>
                    <ion-text color="medium">
                        <strong>Docentes:</strong> {{ course.teachers }}
                    </ion-text>
                </div>
                
                <div class="info-row ion-margin-top">
                    <ion-icon :icon="calendarOutline" color="primary"></ion-icon>
                    <ion-text color="medium">
                        <strong>Inicio:</strong> {{ course.start }}
                    </ion-text>
                </div>

                <div v-if="course.beginning" class="info-row ion-margin-top">
                    <ion-icon :icon="timeOutline" color="primary"></ion-icon>
                    <ion-text color="medium">
                        <strong>Estado:</strong> {{ course.beginning }}
                    </ion-text>
                </div>
            </div>

            <!-- Pie de la card: refuerzo visual de que la card entera navega.
                 Ya no es un <ion-button> con su propio handler (duplicaba el de
                 la raíz y podía disparar dos navegaciones). -->
            <div class="card-footer ion-margin-top">
                <span class="details-hint">
                    Ver detalles
                    <ion-icon :icon="chevronForwardOutline" aria-hidden="true"></ion-icon>
                </span>

                <!-- Badge de inscripción si está inscripto (lado derecho) -->
                <ion-chip
                    v-if="inscribed && hasValidInscriptionStatus"
                    color="success"
                    size="small"
                    class="status-chip"
                >
                    <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                    <ion-label>Inscripto</ion-label>
                </ion-chip>
            </div>
        </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import {
    IonCard,
    IonCardContent,
    IonIcon,
    IonText,
    IonBadge,
    IonChip,
    IonLabel,
    useIonRouter
} from '@ionic/vue';

import { computed } from 'vue';
import { 
    personCircleOutline, 
    calendarOutline, 
    starOutline,
    timeOutline,
    chevronForwardOutline,
    checkmarkCircleOutline
} from 'ionicons/icons';

interface Course {
    id: number;
    title: string;
    teachers: string;
    start: string;
    beginning?: string;
    is_only_for_graduado_uba: boolean;
    slug: string;
}

interface Inscribed {
    inscriptions: Array<{
        status: {
            class: string;
            value: string;
        };
    }>;
}

const props = defineProps<{
    course: Course;
    inscribed?: Inscribed;
}>();

const router = useIonRouter();

// Computed para verificar si el estado de inscripción es válido (no datos de prueba)
const hasValidInscriptionStatus = computed(() => {
    if (!props.inscribed?.inscriptions?.[0]?.status) return false;
    const statusValue = props.inscribed.inscriptions[0].status.value.toLowerCase();
    // Evitar mostrar estados que parecen ser de prueba o genéricos
    return !['aprobada', 'test', 'ejemplo', 'prueba'].includes(statusValue);
});

function showDetail() {
    router.push({
        name: 'courses.show', 
        params: { slug: props.course.id }
    });
}
</script>

<style scoped>
.course-card {
    /* La elevación, el radio y el feedback de tap los da el estilo global de
       `ion-card.is-tappable` (theme/global.css): acá solo el layout. */
    margin: 0 0 var(--app-spacing-md);
    overflow: hidden;
}

.enrollment-status {
    margin-bottom: 12px;
}

.uba-indicator {
    margin-bottom: 8px;
}

.uba-indicator ion-chip {
    --background: rgba(255, 193, 7, 0.1);
    --color: var(--ion-color-warning);
    border: 1px solid var(--ion-color-warning);
}

.course-title h3 {
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--app-text-title);
    margin: 0;
    line-height: 1.35;
    letter-spacing: -0.2px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.info-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.info-row ion-icon {
    flex-shrink: 0;
    font-size: 18px;
    margin-top: 2px;
}

.info-row ion-text {
    font-size: 0.875rem;
    line-height: 1.5;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--app-spacing-sm);
    padding-top: 14px;
    border-top: 1px solid var(--app-border);
}

.details-hint {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--ion-color-primary);
}

.details-hint ion-icon {
    font-size: 15px;
}

.status-chip {
    --background: rgba(34, 197, 94, 0.1);
    --color: var(--ion-color-success);
    border: 1px solid var(--ion-color-success);
    font-size: 0.75rem;
    height: 28px;
    margin: 0;
    /* Es una etiqueta de estado, no un control: no debe capturar el tap de la
       card ni mostrar cursor de click. */
    pointer-events: none;
}
</style>