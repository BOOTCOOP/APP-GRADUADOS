import axios from "@/libs/axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // Index (listar todas con filtros y paginación)
    fetchAll(ctx, filters = {}) {
      return new Promise((resolve, reject) => {
        axios
          .get(`bibliographies`, { params: filters })
          .then((response) => {
            console.log("📘 Respuesta de bibliographies:", response);
            resolve(response); // ✅ Igual que feeds
          })
          .catch((error) => reject(error));
      });
    },

    // Show
    fetch(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .get(`bibliographies/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
  },
};
