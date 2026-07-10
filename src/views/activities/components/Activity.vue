<template>
    <ion-card 
        class="activity-card" 
        @click="showDetail"
        role="button"
        tabindex="0"
        @keydown.enter="showDetail"
        @keydown.space="showDetail"
        :aria-label="`Taller: ${activity.title}. Docentes: ${activity.teachers || 'Por confirmar'}. Inicio: ${formatDate(activity.start)}`"
    >
        <ion-card-content>
            <!-- Estado de inscripción -->
            <div v-if="inscribed" class="enrollment-status" aria-label="Estado de inscripción">
                <ion-badge 
                    :color="inscribed.inscriptions[0].status.class"
                    :aria-label="`Estado: ${inscribed.inscriptions[0].status.value}`"
                >
                    {{ inscribed.inscriptions[0].status.value }}
                </ion-badge>
            </div>
            
            <!-- Badges de información -->
            <div class="badges-container" role="group" aria-label="Información del taller">
                <ion-badge 
                    v-if="activity.is_only_for_graduado_uba" 
                    class="uba-badge" 
                    color="primary"
                    aria-label="Exclusivo para graduados UBA"
                >
                    <ion-icon :icon="starOutline" slot="start" aria-hidden="true"></ion-icon>
                    Exclusivo UBA
                </ion-badge>
                
                <ion-badge 
                    v-else
                    class="open-badge" 
                    color="success"
                    fill="outline"
                    aria-label="Abierto para todos"
                >
                    <ion-icon :icon="globeOutline" slot="start" aria-hidden="true"></ion-icon>
                    Abierto
                </ion-badge>
                
                <ion-badge 
                    v-if="isStartingSoon(activity)" 
                    class="urgent-badge" 
                    color="warning"
                    aria-label="Taller próximo a iniciar"
                >
                    ¡Próximo a iniciar!
                </ion-badge>
            </div>

            <!-- Título y descripción -->
            <div class="content-section">
                <h3 class="activity-title">{{ activity.title }}</h3>
                <p class="activity-description" v-if="activity.content">
                    {{ getShortDescription(activity.content) }}
                </p>
            </div>

            <!-- Información del taller -->
            <div class="info-grid" role="list" aria-label="Detalles del taller">
                <div class="info-item" role="listitem">
                    <ion-icon :icon="personCircleOutline" color="primary" aria-hidden="true"></ion-icon>
                    <div class="info-content">
                        <span class="info-label">Docentes:</span>
                        <span class="info-value">{{ activity.teachers || 'Por confirmar' }}</span>
                    </div>
                </div>

                <div class="info-item" role="listitem">
                    <ion-icon :icon="calendarOutline" color="primary" aria-hidden="true"></ion-icon>
                    <div class="info-content">
                        <span class="info-label">Inicio:</span>
                        <span class="info-value">{{ formatDate(activity.start) }}</span>
                    </div>
                </div>

                <div class="info-item" v-if="activity.days_and_hours" role="listitem">
                    <ion-icon :icon="timeOutline" color="primary" aria-hidden="true"></ion-icon>
                    <div class="info-content">
                        <span class="info-label">Horario:</span>
                        <span class="info-value">{{ activity.days_and_hours }}</span>
                    </div>
                </div>

                <div class="info-item" v-if="activity.classes_count" role="listitem">
                    <ion-icon :icon="hourglassOutline" color="primary" aria-hidden="true"></ion-icon>
                    <div class="info-content">
                        <span class="info-label">Duración:</span>
                        <span class="info-value">{{ activity.classes_count }} clases</span>
                    </div>
                </div>
            </div>

            <!-- Precio y botón de acción -->
            <div class="footer-section">
                <div class="price-section" v-if="activity.price">
                    <span class="price-label">Costo:</span>
                    <span class="price-value" :class="{ 'free-price': activity.price === 0 }">
                        {{ activity.price === 0 ? 'Gratuito' : `$${activity.price}` }}
                    </span>
                </div>
                
                <ion-button 
                    class="enroll-button" 
                    expand="block" 
                    :color="getEnrollButtonColor(activity)"
                    :fill="getEnrollButtonFill()"
                    @click.stop="handleEnrollClick"
                    :aria-label="`${getEnrollButtonText(activity)} para el taller ${activity.title}`"
                >
                    <ion-icon :icon="schoolOutline" slot="start" aria-hidden="true"></ion-icon>
                    {{ getEnrollButtonText(activity) }}
                </ion-button>
            </div>

            <!-- Indicador especial para graduados UBA -->
            <div v-if="activity.is_only_for_graduado_uba" class="uba-exclusive" role="note" aria-label="Este taller es exclusivo para graduados de la Universidad de Buenos Aires">
                <ion-icon :icon="starOutline" color="primary" aria-hidden="true"></ion-icon>
                <span>Exclusivo para graduados UBA</span>
            </div>
        </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonIcon, IonButton, IonBadge, useIonRouter } from '@ionic/vue';
