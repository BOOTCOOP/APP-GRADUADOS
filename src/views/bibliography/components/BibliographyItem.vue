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

      <!--
        Cada archivo se puede descargar por separado. Antes las filas eran texto
        muerto y la única opción era "Descargar archivos", que bajaba TODOS de
        una: para un solo PDF de una lista de seis no había forma de pedir ese.
      -->
      <div class="files-section ion-margin-top">
        <button
          v-for="(item, index) in file.files"
          :key="index"
          type="button"
          class="file-item"
          :disabled="loading"
          :aria-label="`Descargar ${item.name}`"
          @click="downloadFile(item)"
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
              <ion-text class="file-type">
                {{ item.extension?.toUpperCase() || 'Archivo' }}
              </ion-text>
            </div>
          </div>
          <ion-icon :icon="downloadOutline" class="file-download-icon" aria-hidden="true" />
        </button>
      </div>

      <!-- Descargar todo: solo tiene sentido si hay más de un archivo -->
      <div v-if="(file.files?.length || 0) > 1" class="actions-section ion-margin-top">
        <ion-button
          @click="downloadFiles"
          fill="clear"
          :disabled="loading"
          class="download-button"
        >
          <ion-icon
            :icon="loading ? refreshOutline : downloadOutline"
            slot="start"
            :class="{ 'rotating': loading }"
          />
          {{ loading ? 'Descargando…' : 'Descargar todos' }}
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

/** Descarga un archivo. Extraído del loop para poder pedir uno solo. */
const fetchOne = async (file: any) => {
  if (!file?.link) return;

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

    showToast(`"${file.name}" listo`);
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
};

/** Un archivo puntual (tap en su fila). */
const downloadFile = async (file: any) => {
  if (loading.value) return;

  loading.value = true;

  try {
    await fetchOne(file);
  } catch (err) {
    showToast("No se pudo descargar el archivo", "danger");
  } finally {
    loading.value = false;
  }
};

/** Todos los archivos del tema. */
const downloadFiles = async () => {
  if (!props.file.files?.length) return;

  loading.value = true;

  try {
    for (const file of props.file.files) {
      await fetchOne(file);
    }
  } catch (err) {
    // Error silencioso para producción
    showToast("No se pudo descargar el archivo", "danger");
  } finally {
    loading.value = false;
  }
};

const showToast = async (message: string, color = "success") => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    color,
    position: "bottom",
  });
  await toast.present();
};
</script>
<style scoped>
/* Sin margin horizontal: el layout ya aporta los 16px de cada lado. */
.bibliography-card {
  margin: 0 0 var(--app-spacing-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.theme-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  line-height: 1.35;
  color: var(--app-text-title);
  letter-spacing: -0.2px;
}

.files-count {
  font-size: 11px;
  border-radius: var(--app-radius-pill);
  padding: 4px 8px;
  flex-shrink: 0;
}

.files-section {
  background: var(--app-surface-alt);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-sm);
  padding: var(--app-spacing-xs) var(--app-spacing-md);
}

/* Fila = botón de descarga de ese archivo, con los 44px de alto mínimo */
.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-spacing-sm);
  width: 100%;
  appearance: none;
  background: transparent;
  border: none;
  font-family: inherit;
  text-align: left;
  padding: var(--app-spacing-sm) 0;
  min-height: var(--app-tap-target);
  cursor: pointer;
  border-radius: 6px;
  transition: opacity var(--app-duration) var(--app-ease);
  -webkit-tap-highlight-color: transparent;
}

.file-item:active {
  opacity: 0.6;
}

.file-item:disabled {
  cursor: default;
  opacity: 0.5;
}

.file-item:focus-visible {
  outline: 2px solid var(--ion-color-primary);
  outline-offset: 1px;
}

.file-item:not(:last-child) {
  border-bottom: 1px solid var(--app-border);
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 22px;
  margin-right: var(--app-spacing-md);
  min-width: 22px;
}

.file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-title);
  margin-bottom: 1px;
}

.file-type {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--app-text-secondary);
}

.file-download-icon {
  font-size: 18px;
  color: var(--ion-color-primary);
  flex-shrink: 0;
}

.actions-section {
  display: flex;
  justify-content: center;
  padding-top: var(--app-spacing-sm);
  border-top: 1px solid var(--app-border);
}

.download-button {
  --color: var(--ion-color-primary);
  font-weight: 700;
  font-size: 13px;
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
