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
            ></ion-icon>
            <ion-text color="medium">
              {{ item.name }} ({{ item.extension }})</ion-text
            >
          </div>
        </div>
        <ion-icon
          style="font-size: 20px; cursor: pointer"
          :md="downloadOutline"
          :ios="downloadOutline"
          color="primary"
          @click="downloadFiles"
        ></ion-icon>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonIcon, IonText } from "@ionic/vue";
import { documentTextOutline, downloadOutline } from "ionicons/icons";
import { defineProps } from "vue";

const props = defineProps({
  file: { required: true },
});

const downloadFiles = () => {
  if (!props.file.files || props.file.files.length === 0) {
    console.error("No hay archivos para descargar");
    return;
  }

  props.file.files.forEach((file) => {
    if (!file.link) {
      console.error(`El archivo ${file.name} no tiene un enlace de descarga`);
      return;
    }

    const a = document.createElement("a");
    a.href = file.link;
    a.target = "_blank"; // ✅ Abre cada archivo en una nueva pestaña
    a.rel = "noopener noreferrer"; // ✅ Seguridad extra
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  console.log("✅ Todos los archivos han sido abiertos en nuevas pestañas.");
};
</script>

<style scoped>
ion-card .options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

ion-card .options .info {
  flex-grow: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
ion-card .options .info > div {
  display: flex;
  align-items: center;
  color: var(--ion-color-medium);
  font-size: 12px;
  margin-right: 10px;
}
ion-card .options .info ion-text {
  margin-left: 2px;
}
</style>
