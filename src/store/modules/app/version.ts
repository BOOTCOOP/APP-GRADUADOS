import axios from '@/libs/axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // Configuración pública de la app (min_version, latest_version, store_urls, message)
    fetch() {
      return new Promise((resolve, reject) => {
        axios
          .get(`app/config`)
          .then((response) => resolve(response.data))
          .catch(error => reject(error))
      })
    }
  }
}
