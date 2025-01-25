import axios from '@/libs/axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // Courses
    courses() {
      return new Promise((resolve, reject) => {
        axios
          .get(`inscriptions/courses`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Workshops
    workshops() {
      return new Promise((resolve, reject) => {
        axios
          .get(`inscriptions/workshops`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Show
    fetch(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`inscriptions/${id}`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Adjuntar comprobante
    attachProof(ctx, {id, formData}) {
      return new Promise((resolve, reject) => {
        axios
          .post(`inscriptions/${id}/attach-proof`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
