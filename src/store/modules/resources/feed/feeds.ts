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
          .get(`feeds`, {params: filters})
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Show
    fetch(ctx, slug) {
      return new Promise((resolve, reject) => {
        axios
          .get(`feeds/${slug}`)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
