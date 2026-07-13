<template>
  <ion-menu
    side="start"
    menu-id="main-menu"
    content-id="main-content"
    type="overlay"
  >
    <ion-content>
      <!-- Gradient header with avatar + user info -->
      <div class="menu-header">
        <div class="menu-avatar">
          <span v-if="userInitials">{{ userInitials }}</span>
          <ion-icon v-else :icon="person" />
        </div>
        <div class="menu-user-info" v-if="isLoggedIn">
          <span class="menu-user-name">{{ user?.firstname }} {{ user?.lastname }}</span>
          <span class="menu-user-sub">Graduado UBA Derecho</span>
        </div>
        <div class="menu-user-info" v-else>
          <span class="menu-user-name">Bienvenido/a</span>
          <span class="menu-user-sub">Iniciá sesión para inscribirte y más</span>
        </div>
      </div>

      <!-- Navigation items -->
      <ion-list lines="none" class="menu-list">
        <ion-menu-toggle auto-hide="false" v-for="(p, i) in items" :key="i">
          <ion-item
            :router-link="p.url"
            detail="false"
            class="menu-item"
            :class="{ selected: active === i }"
          >
            <div class="menu-icon-wrap" slot="start" :class="{ 'selected-icon': active === i }">
              <ion-icon :icon="p.icon" />
            </div>
            <ion-label>{{ p.title }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>

      <!-- Cerrar / Iniciar sesión -->
      <div class="menu-footer">
        <ion-list lines="none">
          <ion-menu-toggle auto-hide="false">
            <ion-item
              v-if="isLoggedIn"
              @click="logout"
              detail="false"
              class="menu-item logout-item"
            >
              <div class="menu-icon-wrap danger-icon" slot="start">
                <ion-icon :icon="logOutOutline" />
              </div>
              <ion-label color="danger">Cerrar sesión</ion-label>
            </ion-item>
            <ion-item
              v-else
              router-link="/login"
              detail="false"
              class="menu-item login-item"
            >
              <div class="menu-icon-wrap" slot="start">
                <ion-icon :icon="logInOutline" />
              </div>
              <ion-label color="primary">Iniciar sesión</ion-label>
            </ion-item>
          </ion-menu-toggle>
        </ion-list>
        <div class="menu-version">v{{ appVersion }}</div>
      </div>
    </ion-content>
  </ion-menu>
</template>

<script setup>
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  menuController,
  useIonRouter,
} from "@ionic/vue";
import { ref, computed, watch } from "vue";

import {
  newspaperOutline,
  libraryOutline,
  giftOutline,
  megaphoneOutline,
  schoolOutline,
  briefcaseOutline,
  informationCircleOutline,
  person,
  personOutline,
  logOutOutline,
  logInOutline,
  homeOutline,
  ribbonOutline,
  callOutline,
} from "ionicons/icons";
import { useRoute } from "vue-router";
import { useAuth } from "@/uses/auth";
import { useCurrentUser } from "@/uses/currentUser";

const route = useRoute();
const router = useIonRouter();
const active = ref(null);

// Versión del bundle JS (package.json, inyectada por vite.config.ts). Cambia
// con cada OTA: sirve para verificar qué versión tiene instalada un usuario.
const appVersion = import.meta.env.VITE_APP_VERSION;

// Fuente reactiva: el header y el footer del menú cambian al loguear/desloguear
// sin necesidad de recargar la app.
const { user, isLoggedIn } = useCurrentUser();

// Iniciales estilo Google: nombre + apellido si están, una sola si falta la
// otra, y cadena vacía (→ ícono de silueta) si no hay ninguna o no hay sesión.
const userInitials = computed(() => {
  const first = (user.value?.firstname ?? '').trim().charAt(0);
  const last = (user.value?.lastname ?? '').trim().charAt(0);
  return (first + last).toUpperCase();
});

const items = [
  { title: "Inicio",                   url: "/",                        icon: homeOutline },
  { title: "Cursos",                   url: "/cursos",                  icon: ribbonOutline },
  { title: "Talleres y Jornadas",      url: "/talleres",                icon: schoolOutline },
  { title: "Actividades Online",       url: "/classifieds",             icon: megaphoneOutline },
  { title: "Búsquedas Laborales",      url: "/busqueda-laboral",        icon: briefcaseOutline },
  { title: "Bibliografía",             url: "/material-bibliografico",  icon: libraryOutline },
  { title: "Noticias",                 url: "/noticias",                icon: newspaperOutline },
  { title: "Información de interés",   url: "/informacion-de-interes",  icon: informationCircleOutline },
  { title: "Beneficios",               url: "/beneficios",              icon: giftOutline },
  { title: "Mi cuenta",                url: "/perfil",                  icon: personOutline },
  { title: "Contacto",                 url: "/contacto",                icon: callOutline },
];

setActiveItem(route.path);
watch(route, (r) => setActiveItem(r.path));

function setActiveItem(curr) {
  active.value = items.findIndex((page) => page.url === curr.toLowerCase());
}

function logout() {
  useAuth()
    .logout()
    .then(() => router.push("/"));
}
</script>

<style scoped>
/* ── Content background ─────────────────────────── */
ion-content {
  --background: #F4F5F8;
}

/* ── Gradient header ────────────────────────────── */
.menu-header {
  background: linear-gradient(145deg, #AB49CC 0%, #7A35AB 100%);
  padding: 48px 20px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.menu-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
  letter-spacing: -0.5px;
}

.menu-avatar ion-icon {
  font-size: 26px;
  color: rgba(255, 255, 255, 0.9);
}

.menu-user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.menu-user-name {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-user-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
}

/* ── Nav list ───────────────────────────────────── */
.menu-list {
  padding: 12px 12px 0 !important;
  background: transparent !important;
}

.menu-item {
  --background: transparent;
  --background-activated: transparent;
  --background-focused: transparent;
  --border-radius: 12px;
  --padding-start: 10px;
  --padding-end: 10px;
  --inner-padding-end: 0;
  --min-height: 52px;
  margin-bottom: 2px;
  border-radius: 12px;
  transition: background 0.15s ease;
}

.menu-item.selected {
  --background: rgba(171, 73, 204, 0.10);
}

.menu-item.selected ion-label {
  color: var(--ion-color-primary) !important;
  font-weight: 700;
}

ion-item.menu-item ion-label {
  font-size: 15px;
  font-weight: 500;
  color: #1A1A2E;
}

/* ── Icon wrap ──────────────────────────────────── */
.menu-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(171, 73, 204, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.menu-icon-wrap ion-icon {
  font-size: 18px;
  color: var(--ion-color-primary);
}

.menu-icon-wrap.selected-icon {
  background: var(--ion-color-primary);
}

.menu-icon-wrap.selected-icon ion-icon {
  color: #ffffff;
}

/* ── Logout ─────────────────────────────────────── */
.menu-footer {
  padding: 8px 12px 24px;
  margin-top: 4px;
}

.logout-item.menu-item {
  --background: rgba(254, 61, 61, 0.06);
}

.login-item.menu-item {
  --background: rgba(171, 73, 204, 0.08);
}

.menu-icon-wrap.danger-icon {
  background: rgba(254, 61, 61, 0.10);
}

.menu-icon-wrap.danger-icon ion-icon {
  color: var(--ion-color-danger);
}

/* ── Versión de la app ──────────────────────────── */
.menu-version {
  text-align: center;
  font-size: 11px;
  color: #9a9aa8;
  margin-top: 10px;
  letter-spacing: 0.3px;
}
</style>
