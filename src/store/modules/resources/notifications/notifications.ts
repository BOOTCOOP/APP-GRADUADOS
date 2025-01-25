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
          .get(`notifications`, {params: filters})
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },

    // Mark as read
    markAsRead(ctx, data = {}) {
      return new Promise((resolve, reject) => {
        axios
          .post(`notifications/mark-as-read`, data)
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    }
  },
}
