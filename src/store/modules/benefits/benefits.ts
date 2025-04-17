// src/store/modules/benefits/benefits.ts
import axios from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    benefits: [],
    currentBenefit: null,
  },
  mutations: {
    setBenefits(state, benefits) {
      state.benefits = benefits
    },
    setCurrentBenefit(state, benefit) {
      state.currentBenefit = benefit
    },
  },
  actions: {
    async fetchBenefits({ commit }) {
      try {
        const response = await axios.get('/benefits')
        console.log('Benefits API Response:', response)

        // Fix: Access the data array inside the response
        const benefitsData = response.data.data || response.data

        console.log('Benefits data to commit:', benefitsData)
        commit('setBenefits', benefitsData)
        return benefitsData
      } catch (error) {
        console.error('Error fetching benefits:', error)
        throw error
      }
    },
    async fetchBenefit({ commit }, id) {
      try {
        const response = await axios.get(`/benefits/${id}`)
        console.log('Benefit Detail API Response:', response)

        // Fix: Access the data object inside the response
        const benefitData = response.data.data || response.data

        console.log('Benefit data to commit:', benefitData)
        commit('setCurrentBenefit', benefitData)
        return benefitData
      } catch (error) {
        console.error('Error fetching benefit:', error)
        throw error
      }
    },
  },
}
