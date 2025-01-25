<template>
  <graduados-app :hideFabButton="true">
      <template #header-end>
        <ion-menu-button menu="notification-content" color="primary">
          <ion-icon :md="notificationsOutline" :ios="notificationsOutline"></ion-icon>
        </ion-menu-button>
      </template>

      <Banner/>
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
        IonIcon
    } from '@ionic/vue';

    import Banner from "./Banner.vue";
    import Shortcuts from "./Shortcuts.vue";
    import Links from "./Links.vue";
    import Social from "./Social.vue";
</script>

<style scoped>
  ion-menu-button.ios ion-icon{
    font-size: 24px
  }
</style>