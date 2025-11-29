<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white">
    <!-- Navigation (same as lessonview for consistency) -->
    <nav class="bg-black/30 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm text-white">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-white">OpenCourse</h1>
          <nav class="text-sm text-gray-500">
            <ol class="flex items-center gap-2">
              <li><router-link to="/" class="hover:text-blue-600">Home</router-link></li>
              <li><span>/</span></li>
              <li><router-link to="/client/grammar" class="hover:text-blue-600">Grammar</router-link></li>
              <li><span>/</span></li>
              <li class="text-white font-medium">Quiz: {{ quiz.name }}</li>
            </ol>
          </nav>
        </div>
        <!-- <div class="flex gap-4">
          <button @click="goBack" class="text-white/90 hover:text-white font-medium flex items-center gap-1">← Back</button>
          <router-link to="/" class="text-white/90 hover:text-white font-medium">Home</router-link>
        </div> -->
      </div>
    </nav>

    <!-- Main Content -->
    <div class="p-6 max-w-4xl mx-auto">
      <!-- Loading -->
      <div v-if="loading" class="space-y-4 py-8">
        <div class="h-8 w-1/2 bg-white/10 rounded animate-pulse mx-auto"></div>
        <div class="h-6 w-3/4 bg-white/5 rounded animate-pulse mx-auto"></div>
        <div class="h-12 w-full bg-white/5 rounded animate-pulse mx-auto max-w-3xl"></div>
      </div>

      <!-- Not Found -->
      <div v-else-if="!quiz._id && !quiz.id" class="bg-red-50/10 border border-red-200/20 rounded-xl p-8 text-center fade-in">
        <div class="text-red-200 mb-4">Quiz not found. Head back to lessons!</div>
        <button @click="goBack" class="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">← Go Back</button>
      </div>

      <!-- Quiz Content -->
      <div v-else class="space-y-6 fade-in">
        <!-- Header with Score Preview -->
        <section class="bg-white/5 border-2 border-white/10 rounded-xl p-6 shadow-sm">
          <h1 class="text-3xl font-bold text-white mb-2">{{ quiz.name || 'Quiz' }}</h1>
          <p class="text-white/80 text-lg mb-4">{{ quiz.description || `Test your knowledge with ${quiz.questions?.length || 0} questions.` }}</p>
          <div class="flex items-center justify-between text-sm text-white/70">
            <p><strong>Quiz ID:</strong> {{ quiz._id || quiz.id }}</p>
            <p><strong>Type:</strong> {{ quiz.type }}</p>
            <p><strong>Score:</strong> <span id="score" class="font-bold text-green-600">{{ score }} / {{ totalQuestions }}</span></p>
          </div>
        </section>

        <!-- Quiz Info -->
        <section class="bg-white/5 border-l-4 border-white/10 p-6 rounded-xl fade-in">
          <h3 class="font-bold text-xl text-white mb-3 flex items-center gap-2">Quiz Instructions</h3>
          <p class="text-white/80">Answer all questions. Use "Submit" to see results. Toggle "Show Answers" for explanations. Good luck!</p>
        </section>

        <!-- Questions -->
        <section v-if="quiz.questions && quiz.questions.length > 0" class="bg-white/5 border rounded-xl p-6 shadow-sm space-y-6">
          <h2 class="text-2xl font-bold text-white mb-4">Questions ({{ quiz.questions.length }})</h2>
          <div v-for="(q, idx) in quiz.questions" :key="idx" class="border-b pb-6 last:border-b-0">
            <h4 class="font-semibold text-lg mb-3 flex items-start gap-2 text-white">
              {{ idx + 1 }}. {{ q.question }}
              <span v-if="q.type !== 'fill-blank'" class="text-xs bg-gray-200 px-2 py-1 rounded-full">({{ q.type.replace('-', ' ') }})</span>
            </h4>

            <!-- Dynamic Rendering by Type -->
            <div v-if="q.type === 'multiple-choice'" class="space-y-2">
              <label v-for="(option, optIdx) in q.options" :key="optIdx" class="block p-3 border-2 rounded-lg cursor-pointer hover:bg-white/5 transition" :class="getAnswerClass(idx, optIdx)">
                <input type="radio" :name="`q${idx}`" :value="optIdx" v-model="userAnswers[idx]" class="mr-3" :disabled="showAnswers">
                <span>{{ option }}</span>
                <span v-if="showAnswers && optIdx === q.correctAnswer" class="ml-2 text-green-600 font-bold">✅ Correct!</span>
                <span v-else-if="showAnswers && userAnswers[idx] === optIdx && optIdx !== q.correctAnswer" class="ml-2 text-red-600 font-bold">❌ Incorrect</span>
              </label>
            </div>

            <div v-else-if="q.type === 'true-false'" class="space-y-2">
              <label class="block p-3 border-2 rounded-lg cursor-pointer hover:bg-white/5 transition" :class="getAnswerClass(idx, 'true')">
                <input type="radio" :name="`q${idx}`" value="true" v-model="userAnswers[idx]" class="mr-3" :disabled="showAnswers">
                <span>True</span>
                <span v-if="showAnswers && q.correctAnswer === 'true'" class="ml-2 text-green-600 font-bold">✅ Correct!</span>
              </label>
              <label class="block p-3 border-2 rounded-lg cursor-pointer hover:bg-white/5 transition" :class="getAnswerClass(idx, 'false')">
                <input type="radio" :name="`q${idx}`" value="false" v-model="userAnswers[idx]" class="mr-3" :disabled="showAnswers">
                <span>False</span>
                <span v-if="showAnswers && q.correctAnswer === 'false'" class="ml-2 text-green-600 font-bold">✅ Correct!</span>
              </label>
            </div>

            <div v-else-if="q.type === 'fill-blank'" class="space-y-2">
              <input 
                type="text" 
                v-model="userAnswers[idx]" 
                placeholder="Fill in the blank..." 
                class="w-full p-3 border-2 rounded-lg focus:outline-none focus:border-white/60 bg-white/5 text-white" 
                :disabled="showAnswers"
              >
              <p v-if="showAnswers" class="mt-2 p-3 bg-white/5 rounded-lg text-white/80">
                Correct: <span class="font-bold text-white">{{ q.correctAnswer }}</span>
              </p>
            </div>

            <!-- Explanation (if provided; add to schema later) -->
            <p v-if="showAnswers" class="mt-3 italic text-sm text-white/80 bg-yellow-50/10 p-3 rounded">
              Explanation: {{ q.explanation || 'Great job! Review the lesson for more practice.' }}
            </p>
          </div>
        </section>

        <section v-else class="bg-white/5 border-2 border-dashed border-white/10 rounded-xl p-8 text-center fade-in">
          <div class="text-6xl mb-4">⏳</div>
          <p class="text-white font-bold text-xl">Quiz questions are being prepared!</p>
          <p class="text-white/80 mt-2">Return to the lesson for now.</p>
        </section>

        <!-- Actions -->
        <section class="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row gap-4 justify-center fade-in">
          <button @click="resetQuiz" class="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 font-medium transition flex-1 sm:flex-none">
             Reset Quiz
          </button>
          <button @click="toggleAnswers" class="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 font-medium transition flex-1 sm:flex-none" :disabled="submitted">
            {{ showAnswers ? 'Hide Answers' : 'Show Answers' }}
          </button>
          <button @click="submitQuiz" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition flex-1 sm:flex-none" :disabled="submitted">
            Submit & Score
          </button>
          <button @click="goBack" class="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 font-medium transition sm:ml-auto">
            ← Back to Lesson
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import apiURL from '@/services/apiURL'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'QuizViewNew',
  props: { id: String },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const quiz = ref({})
    const loading = ref(false)
    const userAnswers = ref({})
    const showAnswers = ref(false)
    const submitted = ref(false)
    const totalQuestions = ref(0)
    const score = ref(0)

    const loadQuiz = async () => {
      loading.value = true
      try {
        const quizId = props.id || route.params.id
        const res = await axios.get(`${apiURL}/lms/api/getDocByMultipleId`, {
          params: { collectionName: 'Quiz', id: quizId }
        })
        if (res.data && res.data.length > 0) {
          quiz.value = res.data[0]
          totalQuestions.value = quiz.value.questions?.length || 0
        }
      } catch (e) {
        console.error('Failed to load quiz', e)
      }
      loading.value = false
    }

    // New: Submit logic
      const submitQuiz = () => {
        score.value = 0
        const questions = Array.isArray(quiz.value.questions) ? quiz.value.questions : []
        questions.forEach((q, idx) => {
          const userAns = userAnswers.value[idx]
          if (q && q.type === 'fill-blank') {
            if (userAns && q.correctAnswer && typeof q.correctAnswer === 'string' && userAns.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) score.value++
          } else if (q) {
            // loose equality to allow string/number comparison
            if (userAns == q.correctAnswer) score.value++
          }
        })
      submitted.value = true
      showAnswers.value = true
    }

    // New: Reset
    const resetQuiz = () => {
      userAnswers.value = {}
      showAnswers.value = false
      submitted.value = false
      score.value = 0
    }

    // New: Toggle answers
    const toggleAnswers = () => {
      showAnswers.value = !showAnswers.value
    }

    // New: Get class for answer feedback
    const getAnswerClass = (qIdx, optIdx) => {
      if (!showAnswers.value) return ''
      const questions = Array.isArray(quiz.value.questions) ? quiz.value.questions : []
      const q = questions[qIdx]
      if (!q) return ''
      const correct = q.correctAnswer
      // string/number tolerant comparators
      if (String(optIdx) === String(correct)) return 'bg-green-50 border-green-300'
      if (String(userAnswers.value[qIdx]) === String(optIdx) && String(optIdx) !== String(correct)) return 'bg-red-50 border-red-300'
      return ''
    }

    const goBack = () => router.back()

    watch(() => props.id, loadQuiz)
    watch(() => route.params.id, loadQuiz)
    onMounted(loadQuiz)

    return { quiz, loading, userAnswers, showAnswers, submitted, score, totalQuestions, goBack, submitQuiz, resetQuiz, toggleAnswers, getAnswerClass }
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>