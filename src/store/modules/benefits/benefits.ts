// src/store/modules/benefits/benefits.ts
import axios from "@/libs/axios";

export default {
  namespaced: true,
  state: {
    benefits: [],
    currentBenefit: null,
  },
  mutations: {
    setBenefits(state, benefits) {
      state.benefits = benefits;
    },
    setCurrentBenefit(state, benefit) {
      state.currentBenefit = benefit;
    },
  },
  actions: {
    async fetchBenefits({ commit }) {
      const response = await axios.get("/benefits");

      // Fix: Access the data array inside the response
      const benefitsData = response.data.data || response.data;

      commit("setBenefits", benefitsData);
      return benefitsData;
    },
    async fetchBenefit({ commit }, id) {
      const response = await axios.get(`/benefits/${id}`);

      // Fix: Access the data object inside the response
      const benefitData = response.data.data || response.data;

      commit("setCurrentBenefit", benefitData);
      return benefitData;
    },
  },
};
