<template>
  <ion-menu side="start" menu-id="main-menu" content-id="main-content" type="overlay">
    <ion-content>
      <div class="menu-header">
        <ion-img class="menu-logo" :src="logo" />
        <div class="menu-user">
          <div class="menu-avatar">
            {{ User.get()?.firstname?.charAt(0)?.toUpperCase() }}
          </div>
          <div>
            <p class="menu-user-name">Hola, {{ User.get()?.firstname }}</p>
            <p class="menu-user-status" @click="openNotificationsMenu">No tenés notificaciones</p>
          </div>
        </div>
      </div>

      <ion-list id="menu-items">
        <ion-menu-toggle auto-hide="false" v-for="(p, i) in items" :key="i">
          <ion-item
            :router-link="p.url"
            lines="none"
            detail="false"
            class="hydrated"
            :class="{ selected: active === i }"
          >
            <div slot="start" class="menu-icon-wrap" :class="{ 'menu-icon-active': active === i }">
              <ion-icon color="primary" :ios="p.icon" :md="p.icon"></ion-icon>
            </div>
            <ion-label>{{ p.title }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>

      <ion-list id="logout-item">
        <ion-menu-toggle auto-hide="false">
          <ion-item @click="logout" lines="none" detail="false" class="hydrated">
            <div slot="start" class="menu-icon-wrap menu-icon-danger">
              <ion-icon color="danger" :ios="logOutOutline" :md="logOutOutline"></ion-icon>
            </div>
            <ion-label color="danger">Cerrar sesión</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup>
import logo from '@/assets/logo/logo.png'
import {
  IonImg,
  IonContent,
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
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
}

.menu-header {
  background: linear-gradient(145deg, #AB49CC 0%, #7A35AB 100%);
  padding: 48px 20px 28px;
  border-radius: 0 0 28px 28px;
  margin-bottom: 8px;
  box-shadow: 0 4px 20px rgba(171, 73, 204, 0.28);
}

.menu-logo {
  width: 130px;
  filter: brightness(0) invert(1);
  margin-bottom: 18px;
}

.menu-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menu-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  border: 2px solid rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.menu-user-name {
  color: white;
  font-weight: 700;
  font-size: 15px;
  margin: 0 0 3px;
}

.menu-user-status {
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  margin: 0;
  cursor: pointer;
}

.menu-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(171, 73, 204, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
}

.menu-icon-active {
  background: rgba(171, 73, 204, 0.18);
}

.menu-icon-danger {
  background: rgba(254, 61, 61, 0.08);
}

ion-list {
  padding: 8px 12px;
  background: transparent;
}

ion-item {
  --border-radius: 12px;
  --padding-start: 8px;
  --inner-padding-end: 8px;
  margin-bottom: 2px;
  border-radius: 12px;
}

ion-item.selected {
  --background: rgba(171, 73, 204, 0.09);
  --color: var(--ion-color-primary);
  font-weight: 600;
  border-radius: 12px;
}

#logout-item {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding-bottom: 8px;
}
</style>
