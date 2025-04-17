<template>
  <ion-menu
    side="start"
    menu-id="main-menu"
    content-id="main-content"
    type="overlay"
  >
    <ion-content class="ion-padding">
      <ion-img
        class="logo"
        src="`${process.env.BASE_URL}assets/logo/logo.png`"
      ></ion-img>

      <ion-card class="user-welcome ion-no-margin ion-margin-top">
        <ion-card-content>
          <ion-text
            ><h2>Hola, {{ User.get()?.firstname }}</h2></ion-text
          >
          <ion-text color="primary" @click="openNotificationsMenu"
            >No tenes notificaciones nuevas</ion-text
          >
        </ion-card-content>
      </ion-card>

      <ion-list id="menu-items">
        <ion-menu-toggle auto-hide="false" v-for="(p, i) in items" :key="i">
          <ion-item
            :router-link="p.url"
            lines="none"
            detail="false"
            class="hydrated"
            :class="{ selected: active === i }"
          >
            <ion-icon
              aria-hidden="true"
              slot="start"
              color="primary"
              :ios="p.icon"
              :md="p.icon"
            ></ion-icon>
            <ion-label>{{ p.title }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>

      <ion-list id="logout-item">
        <ion-menu-toggle auto-hide="false">
          <ion-item
            @click="logout"
            lines="none"
            detail="false"
            class="hydrated"
          >
            <ion-icon
              aria-hidden="true"
              slot="start"
              color="primary"
              :ios="logOutOutline"
              :md="logOutOutline"
            ></ion-icon>
            <ion-label>Cerrar sesión</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup>
import {
  IonImg,
  IonText,
  IonCard,
  IonContent,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  menuController,
  useIonRouter,
} from '@ionic/vue'
import { ref, watch } from 'vue'

import {
  newspaperOutline,
  bookmarkOutline,
  giftOutline,
  megaphoneOutline,
  schoolOutline,
  bagAddOutline,
  shareSocialOutline,
  personOutline,
  logOutOutline,
  homeOutline,
  gridOutline,
} from 'ionicons/icons'
import { useRoute } from 'vue-router'
import { useAuth } from '@/uses/auth'
import User from '@/utils/user'

const route = useRoute()
const router = useIonRouter()
const active = ref(null)
const items = [
  {
    title: 'Inicio',
    url: '/',
    icon: homeOutline,
  },
  {
    title: 'Noticias',
    url: '/noticias',
    icon: newspaperOutline,
  },
  {
    title: 'Talleres',
    url: '/talleres',
    icon: schoolOutline,
  },
  {
    title: 'Programas',
    url: '/cursos',
    icon: gridOutline,
  },
  {
    title: 'Material bibliográfico',
    url: '/material-bibliografico',
    icon: bookmarkOutline,
  },
  {
    title: 'Búsqueda laboral',
    url: '/busqueda-laboral',
    icon: bagAddOutline,
  },
  {
    title: 'Información de interés',
    url: '/informacion-de-interes',
    icon: shareSocialOutline,
  },
  {
    title: 'Beneficios',
    url: '/beneficios',
    icon: giftOutline, // Importá giftOutline desde ionicons/icons
  },
  {
    title: 'Avisos',
    url: '/classifieds',
    icon: megaphoneOutline,
  },
  {
    title: 'Mi cuenta',
    url: '/perfil',
    icon: personOutline,
  },
]

const path = route.path
setActiveItem(path)
watch(route, (r) => setActiveItem(r.path))

function setActiveItem(curr) {
  active.value = items.findIndex((page) => page.url === curr.toLowerCase())
}

function openNotificationsMenu() {
  menuController
    .close('main-menu')
    .then(() => menuController.open('notification-content'))
}

function logout() {
  useAuth()
    .logout()
    .then(() => router.push({ name: 'login' }))
}
</script>

<style scoped>
ion-content {
  --ion-item-background: #fff;
}

.logo {
  width: 200px;
}

.user-welcome {
  background-color: var(--ion-color-step-950);
}

.user-welcome * {
  margin-top: 0;
}

#logout-item {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding-bottom: 0;
}

ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu ion-list {
  padding: 20px 0;
}

ion-menu ion-note {
  margin-bottom: 30px;
}

ion-menu ion-list-header,
ion-menu ion-note {
  padding-left: 10px;
}

ion-menu ion-list#menu-items ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu ion-item:not(.selected) {
  /* --padding-start: 10px; */
  /* --padding-end: 10px; */
  /* border-radius: 4px; */
  border-top: 1px solid var(--ion-color-step-900);
}

ion-menu ion-menu-toggle:last-child ion-item:not(.selected) {
  border-bottom: 1px solid var(--ion-color-step-900);
}

ion-menu ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu ion-item.selected ion-icon {
  color: var(--ion-color-light);
}

ion-menu ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-item {
  font-size: 16px;
}

ion-menu.ios ion-icon {
  font-size: 1.4em;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
