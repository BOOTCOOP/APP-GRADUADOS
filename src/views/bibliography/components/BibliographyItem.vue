<template>
  <ion-card>
    <ion-card-content>
      <ion-text>
        <strong>{{ file.theme }}</strong>
      </ion-text>
      <div class="options ion-margin-top">
        <div class="info">
          <div v-for="(item, index) in file.files" :key="index">
            <ion-icon
              :md="documentTextOutline"
              :ios="documentTextOutline"
              color="medium"
            />
            <ion-text color="medium">
              {{ item.name }} ({{ item.extension }})
            </ion-text>
          </div>
        </div>
        <ion-icon
          style="font-size: 20px; cursor: pointer"
          :md="downloadOutline"
          :ios="downloadOutline"
          color="primary"
          @click="downloadFiles"
        />
      </div>
    </ion-card-content>

    <!-- Spinner de carga -->
    <ion-loading
      :is-open="loading"
      message="Descargando archivos..."
      spinner="circles"
    ></ion-loading>
  </ion-card>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { isPlatform } from "@ionic/vue";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import {
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  toastController,
  IonLoading,
} from "@ionic/vue";
import { documentTextOutline, downloadOutline } from "ionicons/icons";

const props = defineProps({
  file: { required: true },
});

const loading = ref(false);

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
            console.log("El usuario canceló la apertura");
          }
        }

        showToast(`📁 "${file.name}" listo`);
      } else {
        // Código web igual
        const a = document.createElement("a");
        a.href = file.link;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  } catch (err) {
    console.error("Error:", err);
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
/* Tus estilos existentes se mantienen igual */
.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info {
  flex-grow: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.info > div {
  display: flex;
  align-items: center;
  color: var(--ion-color-medium);
  font-size: 12px;
  margin-right: 10px;
}

ion-text {
  margin-left: 4px;
}
</style>
