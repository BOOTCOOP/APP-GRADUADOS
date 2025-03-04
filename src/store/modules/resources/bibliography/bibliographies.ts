import axios from "@/libs/axios";

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // Obtener todas las bibliografías con paginación
    fetchAll(ctx, filters = {}) {
      return new Promise((resolve, reject) => {
        axios
          .get(`bibliographies`, { params: filters }) // Se mantiene como `bibliographies`
          .then((response) => {
            console.log(response.data.data); // ✅ Se accede directamente a `data`
            console.log(response.data.meta); // ✅ Se accede directamente a `data`
            resolve({
              data: response.data.data, // ✅ Extrae los datos correctamente
              meta: response.data.meta, // ✅ Extrae la paginación dentro de "meta"
            });
          }) // ✅ Se accede directamente a `data`
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
