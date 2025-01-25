<template>
  <graduados-app header-title="Comprobante cargado" :header-show-back-button="true" body="white">
        <div class="ion-text-center">
            <ion-img src="/assets/feedback/success.svg"/>
            <ion-text><h2>Desinscripción exitosa</h2></ion-text>
            <ion-text><p>La desinscripción al curso se realizó con éxito.</p></ion-text>
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