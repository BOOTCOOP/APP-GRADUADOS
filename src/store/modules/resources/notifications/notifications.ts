import axios from '@/libs/axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // Index
    fetchAll(ctx, filters = {}) {
      console.log('🚀 STORE: Haciendo llamada a la API de notificaciones...');
      console.log('📋 Filtros enviados:', filters);
      
      return new Promise((resolve, reject) => {
        axios
          .get(`notifications`, {params: filters})
          .then((response) => {
            console.log('✅ STORE: Respuesta exitosa de notifications API:', response);
            resolve(response);
          })
          .catch(error => {
            console.error('❌ STORE: Error en notifications API:', error);
            reject(error);
          })
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
