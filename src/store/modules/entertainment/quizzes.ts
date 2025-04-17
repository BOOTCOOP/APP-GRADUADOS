// src/store/modules/entertainment/quizzes.ts
import axios from '@/libs/axios'

export default {
  namespaced: true,
  state: {
    quizzes: [],
    currentQuiz: null,
  },
  mutations: {
    setQuizzes(state, quizzes) {
      state.quizzes = quizzes
    },
    setCurrentQuiz(state, quiz) {
      state.currentQuiz = quiz
    },
  },
  actions: {
    async fetchQuizzes({ commit }) {
      const response = await axios.get('/quizzes')
      commit('setQuizzes', response.data)
    },
    async fetchQuiz({ commit }, quizId) {
      const response = await axios.get(`/quizzes/${quizId}`)
      commit('setCurrentQuiz', response.data)
    },
    async submitQuiz({ commit }, payload) {
      await axios.post('/quiz-responses', payload)
    },
  },
}
