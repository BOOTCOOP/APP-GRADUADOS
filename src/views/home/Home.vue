<template>
  <graduados-app :hideFabButton="true">
      <template #header>
        <ion-header class="ion-no-border">
          <ion-toolbar class="home-toolbar">
            <ion-buttons slot="start">
              <ion-menu-button menu="main-menu" color="light"></ion-menu-button>
            </ion-buttons>
            <ion-title class="home-toolbar-title">Centro de Graduados</ion-title>
            <ion-buttons slot="end">
              <ion-menu-button menu="notification-content" color="light">
                <ion-icon :md="notificationsOutline" :ios="notificationsOutline"></ion-icon>
              </ion-menu-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
      </template>

      <Banner/>
      <ion-text class="section-header">Accesos rápidos</ion-text>
      <Shortcuts/>
      <Links/>
      <Social/>

  </graduados-app>
</template>

<script setup lang="ts">
    import {
        notificationsOutline
    } from 'ionicons/icons';

    import {
        IonMenuButton,
        IonIcon,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonText,
    } from '@ionic/vue';

    import Banner from "./Banner.vue";
    import Shortcuts from "./Shortcuts.vue";
    import Links from "./Links.vue";
    import Social from "./Social.vue";
</script>

<style scoped>
  .home-toolbar {
    --background: linear-gradient(135deg, #AB49CC 0%, #7A35AB 100%);
    --color: white;
    --border-color: transparent;
  }

  .home-toolbar-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.2px;
  }

  ion-menu-button.ios ion-icon {
    font-size: 24px;
  }
</style>