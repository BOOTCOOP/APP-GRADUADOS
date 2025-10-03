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
  toastController
} from '@ionic/vue'
import { 
  logoWhatsapp, 
  mailOutline, 
  copyOutline 
} from 'ionicons/icons'

interface ShareData {
  title: string
  text?: string
  url?: string
  type?: 'noticia' | 'taller' | 'curso' | 'empleo' | 'actividad'
}

const props = defineProps<{
  shareData: ShareData
}>()

const generateShareText = (): string => {
  const { title, text, type } = props.shareData
  const typeText = type ? getTypeText(type) : ''
  const baseText = `${typeText}${title}`
  
  if (text) {
    // Limitar texto a 100 caracteres para WhatsApp
    const shortText = text.length > 100 ? text.substring(0, 97) + '...' : text
    return `${baseText}\n\n${shortText}`
  }
  
  return baseText
}

const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    'noticia': '📰 Noticia: ',
    'taller': '🎓 Taller: ',
    'curso': '📚 Curso: ',
    'empleo': '💼 Empleo: ',
    'actividad': '🎯 Actividad: '
  }
  return typeMap[type] || '📱 '
}

const getCurrentUrl = (): string => {
  return props.shareData.url || window.location.href
}

const shareWhatsApp = () => {
  const text = encodeURIComponent(generateShareText())
  const url = encodeURIComponent(getCurrentUrl())
  const whatsappUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`
  
  window.open(whatsappUrl, '_blank')
}

const shareEmail = () => {
  const { title, text } = props.shareData
  const subject = encodeURIComponent(`Facultad de Derecho - ${title}`)
  const body = encodeURIComponent(
    `Hola,\n\nTe comparto esta información de la Facultad de Derecho:\n\n${title}\n\n${text || ''}\n\nVer más: ${getCurrentUrl()}\n\n--\nCentro de Graduados - Facultad de Derecho UBA`
  )
  
  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
  window.location.href = mailtoUrl
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(getCurrentUrl())
    
    const toast = await toastController.create({
      message: '¡Link copiado al portapapeles!',
      duration: 2000,
      position: 'bottom',
      color: 'success',
      icon: copyOutline
    })
    await toast.present()
  } catch (error) {
    console.error('Error al copiar link:', error)
    
    const toast = await toastController.create({
      message: 'No se pudo copiar el link',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    })
    await toast.present()
  }
}
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
  --color: #25D366;
}

.share-btn.whatsapp:hover {
  --color: #128C7E;
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