<template>
  <ion-app>
    <Menu></Menu>
    <Notifications v-if="isLoggedIn"></Notifications>

    <ion-router-outlet :key="$route.fullPath" id="main-content"></ion-router-outlet>
  </ion-app>
</template>

<script setup lang="ts">
  import { IonApp, IonRouterOutlet, toastController } from '@ionic/vue';
  import { App as CapacitorApp } from '@capacitor/app';
  import { onMounted, onUnmounted, watch } from 'vue';
  import { closeOutline } from "ionicons/icons";
  import Menu from "@/views/components/Menu.vue";
  import Notifications from "@/views/components/Notifications.vue";
  import { refreshUser } from "@/uses/session";
  import { checkMinVersion } from "@/uses/appUpdate";
  import {
    notifyReady,
    checkOtaUpdate,
    pendingOtaUpdate,
    applyPendingOtaUpdate,
  } from "@/uses/otaUpdate";
  import { useCurrentUser } from "@/uses/currentUser";
  import { useNotifications } from "@/uses/notifications";

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

  // Cuando el chequeo automático deja un bundle OTA descargado y programado,
  // se avisa por DOS vías a la vez (redundancia deliberada, en evaluación —
  // quedarán una o ambas según cómo se vean en uso real):
  //
  // - Toast accionable: universal — lo ve cualquiera, en cualquier pantalla,
  //   con o sin sesión. Botón "Actualizar" aplica al instante; la X lo pospone.
  // - Notificación local en la campanita: persistente (queda en el panel hasta
  //   actualizar), pero solo existe con sesión y el botón está en el inicio.
  //
  // En ambos casos "actualizar" = applyPendingOtaUpdate() → set() recarga la
  // WebView ya mismo. El guard por versión en otaUpdate.ts evita re-disparos
  // en cada resume.
  const OTA_NOTIFICATION_ID = "local-ota-update";
  const { setLocalNotification, removeLocalNotification } = useNotifications();

  watch(pendingOtaUpdate, async (update) => {
    // pendingOtaUpdate puede volver a null si el manifiesto retrocede de
    // versión: retiramos el aviso para que la campanita no mienta.
    if (!update) {
      removeLocalNotification(OTA_NOTIFICATION_ID);
      return;
    }

    const applyUpdate = () => {
      applyPendingOtaUpdate().catch((e) => {
        console.warn("[ota] no se pudo aplicar el bundle pendiente:", e);
      });
    };

    setLocalNotification({
      id: OTA_NOTIFICATION_ID,
      type: "update",
      subject: `Versión ${update.version} disponible`,
      message: "Tocá para actualizar: tarda unos segundos y la app se recarga sola.",
      read: false,
      created_at: new Date().toISOString(),
      action: applyUpdate,
    });

    const toast = await toastController.create({
      message: `Versión ${update.version} disponible.`,
      position: "bottom",
      color: "dark",
      duration: 12000,
      buttons: [
        { text: "Actualizar", handler: applyUpdate },
        { icon: closeOutline, role: "cancel" },
      ],
    });
    toast.present();
  });
</script>
