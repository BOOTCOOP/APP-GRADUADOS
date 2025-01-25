<template>
  <ion-card>
    <ion-card-content @click="() => showDetail(file.src)">
      <ion-text>
        <strong>{{ file.name }}</strong>
      </ion-text>
      <div class="options ion-margin-top">
        <div class="info">
          <div>
            <ion-icon
              :md="documentTextOutline"
              :ios="documentTextOutline"
              color="medium"
            ></ion-icon>
            <ion-text color="medium"> {{ file.extension }}</ion-text>
          </div>
          <div class="ion-margin-start" v-if="file.theme">
            <ion-icon
              :md="schoolOutline"
              :ios="schoolOutline"
              color="medium"
            ></ion-icon>
            <ion-text color="medium"> {{ file.theme }}</ion-text>
          </div>
        </div>
        <ion-icon
          style="font-size: 20px"
          :md="downloadOutline"
          :ios="downloadOutline"
          color="primary"
        ></ion-icon>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { IonCard, IonCardContent, IonText, IonIcon, useIonRouter } from '@ionic/vue';
import { documentTextOutline, schoolOutline, downloadOutline } from 'ionicons/icons';
import { HTTP } from '@ionic/native'

const prop = defineProps({
    file :{required:true}
})

const router = useIonRouter();

function showDetail(url){
  window.open(url, '_system', 'location=yes');
}
</script>

<style scoped>
ion-card .options{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

ion-card .options .info{
  flex-grow:1;
  display: flex;
  align-items: center;
}
ion-card .options .info > div{
  display: flex;
  align-items: center;
  color: var(--ion-color-medium);
  font-size: 12px;
}
ion-card .options .info ion-text{
  margin-left: 2px;
}
</style>