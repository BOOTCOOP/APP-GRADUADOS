<template>
  <graduados-app header-title="Comprobante cargado" :header-show-back-button="true" body="white">
        <div class="ion-text-center">
            <ion-img src="/assets/feedback/success.svg"/>
            <ion-text><h2>El comprobante se cargó exitosamente</h2></ion-text>
            <ion-text><p>Recibimos tu comprobante, luego de corroborar la transferencia te confirmaremos la inscripción</p></ion-text>
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
        ionRouter.navigate('/cursos', 'forward', 'replace');
    }
</script>