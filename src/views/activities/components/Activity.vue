<template>
    <ion-card
        class="activity-card is-tappable"
        @click="showDetail"
        role="button"
        tabindex="0"
        @keydown.enter="showDetail"
        @keydown.space="showDetail"
        :aria-label="`Taller: ${activity.title}. ${activity.modality ? 'Modalidad: ' + activity.modality + '. ' : ''}${teachersText}. Inicio: ${formatDate(activity.start)}`"
    >
        <ion-card-content>
            <!-- Etiquetas: modalidad, estado de inscripción y disponibilidad -->
            <div class="activity-tags" role="group" aria-label="Información del taller">
                <span
                    v-if="activity.modality"
                    class="tag"
                    :class="`tag--${modalityKind}`"
                    :aria-label="`Modalidad: ${activity.modality}`"
                >
                    <ion-icon :icon="modalityIcon" aria-hidden="true"></ion-icon>
                    {{ activity.modality }}
                </span>

                <span
                    v-if="inscriptionStatus"
                    class="tag tag--enrolled"
                    :aria-label="`Estado: ${inscriptionStatus.value}`"
                >
                    <ion-icon :icon="checkmarkCircleOutline" aria-hidden="true"></ion-icon>
                    {{ inscriptionStatus.value }}
                </span>

                <span
                    v-if="unavailableLabel"
                    class="tag tag--muted"
                    :aria-label="`Taller no disponible: ${unavailableLabel}`"
                >
                    {{ unavailableLabel }}
                </span>

                <span
                    v-else-if="isStartingSoon"
                    class="tag tag--soon"
                    aria-label="Taller próximo a iniciar"
                >
                    <ion-icon :icon="flashOutline" aria-hidden="true"></ion-icon>
                    ¡Próximo a iniciar!
                </span>

                <span
                    v-if="activity.is_only_for_graduado_uba"
                    class="tag tag--uba"
                    aria-label="Exclusivo para graduados UBA"
                >
                    <ion-icon :icon="starOutline" aria-hidden="true"></ion-icon>
                    Exclusivo UBA
                </span>
            </div>

            <h3 class="activity-title">{{ activity.title }}</h3>

            <ul class="activity-meta" aria-label="Detalles del taller">
                <li>
                    <ion-icon :icon="personCircleOutline" aria-hidden="true"></ion-icon>
                    <span>{{ teachersText }}</span>
                </li>
                <li>
                    <ion-icon :icon="calendarOutline" aria-hidden="true"></ion-icon>
                    <span>
                        {{ formatDate(activity.start) }}
                        <em v-if="activity.beginning && !activity.is_ended">· {{ activity.beginning }}</em>
                    </span>
                </li>
            </ul>

            <ion-button
                class="enroll-button"
                expand="block"
                shape="round"
                :color="buttonColor"
                :fill="buttonFill"
                @click.stop="showDetail"
                :aria-label="`${buttonText} para el taller ${activity.title}`"
            >
                <ion-icon :icon="schoolOutline" slot="start" aria-hidden="true"></ion-icon>
                {{ buttonText }}
            </ion-button>
        </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonIcon, IonButton, useIonRouter } from '@ionic/vue';
import { computed, defineProps } from 'vue';
import {
    personCircleOutline,
    calendarOutline,
    starOutline,
    schoolOutline,
    flashOutline,
    checkmarkCircleOutline,
} from 'ionicons/icons';
import { parseApiDate } from '@/libs/dates';
import {
    modalityKind as resolveModalityKind,
    modalityIcon as resolveModalityIcon,
} from '@/utils/modality';
import { teachersLabel } from '@/utils/teachers';

interface ActivityItem {
    id: string | number;
    title?: string;
    teachers?: string;
    teachers_count?: number;
    start?: string;
    beginning?: string;
    modality?: string;
    is_only_for_graduado_uba?: boolean;
    // Flags de disponibilidad (mismos que el detalle, ahora también en el listado)
    is_enrolled?: boolean;
    is_ended?: boolean;
    is_full?: boolean;
    registration_closed?: boolean;
    can_enroll?: boolean;
}

