import ApiToken from '@/utils/apitoken'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

const auth = true
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/Home.vue'),
    meta: { auth },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/Login.vue'),
  },
  {
    path: '/registro',
    name: 'register',
    component: () => import('../views/auth/register/Register.vue'),
  },
  {
    path: '/recuperar-contrasena',
    name: 'forgot-password',
    component: () => import('../views/auth/ForgotPassword.vue'),
  },
  {
    path: '/cambiar-contrasena/:token',
    name: 'change-password',
    component: () => import('../views/auth/ChangePassword.vue'),
  },
  {
    path: '/perfil',
    name: 'profile',
    component: () => import('../views/profile/Profile.vue'),
    meta: { auth },
  },
  {
    path: '/perfil/contrasena',
    name: 'profile.password',
    component: () => import('../views/profile/ProfilePassword.vue'),
    meta: { auth },
  },
  {
    path: '/noticias',
    name: 'feeds.index',
    component: () => import('../views/feeds/Feeds.vue'),
    meta: { auth },
  },
  {
    path: '/noticia/:slug',
    name: 'feeds.show',
    component: () => import('../views/feeds/Show.vue'),
    meta: { auth },
  },
  {
    path: '/informacion-de-interes',
    name: 'interests.index',
    component: () =>
      import('../views/information-of-interest/InformationOfInterest.vue'),
    meta: { auth },
  },
  {
    path: '/talleres',
    name: 'activities.index',
    component: () => import('../views/activities/Activities.vue'),
    meta: { auth },
  },
  {
    path: '/talleres/historial',
    name: 'activities.history',
    component: () => import('../views/activities/History.vue'),
    meta: { auth },
  },
  {
    path: '/taller/:slug',
    name: 'activities.show',
    component: () => import('../views/activities/Detail.vue'),
    meta: { auth },
  },
  {
    path: '/talleres/inscripcion-exitosa',
    name: 'activities.success',
    component: () => import('../views/activities/Success.vue'),
    meta: { auth },
  },
  {
    path: '/talleres/pago-exitoso',
    name: 'activities.success-pay',
    component: () => import('../views/activities/SuccessPay.vue'),
    meta: { auth },
  },
  {
    path: '/talleres/desinscripcion-exitosa',
    name: 'activities.unenroll.success',
    component: () => import('../views/activities/SuccessUnenroll.vue'),
    meta: { auth },
  },
  {
    path: '/material-bibliografico',
    name: 'material',
    component: () => import('../views/bibliography/Bibliography.vue'),
    meta: { auth },
  },
  {
    path: '/busqueda-laboral',
    name: 'jobs.index',
    component: () => import('../views/jobs/Jobs.vue'),
    meta: { auth },
  },
  {
    path: '/busqueda-laboral/:slug',
    name: 'jobs.show',
    component: () => import('../views/jobs/Show.vue'),
    meta: { auth },
  },
  {
    path: '/busqueda-laboral/crear',
    name: 'jobs.create',
    component: () => import('../views/jobs/form/Form.vue'),
    meta: { auth },
  },
  {
    path: '/busqueda-laboral/favoritos',
    name: 'jobs.favorites',
    component: () => import('../views/jobs/Favorites.vue'),
    meta: { auth },
  },
  {
    path: '/busqueda-laboral/job/:slug',
    name: 'jobs.edit',
    component: () => import('../views/jobs/form/Form.vue'),
    meta: { auth },
  },
  {
    path: '/busqueda-laboral/usuario',
    name: 'jobs.own',
    component: () => import('../views/jobs/MyJobs.vue'),
    meta: { auth },
  },
  {
    path: '/form',
    component: () => import('../views/Form.vue'),
  },
  {
    path: '/cursos',
    name: 'courses.index',
    component: () => import('../views/courses/Courses.vue'),
    meta: { auth },
  },
  {
    path: '/cursos/hisotry',
    name: 'courses.history',
    component: () => import('../views/courses/History.vue'),
    meta: { auth },
  },
  {
    path: '/curso/:slug',
    name: 'courses.show',
    component: () => import('../views/courses/Detail.vue'),
    meta: { auth },
  },
  {
    path: '/cursos/inscripcion-exitosa',
    name: 'courses.success',
    component: () => import('../views/courses/Success.vue'),
    meta: { auth },
  },
  {
    path: '/cursos/desinscripcion-exitosa',
    name: 'courses.unenroll.success',
    component: () => import('../views/activities/SuccessUnenroll.vue'),
    meta: { auth },
  },
  {
    path: '/inscripciones/:id/datos-bancarios',
    name: 'inscripciones.accountData',
    component: () => import('../views/inscriptions/AccountData.vue'),
    meta: { auth },
  },
  {
    path: '/inscripciones/:id/subir-comprobante',
    name: 'inscripciones.attachProof',
    component: () => import('../views/inscriptions/AttachProof.vue'),
    meta: { auth },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((route, from, next) => {
  if (route.meta?.auth && !ApiToken.isSet()) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
