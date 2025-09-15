<template>
    <ion-card class="course-card">
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
            <div class="course-header" @click="showDetail">
                <ion-text class="course-title">
                    <h3>{{ course.title }}</h3>
                </ion-text>
            </div>

            <!-- Información del curso -->
            <div class="course-info ion-margin-top" @click="showDetail">
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

            <!-- Botones de acción -->
            <div class="action-buttons ion-margin-top">
                <ion-button 
                    fill="clear" 
                    size="small" 
                    @click="showDetail"
                    class="details-button"
                >
                    Ver detalles
                    <ion-icon :icon="chevronForwardOutline" slot="end"></ion-icon>
                </ion-button>
                
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
    IonButton,
    IonBadge,
    IonChip,
    IonLabel,
    useIonRouter
} from '@ionic/vue';

import { defineProps, computed } from 'vue';
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
    margin: 0;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
}

.course-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
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

.course-header {
    cursor: pointer;
}

.course-title h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--ion-color-dark);
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.course-info {
    cursor: pointer;
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

.action-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding-top: 16px;
    border-top: 1px solid var(--ion-color-light);
}

.details-button {
    --color: var(--ion-color-medium);
    --color-hover: var(--ion-color-primary);
    font-size: 0.875rem;
    flex-grow: 1;
    justify-content: space-between;
}

.status-chip {
    --background: rgba(34, 197, 94, 0.1);
    --color: var(--ion-color-success);
    border: 1px solid var(--ion-color-success);
    font-size: 0.75rem;
    height: 28px;
}

/* Responsive design */
@media (max-width: 480px) {
    .course-title h3 {
        font-size: 1.125rem;
    }
    
    .action-buttons {
        flex-direction: column;
        gap: 12px;
    }
    
    .enroll-button,
    .enrolled-button {
        width: 100%;
    }
}

/* Animations */
.course-card ion-badge {
    animation: fadeIn 0.3s ease;
}

.action-buttons ion-button {
    transition: all 0.2s ease;
}

.action-buttons ion-button:hover {
    transform: scale(1.05);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>