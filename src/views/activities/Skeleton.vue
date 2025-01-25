<template>    
    <ion-list>
        <ion-card v-for="i in [1,2,3,4,5,6]" :key="i">
            <ion-card-content>
            <ion-label>
                <ion-skeleton-text :animated="true" style="width:50%; height:5px"></ion-skeleton-text>
                <ion-skeleton-text :animated="true" style="width:100%"></ion-skeleton-text>
                <ion-skeleton-text :animated="true" :style="'width: ' + 10*i + '%'" ></ion-skeleton-text>
                
                <div class="ion-margin-top">
                    <ion-skeleton-text :animated="true" style="width:50%"></ion-skeleton-text>
                    <ion-skeleton-text :animated="true" style="width:40%"></ion-skeleton-text>
                </div>
            </ion-label>
            </ion-card-content>
        </ion-card>
    </ion-list>
</template>

<script setup lang="ts">
    import { IonCard, IonCardContent, IonList, IonSkeletonText, IonLabel } from '@ionic/vue';
</script>