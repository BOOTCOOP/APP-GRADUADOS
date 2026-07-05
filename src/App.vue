<template>
  <ion-app>
    <Menu v-if="userLogued"></Menu>
    <Notifications v-if="userLogued"></Notifications>

    <ion-router-outlet :key="$route.fullPath" id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script setup lang="ts">
  import { IonApp, IonRouterOutlet } from '@ionic/vue';
  import { App as CapacitorApp } from '@capacitor/app';
  import { onMounted, onUnmounted } from 'vue';
  import Menu from "@/views/components/Menu.vue";
  import Notifications from "@/views/components/Notifications.vue";
  import { refreshUser } from "@/uses/session";

  const userLogued = true;

  // Refrescamos el estado del usuario (validación / can_operate) al arrancar y cada
  // vez que la app vuelve a primer plano: cubre el caso del admin que aprueba/rechaza
  // mientras la app estaba en segundo plano.
  let removeResume: (() => void) | null = null;

  onMounted(async () => {
    refreshUser(true);
    const handle = await CapacitorApp.addListener('resume', () => refreshUser(true));
    removeResume = () => handle.remove();
  });

  onUnmounted(() => {
    if (removeResume) removeResume();
  });
</script>
