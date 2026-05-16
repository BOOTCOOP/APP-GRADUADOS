<template>
  <graduados-app header-title="Inscripción Exitosa" :header-show-back-button="true" body="white">
        <div class="ion-text-center success-container">
            <ion-img src="/assets/feedback/success.svg" class="success-image"/>
            <ion-text class="success-title">
                <h2>¡Inscripción exitosa!</h2>
            </ion-text>
            <ion-text class="success-message">
                <p>Te has inscrito correctamente al programa. Te enviaremos toda la información necesaria por correo electrónico.</p>
            </ion-text>
            <div class="info-box ion-margin-top">
                <ion-text color="medium">
                    <p><small>📧 Revisa tu correo electrónico para más detalles</small></p>
                    <p><small>📅 Te notificaremos cuando el programa esté próximo a comenzar</small></p>
                </ion-text>
            </div>
        </div>
        <template #footer>
              <ion-button 
                @click="goToCourses" 
                shape="round" 
                expand="full" 
                color="primary"
                class="success-button"
              >
                Volver a Cursos
              </ion-button>
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

<style scoped>
.success-container {
    padding: 2rem 1rem;
    max-width: 400px;
    margin: 0 auto;
}

.success-image {
    width: 120px;
    height: 120px;
    margin: 0 auto 2rem;
}

.success-title h2 {
    color: var(--ion-color-success);
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.success-message p {
    color: var(--ion-color-dark);
    font-size: 1.125rem;
    line-height: 1.6;
    margin-bottom: 0;
}

.info-box {
    background: var(--ion-color-light);
    border-radius: 12px;
    padding: 1.5rem;
    margin: 2rem 0;
}

.info-box p {
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.success-button {
    --border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    height: 56px;
}
</style>