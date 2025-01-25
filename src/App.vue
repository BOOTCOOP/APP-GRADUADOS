<template>
  <ion-app>
    <Menu v-if="userLogued"></Menu>
    <Notifications v-if="userLogued"></Notifications>

    <ion-router-outlet :key="$route.fullPath" id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script setup lang="ts">
  import { IonApp, IonRouterOutlet } from '@ionic/vue';
  import Menu from "@/views/components/Menu.vue";
  import Notifications from "@/views/components/Notifications.vue";

  const userLogued = true;
</script>