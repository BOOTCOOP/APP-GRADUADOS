<template>
    <ion-card>
        <ion-card-content @click="showDetail">
            <div v-if="inscribed">
              <ion-badge :color="inscribed.inscriptions[0].status.class">{{ inscribed.inscriptions[0].status.value }}</ion-badge>
            </div>
            <ion-text>
              <strong>{{activity.title}}</strong>
            </ion-text>
            <div class="options ion-margin-top">
              <div class="info">
                <div>
                  <ion-icon :md="personCircleOutline" :ios="personCircleOutline" color="medium"></ion-icon>
                  <ion-text color="medium"> {{ activity.teachers }}</ion-text>
                </div>
                <div class="ion-margin-start">
                  <ion-icon :md="calendarOutline" :ios="calendarOutline" color="medium"></ion-icon>
                  <ion-text color="medium"> {{ activity.start }}</ion-text>
                </div>
              </div>
              <ion-icon v-if="activity.is_only_for_graduado_uba" style="font-size:20px" :md="starOutline" :ios="starOutline" color="primary"></ion-icon>
            </div>
          </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonIcon, IonText, useIonRouter, IonBadge } from '@ionic/vue';

import { defineProps } from 'vue';
import { personCircleOutline, calendarOutline, starOutline } from 'ionicons/icons';

const prop = defineProps({
    activity:{required:true},
    inscribed:{}
})

const router = useIonRouter();

function showDetail(){
    router.push({name:'activities.show', params: {slug: prop.activity.id}})
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