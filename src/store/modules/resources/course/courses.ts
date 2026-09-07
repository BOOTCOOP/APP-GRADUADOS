import axios from '@/libs/axios'

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
          .get(`courses`, {params: filters})
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Show
    fetch(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`courses/${id}`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Own
    own() {
      return new Promise((resolve, reject) => {
        axios
          .get(`courses/own`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // History
    // Recibe { page, per_page, filters } de InfinitePagination: sin reenviarlos
    // el scroll infinito volvía a pedir siempre la página 1.
    history(ctx, filters = {}) {
      return new Promise((resolve, reject) => {
        axios
          .get(`courses/history`, {params: filters})
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Inscripción
    enroll(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .post(`courses/${id}/enroll`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Pre inscripción
    preEnroll(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .post(`courses/${id}/pre-enroll`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Adjuntar comprobante
    attachProof(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .post(`inscriptions/${id}/attach-proof`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
