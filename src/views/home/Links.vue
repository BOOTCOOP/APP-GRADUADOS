<template>
    <div class="ion-margin-top links">
        <ion-text>Enlaces de interés</ion-text>

        <ion-card @click="goToWhatsapp" color="dark" class="ion-no-margin ion-margin-top link-whatsapp">
            <ion-card-content>
                    Atención y consultas
                    <ion-icon :md="logoWhatsapp" size="large" :ios="logoWhatsapp"></ion-icon>
            </ion-card-content>
        </ion-card>

        <ion-card @click="goToYoutube" color="dark" class="ion-no-margin ion-margin-top link-youtube">
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

    function goToWhatsapp(){
        window.open('https://web.whatsapp.com/send?phone=541126689567', '_system');
    }

    function goToYoutube(){
        window.open('https://www.youtube.com/playlist?list=PL9y1i2ILzxlCqTrjnDReSRB8uBadiBAiL', '_system');
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
