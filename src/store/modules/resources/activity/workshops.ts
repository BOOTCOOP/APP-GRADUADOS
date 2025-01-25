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
          .get(`workshops`, {params: filters})
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Show
    fetch(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`workshops/${id}`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Own
    own() {
      return new Promise((resolve, reject) => {
        axios
          .get(`workshops/own`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // History
    history() {
      return new Promise((resolve, reject) => {
        axios
          .get(`workshops/history`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Inscripción
    enroll(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .post(`workshops/${id}/enroll`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Pre inscripción
    preEnroll(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .post(`workshops/${id}/pre-enroll`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Desinscripción
    unenroll(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .post(`workshops/${id}/unenroll`)
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
