import axios from '@/libs/axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // Index
    slider(ctx, filters = {}) {
      return new Promise((resolve, reject) => {
        axios
          .get(`slider/home`, {params: filters})
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    }
  }
}