import { defineProps } from 'vue';
import {
    personCircleOutline,
    calendarOutline,
    starOutline,
    timeOutline,
    hourglassOutline,
    schoolOutline,
    globeOutline
} from 'ionicons/icons';
import { parseApiDate } from '@/libs/dates';

interface ActivityItem {
    id: string | number;
    title?: string;
    content?: string;
    teachers?: string;
    start?: string;
    days_and_hours?: string;
    classes_count?: number;
    price?: number;
    is_only_for_graduado_uba?: boolean;
}

interface InscribedItem {
    inscriptions: Array<{
        status: {
            class: string;
            value: string;
        };
    }>;
}

const props = defineProps<{
    activity: ActivityItem;
    inscribed?: InscribedItem;
}>();

const router = useIonRouter();

function showDetail() {
    router.push({ name: 'activities.show', params: { slug: props.activity.id } });
}

function isStartingSoon(activity: any): boolean {
    const startDate = parseApiDate(activity.start);
    if (!startDate) return false;

    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
}

function getShortDescription(content: string): string {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
}

function formatDate(dateString?: string): string {
    if (!dateString) return 'Por confirmar';

    const date = parseApiDate(dateString);
    if (!date) return 'Fecha por confirmar';

    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getEnrollButtonColor(activity: any): string {
    if (props.inscribed) return 'medium';
    return isStartingSoon(activity) ? 'warning' : 'primary';
}

function getEnrollButtonFill(): 'outline' | 'solid' | 'default' | 'clear' {
    return props.inscribed ? 'outline' : 'solid';
}

function getEnrollButtonText(activity: any): string {
    if (props.inscribed) return 'Ver detalles';
    return isStartingSoon(activity) ? '¡Inscribirse ahora!' : 'Inscribirse';
}

function handleEnrollClick(event: Event) {
    event.stopPropagation();
    showDetail();
}
</script>

<style scoped>
.activity-card {
    margin-bottom: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.activity-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.enrollment-status {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
}

.badges-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}

.modality-badge {
    font-size: 11px;
    font-weight: 600;
}

.category-badge {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.urgent-badge {
    font-size: 10px;
    font-weight: 700;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.content-section {
    margin-bottom: 16px;
}

.activity-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--ion-color-dark);
    margin: 0 0 8px 0;
    line-height: 1.3;
}

.activity-description {
    font-size: 14px;
    color: var(--ion-color-medium);
    line-height: 1.4;
    margin: 0;
}

.info-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.info-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.info-item ion-icon {
    margin-top: 2px;
    font-size: 16px;
}

.info-content {
    display: flex;
    flex-direction: column;
}

.info-label {
    font-size: 12px;
    color: var(--ion-color-medium);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: 14px;
    color: var(--ion-color-dark);
    font-weight: 500;
    margin-top: 2px;
}

.footer-section {
    border-top: 1px solid var(--ion-color-light);
    padding-top: 16px;
    margin-top: 16px;
}

.price-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.price-label {
    font-size: 14px;
    color: var(--ion-color-medium);
    font-weight: 600;
}

.price-value {
    font-size: 16px;
    color: var(--ion-color-primary);
    font-weight: 700;
}

.price-value.free-price {
    color: var(--ion-color-success);
}

.enroll-button {
    --border-radius: 12px;
    --padding-top: 12px;
    --padding-bottom: 12px;
    font-weight: 600;
    font-size: 14px;
    text-transform: none;
}

.uba-exclusive {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    margin-top: 12px;
    padding: 8px;
    background-color: var(--ion-color-primary-tint);
    border-radius: 8px;
    border: 1px solid var(--ion-color-primary);
}

.uba-exclusive span {
    font-size: 12px;
    color: var(--ion-color-primary);
    font-weight: 600;
}

/* Responsive design */
@media (max-width: 768px) {
    .info-grid {
        gap: 10px;
    }
    
    .activity-title {
        font-size: 16px;
    }
    
    .activity-description {
        font-size: 13px;
    }
}

/* Mejoras de accesibilidad */
.activity-card:focus-within {
    outline: 2px solid var(--ion-color-primary);
    outline-offset: 2px;
}

ion-button:focus {
    --box-shadow: 0 0 0 2px var(--ion-color-primary-tint);
}
</style>