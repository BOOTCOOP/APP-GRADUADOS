<template>
  <graduados-app header-title="Contacto" :header-show-back-button="true">
    <div class="contacto-container">
      <!-- Enlaces de interés -->
      <div class="ion-margin-top links">
        <ion-text color="primary" class="section-title">
          <h2>Enlaces de interés</h2>
        </ion-text>

        <ion-card @click="goToWhatsapp" class="ion-no-margin ion-margin-top link-whatsapp">
          <ion-card-content>
            <div class="link-content">
              <ion-text color="dark">Atención y consultas</ion-text>
              <ion-icon :md="logoWhatsapp" size="large" :ios="logoWhatsapp" color="medium"></ion-icon>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card @click="goToYoutube" class="ion-no-margin ion-margin-top link-youtube">
          <ion-card-content>
            <div class="link-content">
              <ion-text color="dark">Canal de Youtube</ion-text>
              <ion-icon :md="logoYoutube" size="large" :ios="logoYoutube" color="medium"></ion-icon>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Redes sociales -->
      <div class="ion-margin-top socials">
        <ion-text color="primary" class="section-title">
          <h2>Síguenos en redes sociales</h2>
        </ion-text>
        
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
    </div>
  </graduados-app>
</template>

<script setup lang="ts">
import { 
  logoWhatsapp, 
  logoYoutube, 
  logoFacebook, 
  logoInstagram 
} from 'ionicons/icons';

import {
  IonCard, 
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon, 
  IonRow,
  IonText
} from '@ionic/vue';

// Funciones para WhatsApp y YouTube
function goToWhatsapp() {
  window.open('https://web.whatsapp.com/send?phone=541138315897', '_system');
}

function goToYoutube() {
  window.open('https://www.youtube.com/playlist?list=PL9y1i2ILzxlDxl8KFJHJrG294F2ert4Qy', '_system');
}

// Funciones para redes sociales
function goToFacebook() {
  window.open('https://www.facebook.com/Centrodegraduadasygraduados', '_system');
}

function goToTwitter() {
  window.open('https://x.com/graduadodchouba?s=21', '_system');
}

function goToInstagram() {
  window.open('https://www.instagram.com/centrodegraduados', '_system');
}
</script>

<style scoped>
.contacto-container {
  padding: 16px;
}

.section-title {
  display: block;
  font-weight: 600;
  margin-bottom: 16px;
}

.section-title h2 {
  margin: 0;
  font-size: 1.2rem;
}

/* Estilos para Enlaces de interés */
.links ion-card {
  background-color: var(--ion-color-light);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.links ion-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.links ion-card-content {
  position: relative;
  padding: 16px;
}

.link-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.link-content ion-text {
  font-weight: 500;
  font-size: 1rem;
}

.links ion-card-content:after {
  content: "";
  display: block;
  height: 100%;
  width: 6px;
  position: absolute;
  right: 0px;
  top: 0;
  border-radius: 0 12px 12px 0;
}

.links .link-whatsapp ion-card-content::after {
  background-color: #25D366;
}

.links .link-youtube ion-card-content::after {
  background-color: #FF0000;
}

/* Estilos para Redes sociales */
ion-card.social {
  background-color: var(--ion-color-light);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

ion-card.social:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

ion-card.social ion-card-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

ion-card.social ion-icon {
  color: var(--ion-color-medium);
}

.share-button font-awesome-icon {
  font-size: 42px;
  color: var(--ion-color-medium);
}
</style>