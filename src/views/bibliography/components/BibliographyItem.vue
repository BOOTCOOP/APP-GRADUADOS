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
  </ion-card>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { isPlatform } from "@ionic/vue";
import { Filesystem, Directory } from "@capacitor/filesystem";
import {
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  toastController,
} from "@ionic/vue";
import { documentTextOutline, downloadOutline } from "ionicons/icons";

const props = defineProps({
  file: { required: true },
});

const downloadFiles = async () => {
  if (!props.file.files?.length) {
    console.error("⚠️ No hay archivos para descargar");
    return;
  }

  for (const file of props.file.files) {
    if (!file.link) {
      console.error(`⚠️ El archivo ${file.name} no tiene una URL válida`);
      continue;
    }

    if (isPlatform("capacitor")) {
      // 📱 MODO MOBILE (Android/iOS) - Solución mejorada
      try {
        await Filesystem.downloadFile({
          url: file.link,
          path: file.name,
          directory: Directory.Documents,
        });

        showToast(`📁 "${file.name}" descargado correctamente`);
      } catch (err) {
        console.error("❌ Error al descargar archivo:", err);
        showToast(`❌ Error al descargar "${file.name}"`);
      }
    } else {
      // 💻 MODO WEB
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
