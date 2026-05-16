<template>
    <ion-grid>
        <ion-row>
            <ion-col>
                <ion-card router-link="/noticias" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <div class="shortcut-icon-bg">
                            <ion-icon color="primary" :ios="newspaperOutline" :md="newspaperOutline"></ion-icon>
                        </div>
                        <ion-text class="shortcut-text">Noticias</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/talleres" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <div class="shortcut-icon-bg">
                            <ion-icon color="primary" :ios="schoolOutline" :md="schoolOutline"></ion-icon>
                        </div>
                        <ion-text class="shortcut-text">Talleres</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/cursos" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <div class="shortcut-icon-bg">
                            <ion-icon color="primary" :ios="gridOutline" :md="gridOutline"></ion-icon>
                        </div>
                        <ion-text class="shortcut-text">Programas</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/beneficios" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <div class="shortcut-icon-bg">
                            <ion-icon color="primary" :ios="giftOutline" :md="giftOutline"></ion-icon>
                        </div>
                        <ion-text class="shortcut-text">Beneficios</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
        </ion-row>
        <ion-row>
            <ion-col>
                <ion-card router-link="/material-bibliografico" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <div class="shortcut-icon-bg">
                            <ion-icon color="primary" :ios="bookmarkOutline" :md="bookmarkOutline"></ion-icon>
                        </div>
                        <ion-text class="shortcut-text">Material bibliográfico</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/busqueda-laboral" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <div class="shortcut-icon-bg">
                            <ion-icon color="primary" :ios="bagAddOutline" :md="bagAddOutline"></ion-icon>
                        </div>
                        <ion-text class="shortcut-text">Búsqueda laboral</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/informacion-de-interes" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <div class="shortcut-icon-bg">
                            <ion-icon color="primary" :ios="shareSocialOutline" :md="shareSocialOutline"></ion-icon>
                        </div>
                        <ion-text class="shortcut-text">Información de interés</ion-text>
                    </ion-card-content>
                </ion-card>
            </ion-col>
            <ion-col>
                <ion-card router-link="/classifieds" class="ion-no-margin cursor-pointer ion-text-center ion-card-square">
                    <ion-card-content>
                        <div class="shortcut-icon-bg">
                            <ion-icon color="primary" :ios="megaphoneOutline" :md="megaphoneOutline"></ion-icon>
                        </div>
                        <ion-text class="shortcut-text">Avisos</ion-text>
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
