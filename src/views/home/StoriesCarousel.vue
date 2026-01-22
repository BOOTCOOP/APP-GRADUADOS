<template>
  <!-- Carrusel de Novedades/Anuncios tipo Instagram Stories -->
  <div
    class="announcements-carousel ion-margin-vertical"
    v-if="announcements.length > 0"
  >
    <swiper
      :slides-per-view="'auto'"
      :space-between="12"
      :pagination="{ clickable: true }"
      class="announcements-swiper"
    >
      <swiper-slide
        v-for="announcement in announcements"
        :key="announcement.id"
        class="announcement-slide"
      >
        <div
          class="announcement-card"
          :style="{ background: announcement.gradient }"
          @click="openAnnouncement(announcement)"
        >
          <div class="announcement-icon">
            <ion-icon :icon="announcement.icon"></ion-icon>
          </div>
          <div class="announcement-content">
            <h3>{{ announcement.title }}</h3>
            <p>{{ announcement.subtitle }}</p>
          </div>
          <div class="announcement-badge" v-if="announcement.badge">
            {{ announcement.badge }}
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>

  <!-- Modal con el detalle del anuncio -->
  <ion-modal :is-open="modalOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ selectedAnnouncement?.title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div v-if="selectedAnnouncement" class="announcement-detail">
        <div
          class="detail-icon"
          :style="{ background: selectedAnnouncement.gradient }"
        >
          <ion-icon :icon="selectedAnnouncement.icon"></ion-icon>
        </div>

        <h2>{{ selectedAnnouncement.title }}</h2>
        <p class="detail-description">{{ selectedAnnouncement.description }}</p>

        <div class="detail-info" v-if="selectedAnnouncement.date">
          <ion-icon :icon="calendarOutline"></ion-icon>
          <span>{{ selectedAnnouncement.date }}</span>
        </div>

        <ion-button
          expand="block"
          color="primary"
          class="ion-margin-top"
          @click="handleAction(selectedAnnouncement)"
        >
          {{ selectedAnnouncement.actionText || "Ver más" }}
        </ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
} from "@ionic/vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { ref } from "vue";
import {
  documentTextOutline,
  megaphoneOutline,
  calendarOutline,
  closeOutline,
  sparklesOutline,
} from "ionicons/icons";
import { useRouter } from "vue-router";

import "swiper/css";
import "@ionic/vue/css/ionic-swiper.css";

interface Announcement {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  badge?: string;
  date?: string;
  actionText?: string;
  action?: string;
}

const router = useRouter();
const modalOpen = ref(false);
const selectedAnnouncement = ref<Announcement | null>(null);

// Aquí el cliente puede agregar/editar los anuncios que quiera mostrar
const announcements = ref<Announcement[]>([
  {
    id: 1,
    title: "¡Masterclass de IA!",
    subtitle: "Aplicada al derecho - Esta semana",
    description:
      "Te invitamos a participar de nuestra próxima masterclass sobre Inteligencia Artificial aplicada al derecho. Aprende las últimas herramientas y tendencias en tecnología legal.",
    date: "Viernes 24 de Enero - 18:00hs",
    icon: sparklesOutline,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    badge: "NUEVO",
    actionText: "Inscribirme ahora",
    action: "courses.index",
  },
  {
    id: 2,
    title: "Certificado Digital",
    subtitle: "Tramite online disponible",
    description:
      "Ya podés solicitar tu certificado de alumno regular de forma completamente digital. El trámite es rápido y lo recibís por email en 48hs.",
    icon: documentTextOutline,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    actionText: "Solicitar certificado",
    action: "home",
  },
  {
    id: 3,
    title: "Últimos días",
    subtitle: "Inscripción curso de Mediación",
    description:
      "Quedan pocos cupos disponibles para el curso de Mediación y Resolución de Conflictos. ¡No te quedes afuera!",
    date: "Cierra: 30 de Enero",
    icon: megaphoneOutline,
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    badge: "URGENTE",
    actionText: "Ver curso",
    action: "courses.index",
  },
]);

function openAnnouncement(announcement: Announcement) {
  selectedAnnouncement.value = announcement;
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  setTimeout(() => {
    selectedAnnouncement.value = null;
  }, 300);
}

function handleAction(announcement: Announcement) {
  closeModal();

  if (announcement.action) {
    router.push({ name: announcement.action });
  }
}
</script>

<style scoped>
.announcements-carousel {
  padding: 0 16px;
}

.announcements-swiper {
  padding: 8px 0 32px 0;
}

.announcement-slide {
  width: 280px;
}

.announcement-card {
  position: relative;
  border-radius: 16px;
  padding: 20px;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.announcement-card:active {
  transform: scale(0.98);
}

.announcement-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.announcement-icon ion-icon {
  font-size: 24px;
  color: white;
}

.announcement-content {
  flex: 1;
}

.announcement-content h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
}

.announcement-content p {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.announcement-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Modal de detalle */
.announcement-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.detail-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.detail-icon ion-icon {
  font-size: 40px;
  color: white;
}

.announcement-detail h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: var(--ion-color-dark);
}

.detail-description {
  font-size: 15px;
  line-height: 1.6;
  color: var(--ion-color-medium);
  margin-bottom: 20px;
}

.detail-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--ion-color-light);
  border-radius: 12px;
  margin-bottom: 8px;
}

.detail-info ion-icon {
  font-size: 20px;
  color: var(--ion-color-primary);
}

.detail-info span {
  font-size: 14px;
  font-weight: 500;
  color: var(--ion-color-dark);
}
</style>
