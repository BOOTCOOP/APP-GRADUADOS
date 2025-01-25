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
  },
}
