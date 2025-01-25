<template>
    <ion-page class="body" >
        <slot name="header">
          <ion-header :translucent="headerTranslucent" :class="[toolbarNoShadow ? 'no-shadow' : '']">
            <ion-toolbar>
              <ion-buttons slot="start">
                <slot name="header-start">
                    <ion-menu-button menu="main-menu" v-show="headerShowMenu && !showBackButton" color="primary"></ion-menu-button>
                    <ion-back-button menu="main-menu" v-if="showBackButton" color="primary"></ion-back-button>
                </slot>
              </ion-buttons>
              <slot name="header-title">
                <ion-title>{{ headerTitle }}</ion-title>
              </slot>
              <ion-buttons slot="end">
                <slot name="header-end">
                </slot>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
        </slot>
            
        <ion-content :class="[body ? 'body-' + body : '']"  :fullscreen="contentFullscreen" >
          <div class="ion-padding" style="position:relative">
            <slot></slot>
          </div>
        </ion-content>

        <ion-footer class="ion-padding ion-no-border" :class="[body ? 'body-' + body : '']" collapse="fade">
          <slot name="footer"></slot>
        </ion-footer>

        <ion-fab v-if="!hideFabButton" slot="fixed" vertical="bottom" horizontal="end" @click="gotoHome">
          <ion-fab-button>
            <ion-icon :icon="homeOutline"></ion-icon>
          </ion-fab-button>
        </ion-fab>
    </ion-page>
</template>

<script setup>
  import { IonButtons, IonFooter, IonMenuButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonBackButton, useIonRouter, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
  import { homeOutline } from 'ionicons/icons';

  const router = useIonRouter()

  const prop = defineProps({
    headerTitle: {default: ''},
    headerTranslucent: {default: true},
    headerShowMenu: {default: true},
    headerShowBackButton: {default: false},
    contentFullscreen: {default: true},
    body: {default: ''},
    toolbarNoShadow: {default: false},
    hideFabButton: {default: false}
  })  

  const showBackButton = prop.headerShowBackButton && router.canGoBack();

  const gotoHome = () => {
    router.replace({name:'home'})
  }
</script>

<style>
  ion-content.body-white{
    --background: #fff;
  }

  ion-footer.body-white{
    background-color: #fff;
  }

  ion-header.no-shadow.header-md::after{
    content: none !important
  }
</style>