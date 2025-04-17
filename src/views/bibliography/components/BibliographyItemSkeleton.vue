<template>
  <ion-list>
    <ion-card v-for="i in [1, 2, 3, 4, 5, 6]" :key="i">
      <ion-card-content>
        <ion-label>
          <ion-skeleton-text
            :animated="true"
            style="width: 100%"
          ></ion-skeleton-text>
          <ion-skeleton-text
            :animated="true"
            :style="'width: ' + 10 * i + '%'"
          ></ion-skeleton-text>

          <div class="options ion-margin-top">
            <div class="info">
              <ion-skeleton-text
                :animated="true"
                style="width: 10px"
              ></ion-skeleton-text>
              <ion-skeleton-text
                class="ion-margin-start"
                :animated="true"
                style="width: 20%"
              ></ion-skeleton-text>
            </div>

            <ion-skeleton-text
              :animated="true"
              style="width: 20px; height: 20px"
            ></ion-skeleton-text>
          </div>
        </ion-label>
      </ion-card-content>
    </ion-card>
  </ion-list>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonLabel,
  IonList,
  IonSkeletonText,
} from '@ionic/vue'
</script>
