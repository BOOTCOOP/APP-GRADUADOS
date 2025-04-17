<template>
  <ion-card>
    <ion-card-content>
      <ion-text>
        <strong>{{ file.theme }}</strong>
      </ion-text>

      <div class="options ion-margin-top">
        <div class="info">
          <div
            v-for="(item, index) in file.files"
            :key="item.id || index"
            class="file-item"
          >
            <ion-icon
              :md="documentTextOutline"
              :ios="documentTextOutline"
              color="medium"
            />
            <ion-text color="medium">
              {{ item.name }}
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
import { IonCard, IonCardContent, IonText, IonIcon } from "@ionic/vue";
import { documentTextOutline, downloadOutline } from "ionicons/icons";

const props = defineProps({
  file: { required: true },
});

const downloadFiles = () => {
  if (!props.file.files?.length) {
    console.error("⚠️ No hay archivos para descargar");
    return;
  }

  props.file.files.forEach((file) => {
    if (!file.src) {
      console.error(`⚠️ El archivo ${file.name} no tiene una URL de descarga`);
      return;
    }

    const a = document.createElement("a");
    a.href = file.src;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  console.log("✅ Todos los archivos han sido abiertos en nuevas pestañas.");
};
</script>

<style scoped>
.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.info {
  flex-grow: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.file-item {
  display: flex;
  align-items: center;
  color: var(--ion-color-medium);
  font-size: 12px;
  margin-right: 10px;
}

.file-item ion-text {
  margin-left: 4px;
}
</style>
