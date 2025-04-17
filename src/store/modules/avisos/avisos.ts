import axios from "@/libs/axios"

interface Aviso {
  id: number
  title: string
  description: string
  file: string | null
  contact_phone: string
  contact_email: string
  status: string
  user_id: number
  created_at: string
  updated_at: string
}

interface AvisosState {
  avisos: Aviso[]
  currentAviso: Aviso | null
  loading: boolean
  error: string | null
}

const state: AvisosState = {
  avisos: [],
  currentAviso: null,
  loading: false,
  error: null,
}

const getters = {
  getAvisos: (state: AvisosState) => state.avisos,
  getCurrentAviso: (state: AvisosState) => state.currentAviso,
  isLoading: (state: AvisosState) => state.loading,
}

const actions = {
  async fetchAvisos({ commit }: any) {
    commit("SET_LOADING", true)
    try {
      const response = await axios.get("/avisos")
      console.log("Avisos API response:", response.data)
      // Extract the avisos array from the data property
      commit("SET_AVISOS", response.data.data || [])
      commit("SET_ERROR", null)
    } catch (error) {
      console.error("Error fetching avisos:", error)
      commit("SET_ERROR", "Error al cargar los avisos")
      commit("SET_AVISOS", [])
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async fetchAviso({ commit }: any, id: number) {
    commit("SET_LOADING", true)
    try {
      const response = await axios.get(`/avisos/${id}`)
      console.log("Aviso detail API response:", response.data)
      // Extract the aviso from the data property if it exists
      commit("SET_CURRENT_AVISO", response.data.data || response.data)
      commit("SET_ERROR", null)
    } catch (error) {
      console.error(`Error fetching aviso ${id}:`, error)
      commit("SET_ERROR", "Error al cargar el aviso")
      commit("SET_CURRENT_AVISO", null)
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async createAviso({ commit, dispatch }: any, formData: FormData) {
    commit("SET_LOADING", true)
    console.log("Creating aviso with data:", Object.fromEntries(formData.entries()))

    try {
      const response = await axios.post("/avisos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Create aviso API response:", response.data)
      commit("SET_ERROR", null)
      // Refresh the avisos list after creating a new one
      dispatch("fetchAvisos")
      return true
    } catch (error: any) {
      console.error("Error creating aviso:", error)
      console.error("Error response:", error.response?.data)
      commit("SET_ERROR", "Error al crear el aviso")
      return false
    } finally {
      commit("SET_LOADING", false)
    }
  },

  async cancelAviso({ commit, dispatch }: any, id: number) {
    commit("SET_LOADING", true)
    try {
      const response = await axios.delete(`/avisos/${id}`)
      console.log("Cancel aviso API response:", response.data)
      commit("SET_ERROR", null)
      // Refresh the avisos list after canceling
      dispatch("fetchAvisos")
      return true
    } catch (error) {
      console.error(`Error canceling aviso ${id}:`, error)
      commit("SET_ERROR", "Error al cancelar el aviso")
      return false
    } finally {
      commit("SET_LOADING", false)
    }
  },
}

const mutations = {
  SET_AVISOS(state: AvisosState, avisos: Aviso[]) {
    state.avisos = avisos
  },
  SET_CURRENT_AVISO(state: AvisosState, aviso: Aviso) {
    state.currentAviso = aviso
  },
  SET_LOADING(state: AvisosState, loading: boolean) {
    state.loading = loading
  },
  SET_ERROR(state: AvisosState, error: string | null) {
    state.error = error
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

