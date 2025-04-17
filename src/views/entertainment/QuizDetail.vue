<template>
    <graduados-app header-title="Trivia" :header-show-back-button="true" body="white">
        <div v-if="quiz">
          <h2>{{ quiz.title }}</h2>
          <p>{{ quiz.description }}</p>
          <div v-if="quiz.questions && quiz.questions.length">
            <div
              v-for="question in quiz.questions"
              :key="question.id"
              class="question-block"
            >
              <p class="question-text">{{ question.question }}</p>
              <!-- Para preguntas de opción múltiple, usamos checkboxes forzando una sola selección -->
              <div v-if="question.type === 'multiple_choice'">
                <ion-list>
                  <ion-item 
                    v-for="option in question.options" 
                    :key="option.id" 
                    button 
                    @click="selectOption(question.id, option.id)"
                  >
                    <ion-checkbox 
                      slot="start" 
                      :checked="answers[question.id] === option.id"
                      readonly
                    ></ion-checkbox>
                    <ion-label>{{ option.option_text }}</ion-label>
                  </ion-item>
                </ion-list>
              </div>
              <!-- Para preguntas abiertas -->
              <div v-else>
                <ion-input
                  v-model="answers[question.id]"
                  placeholder="Tu respuesta"
                ></ion-input>
              </div>
            </div>
            <ion-button expand="block" @click="submitQuiz">
              Submit Quiz
            </ion-button>
          </div>
          <div v-else>
            <p>No hay preguntas para este quiz.</p>
          </div>
        </div>
        <div v-else>
          <ion-spinner name="crescent"></ion-spinner>
          <p>Cargando trivia...</p>
        </div>
    </graduados-app>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, reactive, computed, watch } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute, useRouter } from 'vue-router'
  import { toastController } from '@ionic/vue'
  
  export default defineComponent({
    name: 'QuizDetail',
    setup() {
      const store = useStore()
      const route = useRoute()
      const router = useRouter()
      const quizId = route.params.id
  
      // Cargar el quiz al montar el componente
      onMounted(() => {
        store.dispatch('quizzes/fetchQuiz', quizId)
      })
  
      const quiz = computed(() => store.state.quizzes.currentQuiz)
      // Objeto reactivo para almacenar las respuestas por pregunta
      const answers = reactive({})
  
      // Cuando se cargue el quiz, inicializamos cada respuesta con null
      watch(quiz, (newQuiz) => {
        if (newQuiz && newQuiz.questions) {
          newQuiz.questions.forEach(question => {
            if (!(question.id in answers)) {
              answers[question.id] = null
            }
          })
          console.log("Quiz actualizado, respuestas inicializadas:", JSON.parse(JSON.stringify(answers)))
        }
      }, { immediate: true })
  
      // Watch profundo para ver cambios en answers (depuración)
      watch(answers, (val) => {
        console.log("Respuestas actualizadas:", JSON.parse(JSON.stringify(val)))
      }, { deep: true })
  
      // Función para presentar un toast
      const presentToast = async (message: string) => {
        const toast = await toastController.create({
          message,
          duration: 2000,
          position: 'bottom'
        })
        toast.present()
      }
  
      // Función para seleccionar una opción (única por pregunta)
      const selectOption = (questionId: number, optionId: number) => {
        console.log(`Seleccionado para pregunta ${questionId}: ${optionId}`)
        answers[questionId] = optionId
      }
  
      const submitQuiz = async () => {
        console.log("Intentando enviar quiz con respuestas:", JSON.parse(JSON.stringify(answers)))
        if (quiz.value && quiz.value.questions) {
          // Se consideran sin responder aquellas preguntas cuyo valor sea null
          const unanswered = quiz.value.questions.filter(q => answers[q.id] === null)
          if (unanswered.length > 0) {
            await presentToast('Por favor, responda todas las preguntas.')
            console.log("Preguntas sin responder:", unanswered)
            return
          }
        } else {
          await presentToast('No se encontraron preguntas.')
          return
        }
  
        const payload = {
          quiz_id: quizId,
          answers: Object.entries(answers).map(([question_id, quiz_option_id]) => ({
            question_id,
            quiz_option_id,
          })),
        }
        try {
          await store.dispatch('quizzes/submitQuiz', payload)
          await presentToast('Respuestas enviadas correctamente.')
          router.push({ name: 'QuizList' })
        } catch (error) {
          console.error("Error al enviar el quiz:", error)
          await presentToast('Error al enviar las respuestas.')
        }
      }
  
      return { quiz, answers, submitQuiz, selectOption }
    },
  })
  </script>
  
  <style scoped>
  .question-block {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
  }
  .question-text {
    font-weight: bold;
    margin-bottom: 10px;
  }
  </style>
  