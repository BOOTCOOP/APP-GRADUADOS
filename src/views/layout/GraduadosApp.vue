<template>
    <ion-page class="body" >
        <slot name="header">
          <ion-header :translucent="headerTranslucent" :class="[toolbarNoShadow ? 'no-shadow' : '']">
            <ion-toolbar>
              <ion-buttons slot="start">
                <slot name="header-start">
                    <!--
                      Un solo botón a la izquierda: o "atrás" o el menú, nunca los
                      dos (queda apretado y se lee como un error). El menú sigue
                      alcanzable desde el botón de inicio flotante.
                    -->
                    <ion-menu-button
                      menu="main-menu"
                      v-show="headerShowMenu && !showBackButton"
                      color="primary"
                      aria-label="Abrir menú"
                    ></ion-menu-button>
                    <ion-back-button
                      v-if="showBackButton"
                      color="primary"
                      text=""
                      aria-label="Volver"
                      @click="goBack"
                      default-href="/"
                    ></ion-back-button>
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
          <div
            class="page-body"
            :class="{
              'page-body--flush': flush,
              'page-body--fab': !hideFabButton && !$slots.footer,
            }"
          >
            <slot></slot>
          </div>
        </ion-content>

        <!--
          El footer se monta SOLO si la vista pasa algo por el slot. Antes se
          renderizaba siempre con `ion-padding`, así que toda pantalla sin footer
          arrastraba una banda fija abajo (padding + safe-area) que tapaba el
          final del contenido: era la razón por la que en pantallas más altas la
          última fila de cards del inicio aparecía cortada.

          OJO: tiene que ser `$slots.footer` leído acá, en el template. Con un
          `computed(() => Boolean(slots.footer))` el valor queda cacheado, y las
          vistas que declaran `<template #footer v-if="!loading">` (Búsquedas
          Laborales, Cursos) no tienen slot en el primer render: el computed se
          quedaba en false para siempre y los botones del pie no volvían a
          aparecer nunca.
        -->
        <ion-footer
          v-if="$slots.footer"
          class="ion-padding ion-no-border"
          :class="[body ? 'body-' + body : '']"
          collapse="fade"
        >
          <slot name="footer"></slot>
        </ion-footer>

        <!--
          Si la vista tiene footer con acciones (Guardar, Postulate, Enviar…) el
          FAB no se muestra: quedaba flotando encima del botón principal, pisando
          justo la acción más importante de la pantalla.
        -->
        <ion-fab
          v-if="!hideFabButton && !$slots.footer"
          slot="fixed"
          vertical="bottom"
          horizontal="end"
          @click="gotoHome"
        >
          <ion-fab-button aria-label="Ir al inicio">
            <ion-icon :icon="homeOutline" aria-hidden="true"></ion-icon>
          </ion-fab-button>
        </ion-fab>
    </ion-page>
</template>

<script setup>
import { IonButtons, IonFooter, IonMenuButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonBackButton, useIonRouter, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { homeOutline } from 'ionicons/icons';
import { computed } from 'vue';

const router = useIonRouter()

const prop = defineProps({
  headerTitle: {default: ''},
  headerTranslucent: {default: true},
  headerShowMenu: {default: true},
  headerShowBackButton: {default: false},
  contentFullscreen: {default: true},
  body: {default: ''},
  toolbarNoShadow: {default: false},
  hideFabButton: {default: false},
  // Vistas que manejan su propio padding (heros a sangre, carruseles, grids):
  // evita el doble gutter de tener el padding del layout MÁS el de la vista.
  flush: {default: false}
})

const showBackButton = computed(() => prop.headerShowBackButton); // Usar computed para reactividad

const gotoHome = () => {
  router.replace({name:'home'})
}

// Función para ir atrás
const goBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    // Si no puede ir atrás, ir al home
    router.replace({name:'home'});
  }
}
</script>

<style>
  ion-content.body-white{
    --background: #fff;
  }

  ion-footer.body-white{
    background-color: #fff;
  }

  /*
   * Ionic solo agrega la safe area de abajo a los footers que contienen un
   * ion-toolbar; este footer lleva los botones directos, así que el "Guardar"
   * quedaba pegado a la barra de navegación del sistema.
   *
   * El selector incluye `.ion-padding` para ganarle en especificidad al
   * `padding-bottom: 16px` de esa misma clase (una clase le gana a dos
   * elementos), que si no pisaba este cálculo.
   */
  ion-footer.ion-padding {
    padding-bottom: calc(var(--app-spacing-lg, 16px) + var(--ion-safe-area-bottom, 0px));
  }

  ion-header.no-shadow.header-md::after{
    content: none !important
  }

  /*
   * Padding de página unificado. Antes el layout envolvía todo en `.ion-padding`
   * (16px) y varias vistas agregaban ADEMÁS su propio margin/padding de 16-20px,
   * quedando gutters de 32-36px en un celular angosto.
   */
  .page-body {
    position: relative;
    padding: var(--app-spacing-lg, 16px);
    /* Respeta la barra de gestos en Android/iOS edge-to-edge */
    padding-bottom: calc(var(--app-spacing-lg, 16px) + var(--ion-safe-area-bottom, 0px));
  }

  .page-body--flush {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }

  /* Con FAB visible reservamos su alto para que no tape la última fila/card */
  .page-body--fab {
    padding-bottom: calc(84px + var(--ion-safe-area-bottom, 0px));
  }
</style>
