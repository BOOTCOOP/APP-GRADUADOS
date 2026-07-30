import axios from '@/libs/axios'
// Axios sin interceptores ni baseURL: solo para el sitio legacy (ver `apply`).
import plainAxios from 'axios'

/**
 * Host del sitio web tradicional (derecho.uba.ar), donde vive el PHP de
 * postulaciones. Va por env para poder apuntar a testing sin tocar código:
 * hoy `https://testing.derecho.uba.ar`, en producción `https://www.derecho.uba.ar`.
 */
const LEGACY_WEB_URL = (
  import.meta.env.VITE_LEGACY_WEB_URL ?? 'https://www.derecho.uba.ar'
).replace(/\/$/, '')

const POSTULAR_PATH = '/graduados/admin/php/controllers/postularBusqueda.controller.php'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // Index
    fetchAll(ctx, filters = {}) {
      return new Promise((resolve, reject) => {
        axios
          .get(`jobs`, {params: filters})
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Show
    fetch(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`jobs/${id}`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Show
    store(ctx, data) {
      return new Promise((resolve, reject) => {
        axios
          .post(`jobs`, data)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Update
    update(ctx, data) {
      const id = data.id;
      return new Promise((resolve, reject) => {
        axios
          .put(`jobs/${id}`, data)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Delete
    delete(ctx, data) {
      const id = data.id || data;

      return new Promise((resolve, reject) => {
        axios
          .delete(`jobs/${id}`, data)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },
    // Own
    myPublications(ctx, filters = {}) {
      return new Promise((resolve, reject) => {
        axios
          .get(`jobs/own`, {params: filters})
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Status
    switchStatus(ctx, {id, status}) {
      return new Promise((resolve, reject) => {
        axios
          .post(`jobs/${id}/switchStatus`, {status})
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Favorites
    favorites(ctx, filters = {}) {
      return new Promise((resolve, reject) => {
        axios
          .get(`jobs/favorites`, {params: filters})
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    addFavorite(ctx, data) {
      const id = data.id || data.job?.id || data;
      
      return new Promise((resolve, reject) => {
        axios
          .post(`jobs/favorites/${id}`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    removeFavorite(ctx, data) {
      const id = data.id || data.job?.id || data;

      return new Promise((resolve, reject) => {
        axios
          .delete(`jobs/favorites/${id}`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    /**
     * Postulación a una búsqueda laboral.
     *
     * Pega DIRECTO al controller PHP del sitio web, el mismo que usa el
     * formulario de derecho.uba.ar. No pasa por la API Laravel.
     *
     * Tres cosas que hay que respetar de ese endpoint legacy:
     *
     * 1. **No usa la instancia de axios de la app** (`@/libs/axios`), a propósito:
     *    esa tiene `baseURL` de la API, manda el Bearer token en cada request
     *    (no queremos filtrarlo a otro host) y su interceptor de 401 cierra la
     *    sesión y redirige al login — un 401 del sitio legacy desloguearía al
     *    usuario. Acá se usa axios pelado con URL absoluta.
     *
     * 2. **Content-Type form-urlencoded**, no JSON: es un `$_POST` de PHP.
     *
     * 3. **Siempre responde HTTP 200**, con el resultado en el CUERPO como texto
     *    plano: `success` si registró la postulación, o el mensaje de error. Por
     *    eso el `.then` inspecciona el body y rechaza a mano; confiar en el
     *    código de estado daría todo por exitoso.
     *
     * Sobre CORS: funciona porque `CapacitorHttp` está habilitado en
     * capacitor.config.ts, así que en la app nativa los fetch/XHR salen por
     * código nativo y no hay preflight ni política de origen. En el build web
     * (GitHub Pages) el navegador sí va a bloquearlo salvo que el PHP devuelva
     * `Access-Control-Allow-Origin`.
     *
     * `verificacion` / `resultadoEsperado` son el "captcha" del formulario web:
     * una suma cuyo resultado esperado viaja en el mismo POST. No tiene sentido
     * pedírsela a alguien que ya inició sesión, así que se mandan iguales para
     * pasar la validación del PHP.
     */
    apply(ctx, data) {
      const id = data.id || data.job?.id;
      const verificacion = 7;

      // URLSearchParams => application/x-www-form-urlencoded
      const payload = new URLSearchParams({
        id_busqueda: String(id),
        nombre: data.nombre ?? '',
        apellido: data.apellido ?? '',
        email: data.email ?? '',
        dni: String(data.dni ?? ''),
        verificacion: String(verificacion),
        resultadoEsperado: String(verificacion),
      })

      return new Promise((resolve, reject) => {
        plainAxios
          .post(`${LEGACY_WEB_URL}${POSTULAR_PATH}`, payload.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          })
          .then((response) => {
            const body =
              typeof response.data === 'string' ? response.data.trim() : ''

            if (body === 'success') return resolve(response)

            // El PHP devolvió un motivo (ya postulado, búsqueda vencida, etc.):
            // lo propagamos para mostrarlo tal cual.
            reject({ legacyMessage: body || null, response })
          })
          .catch(error => reject(error))
      })
    },
  },
}
