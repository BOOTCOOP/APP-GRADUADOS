<template>
    <ion-card>
        <ion-card-content>
            <ion-text color="medium"><small>{{ job.company }}</small> <br></ion-text>
            <ion-text @click="showDetail" color="primary">
                <strong>{{job.title}}</strong>
            </ion-text>
            <div class="ion-margin-top">
                <slot name="info">
                    <ion-text style="display: flex; align-items:center" class="ion-margin-top">
                        <ion-icon style="font-size:20px" :md="compassOutline" :ios="compassOutline" class="ion-margin-end"></ion-icon>
                        {{ job.location }} <br>
                    </ion-text>
                    <ion-text style="display: flex; align-items:center" class="ion-margin-top">
                        <ion-icon style="font-size:20px" :md="personCircleOutline" :ios="personCircleOutline" class="ion-margin-end"></ion-icon>
                        {{ job.modality }}
                    </ion-text>
                </slot>
            </div>

            <slot></slot>
        </ion-card-content>
    </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonIcon, IonText, useIonRouter } from '@ionic/vue';

import { defineProps } from 'vue';
import { compassOutline, personCircleOutline } from 'ionicons/icons';

const prop = defineProps({
    job:{required:true}
})

const router = useIonRouter();

function showDetail(){
    router.push({name:'jobs.show', params: {slug: prop.job.id}})
}
</script>

<style scoped>
    ion-card{
        position:relative
    }
</style>