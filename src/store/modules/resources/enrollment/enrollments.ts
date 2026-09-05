import axios from '@/libs/axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // Inscripción múltiple ("mi selección"). Responde siempre 200 con
    // { enrolled, failed }: un ítem sin cupo no tumba a los demás, así que el
    // llamador tiene que mirar `failed` y no sólo el catch.
    batch(ctx, items) {
      return new Promise((resolve, reject) => {
        axios
          .post(`enrollments/batch`, { items })
          .then((response) => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
