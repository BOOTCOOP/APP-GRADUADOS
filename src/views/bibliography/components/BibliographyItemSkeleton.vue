<template>
  <ion-list>
    <ion-card v-for="i in [1, 2, 3, 4, 5, 6]" :key="i">
      <ion-card-content>
        <ion-label>
          <ion-skeleton-text
            :animated="true"
            style="width: 100%; height: 16px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            :animated="true"
            :style="'width: ' + (50 + i * 5) + '%; height: 12px'"
            class="ion-margin-top"
          ></ion-skeleton-text>

          <div class="options ion-margin-top">
            <div class="info">
              <ion-skeleton-text
                :animated="true"
                style="width: 14px; height: 14px"
              ></ion-skeleton-text>
              <ion-skeleton-text
                class="ion-margin-start"
                :animated="true"
                style="width: 30%; height: 12px"
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
  IonList,
  IonCard,
  IonCardContent,
  IonLabel,
  IonSkeletonText,
} from "@ionic/vue";
</script>

<style scoped>
.options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
</style>
