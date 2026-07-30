<template>
    <div class="ion-margin-top links">
        <ion-text class="section-header">Enlaces de interés</ion-text>

        <ion-card @click="goToWhatsapp" color="dark" class="ion-no-margin ion-margin-top link-whatsapp cursor-pointer">
            <ion-card-content>
                    Atención y consultas
                    <ion-icon :md="logoWhatsapp" size="large" :ios="logoWhatsapp"></ion-icon>
            </ion-card-content>
        </ion-card>

        <ion-card @click="goToYoutube" color="dark" class="ion-no-margin ion-margin-top link-youtube cursor-pointer">
            <ion-card-content>
                Canal de Youtube
                <ion-icon :md="logoYoutube" size="large" :ios="logoYoutube"></ion-icon>
            </ion-card-content>
        </ion-card>
    </div>
</template>

<script setup lang="ts">
    import {
        logoWhatsapp,
        logoYoutube
    } from 'ionicons/icons';

    import {
        IonCard, IonCardContent,
        IonIcon, IonText
    } from '@ionic/vue';

    import { openWhatsapp, openYoutubePlaylist } from '@/uses/externalLinks';

    /*
     * Este componente está desactivado hoy (Home.vue lo tiene comentado), pero
     * arrastraba las dos URLs viejas: `web.whatsapp.com` (que en el celular abre
     * el cliente web) y la playlist anterior de YouTube. Si alguien lo vuelve a
     * activar, con los helpers centralizados no revive ninguno de los dos bugs.
     */
    function goToWhatsapp(){
        openWhatsapp();
    }

    function goToYoutube(){
        openYoutubePlaylist();
    }
</script>

<style scoped>
    .links ion-card-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }

    .links ion-card-content:after {
        content:"";
        display: block;
        height: 100%;
        width: 10px;
        position: absolute;
        right: 0px;
    }

    .links .link-whatsapp ion-card-content::after{background-color: #11AE09;}
    .links .link-youtube ion-card-content::after{background-color: #FF0000;}
</style>
