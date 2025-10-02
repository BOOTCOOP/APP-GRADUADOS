<template>
  <div class="main-logo">
    <img :src="logoUrl" alt="UBA Derecho" class="logo-img" />
  </div>
  <ion-grid>
    <!-- Fila 1: Beneficios - Material Bibliográfico -->
    <ion-row>
      <ion-col size="6">
        <ion-card
          router-link="/beneficios"
          class="ion-no-margin cursor-pointer ion-text-center ion-card-square"
        >
          <ion-card-content>
            <ion-icon
              color="primary"
              :ios="giftOutline"
              :md="giftOutline"
            ></ion-icon>
            <ion-text class="ion-margin-top" color="primary"
              >Beneficios</ion-text
            >
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="6">
        <ion-card
          router-link="/material-bibliografico"
          class="ion-no-margin cursor-pointer ion-text-center ion-card-square"
        >
          <ion-card-content>
            <ion-icon
              color="primary"
              :ios="libraryOutline"
              :md="libraryOutline"
            ></ion-icon>
            <ion-text class="ion-margin-top" color="primary"
              >Material bibliográfico</ion-text
            >
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>

    <!-- Fila 2: Información de interés - Avisos -->
    <ion-row>
      <ion-col size="6">
        <ion-card
          router-link="/informacion-de-interes"
          class="ion-no-margin cursor-pointer ion-text-center ion-card-square"
        >
          <ion-card-content>
            <ion-icon
              color="primary"
              :ios="informationCircleOutline"
              :md="informationCircleOutline"
            ></ion-icon>
            <ion-text class="ion-margin-top" color="primary"
              >Información de interés</ion-text
            >
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="6">
        <ion-card
          router-link="/classifieds"
          class="ion-no-margin cursor-pointer ion-text-center ion-card-square"
        >
          <ion-card-content>
            <ion-icon
              color="primary"
              :ios="megaphoneOutline"
              :md="megaphoneOutline"
            ></ion-icon>
            <ion-text class="ion-margin-top" color="primary">Avisos</ion-text>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>

    <!-- Fila 3: Noticias - Búsqueda laboral -->
    <ion-row>
      <ion-col size="6">
        <ion-card
          router-link="/noticias"
          class="ion-no-margin cursor-pointer ion-text-center ion-card-square"
        >
          <ion-card-content>
            <ion-icon
              color="primary"
              :ios="newspaperOutline"
              :md="newspaperOutline"
            ></ion-icon>
            <ion-text class="ion-margin-top" color="primary">Noticias</ion-text>
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="6">
        <ion-card
          router-link="/busqueda-laboral"
          class="ion-no-margin cursor-pointer ion-text-center ion-card-square"
        >
          <ion-card-content>
            <ion-icon
              color="primary"
              :ios="briefcaseOutline"
              :md="briefcaseOutline"
            ></ion-icon>
            <ion-text class="ion-margin-top" color="primary"
              >Búsqueda laboral</ion-text
            >
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>

    <!-- Fila 4: Programas - Talleres -->
    <ion-row>
      <ion-col size="6">
        <ion-card
          router-link="/cursos"
          class="ion-no-margin cursor-pointer ion-text-center ion-card-square"
        >
          <ion-card-content>
            <ion-icon
              color="primary"
              :ios="ribbonOutline"
              :md="ribbonOutline"
            ></ion-icon>
            <ion-text class="ion-margin-top" color="primary"
              >Programas</ion-text
            >
          </ion-card-content>
        </ion-card>
      </ion-col>
      <ion-col size="6">
        <ion-card
          router-link="/talleres"
          class="ion-no-margin cursor-pointer ion-text-center ion-card-square"
        >
          <ion-card-content>
            <ion-icon
              color="primary"
              :ios="schoolOutline"
              :md="schoolOutline"
            ></ion-icon>
            <ion-text class="ion-margin-top" color="primary">Talleres</ion-text>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>

    <!-- Fila 5: Contacto (ocupa toda la fila) -->
    <ion-row>
      <ion-col size="12">
        <ion-card
          router-link="/contacto"
          class="ion-no-margin cursor-pointer ion-text-center ion-card-full-width"
        >
          <ion-card-content>
            <ion-icon
              color="primary"
              :ios="callOutline"
              :md="callOutline"
            ></ion-icon>
            <ion-text class="ion-margin-top" color="primary">Contacto</ion-text>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
const logoUrl = "/assets/logo/logo.png";

import {
  briefcaseOutline,
  libraryOutline,
  giftOutline,
  ribbonOutline,
  newspaperOutline,
  schoolOutline,
  informationCircleOutline,
  megaphoneOutline,
  callOutline,
} from "ionicons/icons";

import {
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/vue";
</script>

<style scoped>
.main-logo {
  text-align: center;
  margin-bottom: 24px;
  margin-top: 10px;
}
.logo-img {
  width: auto;
  height: auto;
  /* margin-bottom: 8px; */
}

/* Forzar el tamaño de los íconos */
ion-icon {
  width: 60px !important;
  height: 60px !important;
}

/* Estilo para el botón de contacto que ocupa toda la fila */
.ion-card-full-width {
  min-height: 120px;
  display: flex;
  align-items: center;
}

.ion-card-full-width ion-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
