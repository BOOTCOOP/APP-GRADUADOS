<template>
  <ion-card class="bibliography-card">
    <ion-card-content>
      <!-- Encabezado con tema/título -->
      <div class="card-header">
        <ion-text color="dark">
          <h2 class="theme-title">{{ file.theme }}</h2>
        </ion-text>
        <ion-badge color="medium" class="files-count">
          {{ file.files?.length || 0 }} archivo{{ (file.files?.length || 0) !== 1 ? 's' : '' }}
        </ion-badge>
      </div>

      <!-- Lista de archivos mejorada -->
      <div class="files-section ion-margin-top">
        <div 
          v-for="(item, index) in file.files" 
          :key="index"
          class="file-item"
        >
          <div class="file-info">
            <ion-icon
              :icon="getFileIcon(item.extension)"
              :color="getFileIconColor(item.extension)"
              class="file-icon"
            />
            <div class="file-details">
              <ion-text class="file-name">
                {{ formatFileName(item.name) }}
              </ion-text>
              <ion-text color="medium" class="file-type">
                {{ item.extension?.toUpperCase() || 'Archivo' }}
              </ion-text>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de descarga mejorado -->
      <div class="actions-section ion-margin-top">
        <ion-button 
          @click="downloadFiles" 
          fill="clear" 
          size="small"
          :disabled="loading"
          class="download-button"
        >
          <ion-icon 
            :icon="loading ? refreshOutline : downloadOutline" 
            slot="start"
            :class="{ 'rotating': loading }"
          />
          {{ loading ? 'Descargando...' : 'Descargar archivos' }}
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { isPlatform } from "@ionic/vue";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import {
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  IonButton,
  IonBadge,
  toastController,
} from "@ionic/vue";
import { 
  downloadOutline, 
  refreshOutline,
  documentTextOutline,
  imageOutline,
  documentOutline,
  codeSlashOutline
} from "ionicons/icons";

interface BibliographyFile {
  name: string;
  extension: string;
  link: string;
}

interface BibliographyItem {
  theme: string;
  files: BibliographyFile[];
}

const props = defineProps<{
  file: BibliographyItem;
}>();

const loading = ref(false);

// Función para obtener el icono según la extensión del archivo
const getFileIcon = (extension: string) => {
  if (!extension) return documentOutline;
  
  const ext = extension.toLowerCase();
  switch (ext) {
    case 'pdf':
      return documentTextOutline;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
      return imageOutline;
    case 'doc':
    case 'docx':
      return documentOutline;
    case 'html':
    case 'htm':
    case 'css':
    case 'js':
    case 'ts':
      return codeSlashOutline;
    default:
      return documentOutline;
  }
};

// Función para obtener el color del icono según la extensión
const getFileIconColor = (extension: string) => {
  if (!extension) return 'medium';
  
  const ext = extension.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'danger';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'webp':
      return 'success';
    case 'doc':
    case 'docx':
      return 'primary';
    case 'html':
    case 'htm':
    case 'css':
    case 'js':
    case 'ts':
      return 'warning';
    default:
      return 'medium';
  }
};

// Función para formatear el nombre del archivo
const formatFileName = (fileName: string) => {
  if (!fileName) return 'Archivo sin nombre';
  
  // Si el nombre es muy largo (más de 40 caracteres), lo truncamos
  if (fileName.length > 40) {
    return fileName.substring(0, 37) + '...';
  }
  
  // Remover la extensión del nombre para mostrar solo el nombre base
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  return nameWithoutExtension;
};

const downloadFiles = async () => {
  if (!props.file.files?.length) return;

  loading.value = true;

  try {
    for (const file of props.file.files) {
      if (!file.link) continue;

      if (isPlatform("capacitor")) {
        // Solución universal para iOS/Android
        const downloadResult = await Filesystem.downloadFile({
          url: file.link,
          path: file.name,
          directory: Directory.Documents,
          progress: true,
        });

        // Opcional: Abrir el archivo después de descargar (iOS necesita esto)
        if (isPlatform("ios")) {
          try {
            await Share.share({
              title: "Abrir archivo",
              url: downloadResult.path,
              dialogTitle: "Abrir con...",
            });
          } catch (shareError) {
            // Usuario canceló la apertura - silencioso para producción
          }
        }

        showToast(`📁 "${file.name}" listo`);
      } else {
        // Código web igual
        const a = document.createElement("a");
        a.href = file.link;
        a.download = file.name;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  } catch (err) {
    // Error silencioso para producción
    showToast("❌ Error al descargar");
  } finally {
    loading.value = false;
  }
};

const showToast = async (message: string) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color: "success",
  });
  await toast.present();
};
</script>
<style scoped>
.bibliography-card {
  margin: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.theme-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  color: var(--ion-color-dark);
}

.files-count {
  font-size: 0.75rem;
  border-radius: 12px;
  padding: 4px 8px;
}

.files-section {
  background: var(--ion-color-light);
  border-radius: 8px;
  padding: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.file-item:not(:last-child) {
  border-bottom: 1px solid var(--ion-color-step-100);
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.file-icon {
  font-size: 1.5rem;
  margin-right: 12px;
  min-width: 24px;
}

.file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--ion-color-dark);
  margin-bottom: 2px;
}

.file-type {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.actions-section {
  display: flex;
  justify-content: center;
  padding-top: 8px;
  border-top: 1px solid var(--ion-color-step-100);
}

.download-button {
  --color: var(--ion-color-primary);
  font-weight: 500;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .bibliography-card {
    margin: 8px;
  }
  
  .theme-title {
    font-size: 1rem;
  }
  
  .file-name {
    font-size: 0.85rem;
  }
}
</style>
