<template>
    <ion-grid>
        <ion-row>
            <ion-col>
                <ion-card router-link="/noticias" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <ion-icon size="large" color="primary" :ios="newspaperOutline" :md="newspaperOutline"></ion-icon>
                        <ion-text class="ion-margin-top">Noticias</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/talleres" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <ion-icon size="large" color="primary" :ios="schoolOutline" :md="schoolOutline"></ion-icon>
                        <ion-text class="ion-margin-top">Talleres</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/cursos" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <ion-icon size="large" color="primary" :ios="gridOutline" :md="gridOutline"></ion-icon>
                        <ion-text class="ion-margin-top">Programas</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/beneficios" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <ion-icon size="large" color="primary" :ios="giftOutline" :md="giftOutline"></ion-icon>
                        <ion-text class="ion-margin-top">Beneficios</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col>
                <ion-card router-link="/material-bibliografico" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <ion-icon size="large" color="primary" :ios="bookmarkOutline" :md="bookmarkOutline"></ion-icon>
                        <ion-text class="ion-margin-top">Material bibliográfico</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/busqueda-laboral" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <ion-icon size="large" color="primary" :ios="bagAddOutline" :md="bagAddOutline"></ion-icon>
                        <ion-text class="ion-margin-top">Búsqueda laboral</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/informacion-de-interes" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <ion-icon size="large" color="primary" :ios="shareSocialOutline" :md="shareSocialOutline"></ion-icon>
                        <ion-text class="ion-margin-top">Información de interés</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/classifieds" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <ion-icon size="large" color="primary" :ios="megaphoneOutline" :md="megaphoneOutline"></ion-icon>
                        <ion-text class="ion-margin-top">Avisos</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
        </ion-row>
    </ion-grid>
</template>

<script setup lang="ts">
    import {
bagAddOutline,
bookmarkOutline,
giftOutline,
gridOutline,
newspaperOutline,
schoolOutline,
shareSocialOutline,
megaphoneOutline
} from 'ionicons/icons';

    import {
IonCard, IonCardContent,
IonCol,
IonGrid,
IonIcon,
IonRow,
IonText,
} from '@ionic/vue';
</script>
