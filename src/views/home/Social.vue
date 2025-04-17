<template>
  <div class="ion-margin-top socials">
    <ion-grid>
      <ion-row>
        <ion-col>
          <ion-card
            @click="goToFacebook()"
            class="ion-no-margin ion-margin-top ion-text-center social"
          >
            <ion-card-content>
              <ion-icon
                :md="logoFacebook"
                size="large"
                :ios="logoFacebook"
              ></ion-icon>
            </ion-card-content>
          </ion-card>
        </ion-col>
        <ion-col>
          <ion-card
            @click="goToTwitter()"
            class="ion-no-margin ion-margin-top ion-text-center social"
          >
            <ion-card-content>
              <font-awesome-icon
                icon="fa-brands fa-x-twitter"
                font-size="36px"
              />
            </ion-card-content>
          </ion-card>
        </ion-col>
        <ion-col>
          <ion-card
            @click="goToInstagram()"
            class="ion-no-margin ion-margin-top ion-text-center social"
          >
            <ion-card-content>
              <ion-icon
                :md="logoInstagram"
                size="large"
                :ios="logoInstagram"
              ></ion-icon>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script setup lang="ts">
import { logoFacebook, logoInstagram } from 'ionicons/icons'

import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
} from '@ionic/vue'

function goToFacebook() {
  window.open('https://www.facebook.com/Centrodegraduadasygraduados', '_system')
}

function goToTwitter() {
  window.open('https://x.com/graduadodchouba?s=21', '_system')
}

function goToInstagram() {
  window.open('https://www.instagram.com/centrodegraduados', '_system')
}
</script>

<style scoped>
ion-card.social {
  background-color: var(--ion-color-step-900);
}

.share-button font-awesome-icon {
  font-size: 42px;
}
</style>
