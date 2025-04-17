import axios from '@/libs/axios'

interface BibliographyState {
  items: any[]
  meta: any | null
  loading: boolean
  error: string | null
}

export default {
  namespaced: true,

  state: (): BibliographyState => ({
    items: [],
    meta: null,
    loading: false,
    error: null,
  }),

  getters: {
    allBibliographies: (state: BibliographyState) => state.items,
    isLoading: (state: BibliographyState) => state.loading,
    paginationMeta: (state: BibliographyState) => state.meta,
  },

  mutations: {
    SET_LOADING(state: BibliographyState, status: boolean) {
      state.loading = status
    },
    SET_ITEMS(state: BibliographyState, items: any[]) {
      state.items = items
    },
    SET_META(state: BibliographyState, meta: any) {
      state.meta = meta
    },
    SET_ERROR(state: BibliographyState, error: string | null) {
      state.error = error
    },
  },

  actions: {
    // Obtener todas las bibliografías con paginación
    fetchAll({ commit }, filters = {}) {
      commit('SET_LOADING', true)

      return new Promise((resolve, reject) => {
        axios
          .get(`bibliographies`, { params: filters })
          .then((response) => {
            console.log('API Response:', response.data)

            // Store the data in state via mutations
            commit('SET_ITEMS', response.data.data)
            commit('SET_META', response.data.meta)
            commit('SET_LOADING', false)

            // Format the response to match what InfinitePagination expects
            resolve({
              data: {
                data: response.data.data,
                meta: response.data.meta,
              },
            })
          })
          .catch((error) => {
            console.error('Error fetching bibliographies:', error)
            commit(
              'SET_ERROR',
              error.message || 'Error fetching bibliographies'
            )
            commit('SET_LOADING', false)
            reject(error)
          })
      })
    },

    // Show
    fetch({ commit }, id) {
      commit('SET_LOADING', true)

      return new Promise((resolve, reject) => {
        axios
          .get(`bibliographies/${id}`)
          .then((response) => {
            commit('SET_LOADING', false)
            resolve(response)
          })
          .catch((error) => {
            commit('SET_ERROR', error.message || 'Error fetching bibliography')
            commit('SET_LOADING', false)
            reject(error)
          })
      })
    },
  },
}
