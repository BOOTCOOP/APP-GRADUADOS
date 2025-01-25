<template>
  <graduados-app header-title="Comprobante cargado" :header-show-back-button="true" body="white">
        <div class="ion-text-center">
            <ion-img src="/assets/feedback/success.svg"/>
            <ion-text><h2>¡Inscripción exitosa!</h2></ion-text>
            <ion-text><p>Te vamos a estar notificando cuando el taller esté próximo a comenzar.</p></ion-text>
        </div>
        <template #footer>
              <ion-button @click="goToCourses" shape="round" expand="full" color="primary">Listo</ion-button>
        </template>
    </graduados-app>
</template>

<script setup lang="ts">
    import { IonButton, IonImg, IonText, useIonRouter } from '@ionic/vue';

    const ionRouter = useIonRouter();

    function goToCourses() {
        ionRouter.navigate('/talleres', 'forward', 'replace');
    }
</script>