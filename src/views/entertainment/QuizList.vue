
<template>
    <graduados-app header-title="Trivias">
        <div>
            <h1>Quizzes</h1>
            <ul>
            <li v-for="quiz in quizzes" :key="quiz.id">
                <router-link :to="{ name: 'QuizDetail', params: { id: quiz.id } }">
                {{ quiz.title }}
                </router-link>
            </li>
            </ul>
        </div>
    </graduados-app>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'QuizList',
  setup() {
    const store = useStore()

    // Dispatch the action to fetch quizzes when the component mounts
    onMounted(() => {
      store.dispatch('quizzes/fetchQuizzes')
    })

    // Define a computed property so it stays reactive
    const quizzes = computed(() => store.state.quizzes.quizzes)

    return { quizzes }
  },
})
</script>


<style scoped>
/* Agrega aquí tus estilos */
</style>