interface InscribedItem {
    inscriptions?: Array<{
        status?: {
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

// workshops/own puede devolver la inscripción recién creada sin status poblado:
// el badge solo se muestra si el estado realmente vino.
const inscriptionStatus = computed(() => props.inscribed?.inscriptions?.[0]?.status ?? null);

const modalityKind = computed(() => resolveModalityKind(props.activity.modality));
const modalityIcon = computed(() => resolveModalityIcon(modalityKind.value));

// "Expone: Juan Pérez" / "Exponen: Juan Pérez, María Gómez" (antes: "Docentes").
const teachersText = computed(() => {
    const label = teachersLabel(props.activity.teachers_count, props.activity.teachers);

    return `${label}: ${props.activity.teachers || 'a confirmar'}`;
});

// Motivo por el que ya no se puede inscribir (null = disponible). Si el usuario
// está inscripto, el estado de inscripción manda y no mostramos este badge.
const unavailableLabel = computed(() => {
    if (props.inscribed || props.activity.is_enrolled) return null;
    if (props.activity.is_ended) return 'Finalizado';
    if (props.activity.is_full) return 'Sin cupos';
    if (props.activity.registration_closed) return 'Inscripciones cerradas';
    return null;
});

const isStartingSoon = computed(() => {
    const startDate = parseApiDate(props.activity.start);
    if (!startDate) return false;

    const diffDays = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
});

const isClosed = computed(() => Boolean(props.inscribed || unavailableLabel.value));

const buttonColor = computed(() => {
    if (isClosed.value) return 'medium';
    return isStartingSoon.value ? 'warning' : 'primary';
});

const buttonFill = computed<'outline' | 'solid'>(() => (isClosed.value ? 'outline' : 'solid'));

const buttonText = computed(() => {
    if (isClosed.value) return 'Ver detalles';
    return isStartingSoon.value ? '¡Inscribirse ahora!' : 'Inscribirse';
});

function showDetail() {
    router.push({ name: 'activities.show', params: { slug: props.activity.id } });
}

function formatDate(dateString?: string): string {
    if (!dateString) return 'Fecha por confirmar';

    const date = parseApiDate(dateString);
    if (!date) return 'Fecha por confirmar';

    return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
</script>

<style scoped>
/* El hover/apretado de la card lo aporta `.is-tappable` en global.css */
.activity-card {
    margin: 0 0 var(--app-spacing-md);
}

.activity-card ion-card-content {
    padding: var(--app-spacing-lg);
}

.activity-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--app-spacing-sm);
    margin-bottom: var(--app-spacing-md);
}

.tag {
    display: inline-flex;
    align-items: center;
    gap: var(--app-spacing-xs);
    padding: 5px 10px;
    border-radius: var(--app-radius-pill);
    font-size: 12px;
    font-weight: 600;
    line-height: 1.2;
    /* Default = virtual: mismo tratamiento que el detalle */
    background: var(--app-primary-soft);
    color: var(--ion-color-primary-shade);
}

.tag ion-icon {
    font-size: 14px;
}

.tag--presencial {
    background: rgba(45, 211, 111, 0.14);
    color: var(--ion-color-success-shade);
}

.tag--hibrida {
    background: rgba(255, 196, 9, 0.18);
    color: #8a6100;
}

.tag--enrolled {
    background: rgba(45, 211, 111, 0.16);
    color: var(--ion-color-success-shade);
}

.tag--soon {
    background: rgba(255, 196, 9, 0.2);
    color: #8a6100;
}

.tag--uba {
    background: var(--app-primary-soft-strong);
    color: var(--ion-color-primary-shade);
}

.tag--muted {
    background: var(--app-bg);
    color: var(--app-text-secondary);
}

.activity-title {
    margin: 0 0 var(--app-spacing-md);
    font-size: 17px;
    font-weight: 700;
    line-height: 1.3;
    color: var(--app-text-title);
}

.activity-meta {
    list-style: none;
    margin: 0 0 var(--app-spacing-lg);
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--app-spacing-sm);
}

.activity-meta li {
    display: flex;
    align-items: center;
    gap: var(--app-spacing-sm);
    font-size: 14px;
    color: var(--app-text-body);
}

.activity-meta ion-icon {
    flex-shrink: 0;
    font-size: 18px;
    color: var(--ion-color-primary);
}

.activity-meta em {
    font-style: normal;
    color: var(--app-text-secondary);
}

.enroll-button {
    margin: 0;
    min-height: var(--app-tap-target);
    font-weight: 600;
    font-size: 14px;
    text-transform: none;
}
</style>
