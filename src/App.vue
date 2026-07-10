<template>
  <ion-app>
    <Menu></Menu>
    <Notifications v-if="isLoggedIn"></Notifications>

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
  import { checkMinVersion } from "@/uses/appUpdate";
  import { notifyReady, checkOtaUpdate } from "@/uses/otaUpdate";
  import { useCurrentUser } from "@/uses/currentUser";

  // El Menu se monta siempre (la app es pública); Notifications solo con sesión.
  const { isLoggedIn } = useCurrentUser();

  // Refrescamos el estado del usuario (validación / can_operate) al arrancar y cada
  // vez que la app vuelve a primer plano: cubre el caso del admin que aprueba/rechaza
  // mientras la app estaba en segundo plano.
  let removeResume: (() => void) | null = null;

  onMounted(async () => {
    // Primero de todo: avisa al updater que el bundle arrancó bien. Si un bundle
    // OTA no llega a esta línea, el plugin lo revierte en el próximo arranque.
    notifyReady();
    refreshUser(true);
    checkMinVersion(true);
    checkOtaUpdate(true);
    const handle = await CapacitorApp.addListener('resume', () => {
      refreshUser(true);
      checkMinVersion();
      checkOtaUpdate();
    });
    removeResume = () => handle.remove();
  });

  onUnmounted(() => {
    if (removeResume) removeResume();
  });
</script>
