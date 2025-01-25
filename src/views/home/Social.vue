<template>
    <div class="ion-margin-top socials">
        <ion-grid>
            <ion-row>
                <ion-col>
                    <ion-card @click="goToFacebook()" class="ion-no-margin ion-margin-top ion-text-center social">
                        <ion-card-content>
                            <ion-icon :md="logoFacebook" size="large" :ios="logoFacebook"></ion-icon>
                        </ion-card-content>
                    </ion-card>
                </ion-col>
                <ion-col>
                    <ion-card @click="goToTwitter()" class="ion-no-margin ion-margin-top ion-text-center social">
                        <ion-card-content>
                            <ion-icon :md="logoTwitter" size="large" :ios="logoTwitter"></ion-icon>
                        </ion-card-content>
                    </ion-card>
                </ion-col>
                <ion-col>
                    <ion-card @click="goToInstagram()" class="ion-no-margin ion-margin-top ion-text-center social">
                        <ion-card-content>
                            <ion-icon :md="logoInstagram" size="large" :ios="logoInstagram"></ion-icon>
                        </ion-card-content>
                    </ion-card>
                </ion-col>
            </ion-row>
        </ion-grid>
    </div>
</template>

<script setup lang="ts">
    import {
        logoTwitter,
        logoFacebook,
        logoInstagram
    } from 'ionicons/icons';

    import {
        IonCard, IonCardContent,
        IonGrid, IonCol, IonRow,
        IonIcon
    } from '@ionic/vue';

    function goToFacebook(){
        window.open('https://www.facebook.com/centrode.graduados', '_system');
    }
    
    function goToTwitter(){
        window.open('https://twitter.com/GraduadoDchoUBA', '_system');
    }
    
    function goToInstagram(){
        window.open('https://www.instagram.com/centrodegraduados/', '_system');
    }
    
</script>

<style scoped>
    ion-card.social{
        background-color: var(--ion-color-step-900);
    }
</style>
