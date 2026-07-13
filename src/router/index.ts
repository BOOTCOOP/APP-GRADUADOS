import ApiToken from '@/utils/apitoken'
import { useCurrentUser } from '@/uses/currentUser'
import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'

// Modelo de acceso: la app es PÚBLICA por defecto. Solo las rutas con
// meta: { auth: true } exigen sesión (el guard de abajo redirige a /login
// preservando el destino en ?redirect=).
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/Home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/Login.vue'),
  },
  {
    path: '/QuizList',
    name: 'QuizList',
    component: () => import('../views/entertainment/QuizList.vue'),
    meta: { auth: true },
  },
  {
    path: '/QuizDetail/:id',
    name: 'QuizDetail',
    component: () => import('../views/entertainment/QuizDetail.vue'),
    meta: { auth: true },
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
    path: '/completar-perfil',
    name: 'complete-profile',
    component: () => import('../views/profile/CompleteProfile.vue'),
    meta: { auth: true },
  },
  {
    path: '/validar-tipo',
    name: 'type-validation',
    component: () => import('../views/profile/TypeValidation.vue'),
    meta: { auth: true },
  },
  {
    path: '/perfil',
    name: 'profile',
    component: () => import('../views/profile/Profile.vue'),
    meta: { auth: true },
  },
  {
    path: '/perfil/contrasena',
    name: 'profile.password',
    component: () => import('../views/profile/ProfilePassword.vue'),
    meta: { auth: true },
  },
  {
    path: '/noticias',
    name: 'feeds.index',
    component: () => import('../views/feeds/Feeds.vue'),
  },
  {
    path: '/beneficios',
    name: 'benefits',
    component: () => import('../views/benefits/Benefits.vue'),
    meta: { auth: true },
  },
  {
    path: '/beneficios/:id',
    name: 'benefitDetail',
    component: () => import('../views/benefits/BenefitDetail.vue'),
    meta: { auth: true },
  },  
  {
    path: '/classifieds',
    name: 'Classifieds',
    component: () => import('@/views/classifieds/Classifieds.vue'),
    meta: { auth: true },
  },
  {
    path: '/classifieds/create',
    name: 'CreateAviso',
    component: () => import('@/views/classifieds/CreateAviso.vue'),
    meta: { auth: true },
  },
  {
    path: '/classifieds/:id',
    name: 'AvisoDetail',
    component: () => import('@/views/classifieds/AvisoDetail.vue'),
    props: true,
    meta: { auth: true },
  },
  {
    path: '/noticia/:slug',
    name: 'feeds.show',
    component: () => import('../views/feeds/Show.vue'),
  },
  {
    path: '/informacion-de-interes',
    name: 'interests.index',
    component: () =>
      import('../views/information-of-interest/InformationOfInterest.vue'),
  },
  {
    path: '/talleres',
    name: 'activities.index',
    component: () => import('../views/activities/Activities.vue'),
  },
  {
    path: '/talleres/historial',
    name: 'activities.history',
    component: () => import('../views/activities/History.vue'),
    meta: { auth: true },
  },
  {
    path: '/taller/:slug',
    name: 'activities.show',
    component: () => import('../views/activities/Detail.vue'),
  },
  {
    path: '/talleres/inscripcion-exitosa',
    name: 'activities.success',
    component: () => import('../views/activities/Success.vue'),
    meta: { auth: true },
  },
  {
    path: '/talleres/pago-exitoso',
    name: 'activities.success-pay',
    component: () => import('../views/activities/SuccessPay.vue'),
    meta: { auth: true },
  },
  {
    path: '/talleres/desinscripcion-exitosa',
    name: 'activities.unenroll.success',
    component: () => import('../views/activities/SuccessUnenroll.vue'),
    meta: { auth: true },
  },
  {
    path: '/material-bibliografico',
    name: 'material',
    component: () => import('../views/bibliography/Bibliography.vue'),
  },
  {
    path: '/busqueda-laboral',
    name: 'jobs.index',
    component: () => import('../views/jobs/Jobs.vue'),
    meta: { auth: true },
  },
  {
    path: '/busqueda-laboral/:slug',
    name: 'jobs.show',
    component: () => import('../views/jobs/Show.vue'),
    meta: { auth: true },
  },
  {
    path: '/busqueda-laboral/crear',
    name: 'jobs.create',
    component: () => import('../views/jobs/form/Form.vue'),
    meta: { auth: true },
  },
  {
    path: '/busqueda-laboral/favoritos',
    name: 'jobs.favorites',
    component: () => import('../views/jobs/Favorites.vue'),
    meta: { auth: true },
  },
  {
    path: '/busqueda-laboral/job/:slug',
    name: 'jobs.edit',
    component: () => import('../views/jobs/form/Form.vue'),
    meta: { auth: true },
  },
  {
    path: '/busqueda-laboral/usuario',
    name: 'jobs.own',
    component: () => import('../views/jobs/MyJobs.vue'),
    meta: { auth: true },
  },
  {
    path: '/form',
    component: () => import('../views/Form.vue'),
  },
  {
    path: '/cursos',
    name: 'courses.index',
    component: () => import('../views/courses/Courses.vue'),
  },
  {
    path: '/cursos/hisotry',
    name: 'courses.history',
    component: () => import('../views/courses/History.vue'),
    meta: { auth: true },
  },
  {
    path: '/curso/:slug',
    name: 'courses.show',
    component: () => import('../views/courses/Detail.vue'),
  },
  {
    path: '/cursos/inscripcion-exitosa',
    name: 'courses.success',
    component: () => import('../views/courses/Success.vue'),
    meta: { auth: true },
  },
  {
    path: '/cursos/desinscripcion-exitosa',
    name: 'courses.unenroll.success',
    component: () => import('../views/activities/SuccessUnenroll.vue'),
    meta: { auth: true },
  },
  {
    path: '/inscripciones/:id/datos-bancarios',
    name: 'inscripciones.accountData',
    component: () => import('../views/inscriptions/AccountData.vue'),
    meta: { auth: true },
  },
  {
    path: '/inscripciones/:id/subir-comprobante',
    name: 'inscripciones.attachProof',
    component: () => import('../views/inscriptions/AttachProof.vue'),
    meta: { auth: true },
  },
  {
    path: '/contacto',
    name: 'contacto',
    component: () => import('../views/contacto/Contacto.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((route, from, next) => {
  if (route.meta?.auth && !ApiToken.isSet()) {
    // Preservamos el destino para volver después del login (returnUrl).
    return next({ name: 'login', query: { redirect: route.fullPath } })
  }

  // Gate de perfil incompleto: si el usuario está logueado y profile_complete es
  // explícitamente false, forzamos completar los datos antes de operar en la app.
  if (ApiToken.isSet()) {
    const { profileComplete } = useCurrentUser()
    if (profileComplete.value === false && route.name !== 'complete-profile') {
      return next({ name: 'complete-profile' })
    }
  }

  next()
})

export default router
