<template>
  <div class="social-share-container">
    <ion-text color="medium" class="share-label">
      <small><strong>Compartir:</strong></small>
    </ion-text>
    <div class="social-buttons">
      <ion-button
        fill="clear"
        size="small"
        @click="shareWhatsApp"
        class="share-btn whatsapp"
      >
        <ion-icon :icon="logoWhatsapp" slot="icon-only"></ion-icon>
      </ion-button>
      <ion-button
        fill="clear"
        size="small"
        @click="shareEmail"
        class="share-btn email"
      >
        <ion-icon :icon="mailOutline" slot="icon-only"></ion-icon>
      </ion-button>
      <ion-button
        fill="clear"
        size="small"
        @click="copyLink"
        class="share-btn copy"
      >
        <ion-icon :icon="copyOutline" slot="icon-only"></ion-icon>
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonText,
  toastController,
  isPlatform,
} from "@ionic/vue";
import { logoWhatsapp, mailOutline, copyOutline } from "ionicons/icons";
import { Share } from "@capacitor/share";
import { useRoute } from "vue-router";
import { whatsappShareUrl } from "@/uses/externalLinks";
import {
  buildShareEmailBody,
  buildShareMessage,
  buildShareUrl,
  type ShareData,
} from "@/utils/shareMessage";

const props = defineProps<{
  shareData: ShareData;
}>();

const route = useRoute();

/**
 * Link público del contenido. Si la vista no pasa `url` ni `path` alcanza con la
 * ruta actual del router (`/taller/2062`), que es la misma en la web y en el
 * shell nativo.
 */
const getShareUrl = (): string => buildShareUrl(props.shareData, route.path);

const shareWhatsApp = async () => {
  const url = getShareUrl();
  const text = buildShareMessage(props.shareData, url);

  // Verificar si estamos en dispositivo móvil con Capacitor
  if (isPlatform("capacitor")) {
    try {
      // Usar API nativa de Capacitor Share. El link ya viene dentro de `text`:
      // pasarlo también en `url` lo duplicaría (Android concatena texto + url).
      await Share.share({
        title: props.shareData.title,
        text: text,
        dialogTitle: "Compartir vía WhatsApp",
      });
    } catch (error) {
      console.error("Error sharing with Capacitor:", error);
      // Fallback: intento con intent de Android
      fallbackWhatsAppShare(text);
    }
  } else {
    // Web (incluye el navegador del celular): wa.me abre la app con el mensaje
    // cargado. Ver whatsappShareUrl(): api.whatsapp.com entregaba solo el link.
    window.open(whatsappShareUrl(text), "_blank");
  }
};

// Función de fallback para casos donde Capacitor Share no funciona
const fallbackWhatsAppShare = (text: string) => {
  const encodedText = encodeURIComponent(text);

  if (isPlatform("android")) {
    // Android: usar intent específico de WhatsApp
    const androidIntent = `intent://send/?text=${encodedText}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
    window.location.href = androidIntent;
  } else if (isPlatform("ios")) {
    // iOS: URL scheme
    const whatsappUrl = `whatsapp://send?text=${encodedText}`;
    window.location.href = whatsappUrl;
  } else {
    // Web fallback
    window.open(whatsappShareUrl(text), "_blank");
  }
};

const shareEmail = () => {
  const subject = encodeURIComponent(
    `Facultad de Derecho - ${props.shareData.title}`
  );
  const body = encodeURIComponent(
    buildShareEmailBody(props.shareData, getShareUrl())
  );

  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoUrl;
};

const copyLink = async () => {
  try {
    const textToCopy = buildShareMessage(props.shareData, getShareUrl());
    await navigator.clipboard.writeText(textToCopy);

    const toast = await toastController.create({
      message: "¡Texto y enlace copiados al portapapeles!",
      duration: 2000,
      position: "bottom",
      color: "success",
      icon: copyOutline,
    });
    await toast.present();
  } catch (error) {
    console.error("Error al copiar:", error);

    const toast = await toastController.create({
      message: "No se pudo copiar el texto",
      duration: 2000,
      position: "bottom",
      color: "danger",
    });
    await toast.present();
  }
};
</script>

<style scoped>
.social-share-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  margin-top: 16px;
  border-top: 1px solid var(--ion-color-light);
}

.share-label {
  font-size: 12px;
  margin-right: 4px;
}

.social-buttons {
  display: flex;
  gap: 4px;
}

.share-btn {
  --padding-start: 8px;
  --padding-end: 8px;
  height: 32px;
  min-width: 32px;
}

.share-btn.whatsapp {
  --color: #25d366;
}

.share-btn.whatsapp:hover {
  --color: #128c7e;
}

.share-btn.email {
  --color: var(--ion-color-primary);
}

.share-btn.copy {
  --color: var(--ion-color-medium);
}

.share-btn ion-icon {
  font-size: 18px;
}

@media (max-width: 768px) {
  .social-share-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .social-buttons {
    align-self: stretch;
    justify-content: center;
  }
}
</style>
