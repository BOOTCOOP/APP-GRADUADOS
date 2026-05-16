<template>
  <div class="social-section">
    <ion-text class="section-header">Seguinos</ion-text>
    <div class="social-grid">
      <div class="social-pill facebook" @click="goToFacebook()">
        <ion-icon :md="logoFacebook" :ios="logoFacebook"></ion-icon>
        <span>Facebook</span>
      </div>
      <div class="social-pill twitter" @click="goToTwitter()">
        <font-awesome-icon icon="fa-brands fa-x-twitter" />
        <span>Twitter / X</span>
      </div>
      <div class="social-pill instagram" @click="goToInstagram()">
        <ion-icon :md="logoInstagram" :ios="logoInstagram"></ion-icon>
        <span>Instagram</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { logoFacebook, logoInstagram } from 'ionicons/icons'
import { IonIcon, IonText } from '@ionic/vue'

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
.social-section {
  margin-top: 8px;
  padding-bottom: 80px;
}

.social-grid {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.social-pill {
  flex: 1;
  border-radius: 16px;
  padding: 18px 6px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.social-pill:active {
  transform: scale(0.94);
  opacity: 0.85;
}

.social-pill ion-icon,
.social-pill svg {
  font-size: 28px;
  color: white;
}

.social-pill span {
  font-size: 10px;
  font-weight: 700;
  color: white;
  text-align: center;
  line-height: 1.2;
}

.social-pill.facebook {
  background: #1877F2;
}

.social-pill.twitter {
  background: #111;
}

.social-pill.instagram {
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
}
</style>

.share-button font-awesome-icon {
  font-size: 42px;
}
</style>
