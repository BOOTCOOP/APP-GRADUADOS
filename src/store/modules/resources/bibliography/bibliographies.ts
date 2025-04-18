import axios from "@/libs/axios";

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
          .get(`bibliographies`, { params: filters })
          .then((response) => {
            console.log(response);
            resolve(response);
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

// fetch(ctx, id) {
//   return new Promise((resolve, reject  ) => {
//     fetch(`http://localhost:8000/bibliographies/${id}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(
//             `Error ${response.status}: ${response.statusText}`
//           )
//         }
//         return response
//       })
//       .then((response) => resolve(response))
//       .catch((error) => reject(error))
//   })
// },
