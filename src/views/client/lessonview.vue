<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white">
    <!-- Enhanced Navigation with Breadcrumbs -->
    <nav class="bg-black/30 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm text-white">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-white">OpenCourse</h1>
          <nav class="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol class="flex items-center gap-2">
              <li><router-link to="/" class="hover:text-blue-600">Home</router-link></li>
              <li><span>/</span></li>
              <li><button @click="goBack" class="hover:text-blue-600 cursor-pointer bg-none border-none p-0">Back</button></li>
              <li><span>/</span></li>
              <li class="text-white font-medium">{{ lesson.name }}</li>
            </ol>
          </nav>
        </div>
        <!-- <div class="flex gap-4">
          <button @click="goBack" class="text-white/90 hover:text-white font-medium flex items-center gap-1">
            ← Back
          </button>
          <router-link to="/" class="text-white/90 hover:text-white font-medium">Home</router-link>
        </div> -->
      </div>
    </nav>

    <!-- Main Content -->
    <div class="p-6 max-w-6xl mx-auto">
      <!-- Header with Progress Indicator -->
      <header class="mb-8 fade-in">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">{{ lesson.name || 'Lesson' }}</h1>
            <p class="text-white/80 text-lg">{{ lesson.description || 'No description available.' }}</p>
          </div>
          <!-- <div class="text-right">
            <div class="w-full bg-white/10 rounded-full h-2 mb-2">
              <div class="bg-white/60 h-2 rounded-full" :style="{ width: '60%' }"></div>
            </div>
            <span class="text-sm text-white/80">60% Complete</span>
          </div> -->
        </div>
            <div class="flex gap-4 items-center text-sm flex-wrap">
          <span v-if="lesson.levelId" class="bg-white/10 text-white px-3 py-1 rounded-full">
            Level: {{ formatLevel(lesson.levelId) }}
          </span>
              <span v-if="source" class="bg-white/10 text-white px-3 py-1 rounded-full">Source: {{ source }}</span>
          <span v-if="teacherName" class="bg-white/10 text-white px-3 py-1 rounded-full">{{ teacherName }}</span>
          <span class="text-white/80">Last updated: {{ formatDate(lesson.updatedAt) }}</span>
          <span class="bg-white/10 text-white px-3 py-1 rounded-full">{{ estimateDuration(lesson) }}</span>
          <span v-if="lesson.status" class="bg-green-700/20 text-green-200 px-3 py-1 rounded-full">Active</span>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4 py-8">
        <div class="h-8 w-2/3 bg-white/10 rounded animate-pulse mx-auto"></div>
        <div class="h-48 bg-white/5 rounded-lg animate-pulse mx-auto max-w-4xl"></div>
        <div class="h-4 w-full bg-white/5 rounded animate-pulse"></div>
        <div class="h-4 w-5/6 bg-white/5 rounded animate-pulse"></div>
      </div>

      <!-- Not Found -->
      <div v-else-if="!lesson._id && !lesson.id"
        class="bg-yellow-50/10 border border-yellow-200/20 rounded-xl p-8 text-center fade-in">
        <div class="text-yellow-200 mb-4">Lesson not found. Please try again.</div>
        <div v-if="notFoundNote" class="text-sm text-yellow-100/80 mb-4">{{ notFoundNote }}</div>
        <div class="flex gap-4 justify-center">
          <button @click="goBack" class="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600">← Go Back</button>
          <router-link to="/client/lessons" class="bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20">Browse lessons →</router-link>
        </div>
      </div>

      <!-- Tabbed Content -->
      <div v-else class="space-y-6 fade-in">
        <!-- Tabs -->
        <div class="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div class="flex border-b">
            <button @click="activeTab = 'grammar'"
              :class="['px-6 py-4 font-semibold flex-1 text-center transition-colors', activeTab === 'grammar' ? 'bg-white/10 text-white border-b-2 border-white/20' : 'text-white/80 hover:bg-white/5']">
              Grammar
            </button>
            <button @click="activeTab = 'vocabulary'"
              :class="['px-6 py-4 font-semibold flex-1 text-center transition-colors', activeTab === 'vocabulary' ? 'bg-white/10 text-white border-b-2 border-white/20' : 'text-white/80 hover:bg-white/5']">
              Vocabulary
            </button>

            <button v-if="route.name === 'ClientLesson'" @click="activeTab = 'quiz'"
              :class="['px-6 py-4 font-semibold flex-1 text-center transition-colors', activeTab === 'quiz' ? 'bg-white/10 text-white border-b-2 border-white/20' : 'text-white/80 hover:bg-white/5']">
              Do Quiz ({{ Array.isArray(lesson.quizId) ? lesson.quizId.length : (lesson.quizId ? 1 : 0) }})
            </button>
          </div>

          <!-- Grammar Tab -->
          <div v-if="activeTab === 'grammar'" class="p-6">
            <h2 class="text-2xl font-bold mb-4 text-white">Lesson Content</h2>
            <div class="prose prose-lg max-w-none bg-white/5 p-6 rounded-lg text-white/90">
              <!-- Lesson Description at the top (only show if source is Lesson) -->
              <div v-if="source === 'Lesson'" class="mb-6 pb-6 border-b border-white/20">
                <h3 class="text-lg font-semibold text-white mb-2">{{ lesson.name }}</h3>
                <p class="leading-relaxed text-white/90">{{ lesson.description }}</p>
              </div>

              <!-- Grammar Content -->
              <div v-if="grammarData && grammarData._id">
                <h3 class="text-xl font-semibold text-white mb-4">{{ grammarData.name || 'Grammar Content' }}</h3>
                <p class="leading-relaxed mb-4">{{ grammarData.description }}</p>
                <!-- Example box -->
                <div class="bg-white/5 border-l-4 border-white/20 p-4 my-4 rounded">
                  <h4 class="font-semibold text-white mb-2">Example</h4>
                  <p class="text-white/80">This is a free study lesson. Use this content to understand the grammar concept. Practice with sentences below!</p>
                  <ul class="mt-2 list-disc list-inside text-white/80">
                    <li>Subject + Verb + Object</li>
                    <li>Example: I eat apple.</li>
                  </ul>
                </div>
                <!-- Motivational Quote -->
                <blockquote class="mt-6 italic text-center text-white/80 border-l-4 border-white/10 pl-4">"Grammar is the logic of speech." — Ralph Waldo Emerson</blockquote>
              </div>
              <div v-else class="text-white/80">
                <!-- <p>Grammar content is loading or not available.</p> -->
              </div>
            </div>
          </div>

          <!-- Vocabulary Tab -->
          <div v-if="activeTab === 'vocabulary'" class="p-6">
            <h2 class="text-2xl font-bold mb-4 text-white">Vocabulary</h2>
            <p class="text-white/80 mb-4">Words related to this lesson level. Practice pronunciation and review example sentences.</p>

            <div v-if="vocabLoading" class="space-y-2">
              <div class="h-10 bg-white/10 rounded animate-pulse"></div>
              <div class="h-10 bg-white/10 rounded animate-pulse"></div>
            </div>

            <div v-else-if="vocabularies.length === 0" class="bg-white/5 border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
              <p class="text-white/80 text-lg font-medium">No vocabulary found for this lesson's level.</p>
              <p class="text-white/60 mt-2">Check related lessons or try another topic.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(v, idx) in vocabularies" :key="v._id || v.id || idx" class="bg-white/5 p-4 rounded-lg border border-white/10">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-lg font-bold text-white">{{ v.word }}</div>
                    <div class="text-white/80 text-sm mt-1">{{ v.translation }}</div>
                  </div>
                  <div class="text-sm text-white/60 text-right">
                    <div>Pronunciation</div>
                    <div class="font-semibold text-white/90">{{ v.pronunciation }}</div>
                  </div>
                </div>
                <p class="text-white/70 mt-3 text-sm">Example: {{ v.example }}</p>
              </div>
            </div>
          </div>

          <!-- Quiz Tab (only show for Lesson documents) -->
          <div v-if="activeTab === 'quiz' && route.name === 'ClientLesson'" class="p-6">
            <h2 class="text-2xl font-bold mb-4 text-white">Test Your Knowledge</h2>
            <p class="text-white/80 mb-6">Take these quizzes to reinforce what you've learned. Aim for 80%+ to master
              the topic!</p>
            <div v-if="lesson.quizId && lesson.quizId.length > 0" class="space-y-4">
              <router-link v-for="(quiz, idx) in lesson.quizId" :key="quiz._id || quiz.id || idx"
                :to="{ name: 'ClientQuizView', params: { id: (quiz._id || quiz.id || quiz) } }"
                class="block bg-white/5 p-6 rounded-xl border border-white/10 hover:shadow-lg transition-all hover:scale-105">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-bold text-xl text-white">Quiz {{ idx + 1 }}: {{ quizName(quiz) || 'Practice' }}</h3>
                    <p class="text-sm text-white/80 mt-1">10 questions • 15 mins</p>
                  </div>
                  <div class="text-right">
                    <span class="text-green-600 text-3xl">Start</span>
                    <p class="text-sm font-medium text-green-700">Start Now</p>
                  </div>
                </div>
              </router-link>
            </div>
            <div v-else class="bg-white/5 border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
              <p class="text-white/80 text-lg font-medium">No quizzes yet—coming soon!</p>
              <p class="text-white/60 mt-2">Review the grammar above and practice manually.</p>
            </div>
          </div>
        </div>

        <!-- Navigation Section -->
        <section class="bg-white/5 border border-white/10 rounded-xl p-6 fade-in">
          <h3 class="font-bold text-lg mb-4 text-white">Navigation</h3>
          <div class="flex gap-4 flex-wrap">
            <button @click="prevLesson" v-if="hasPrevious"
              class="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 font-medium flex items-center gap-2 transition">
              ← Previous Lesson
            </button>
            <button @click="nextLesson" v-if="hasNext"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition">
              Next Lesson →
            </button>
            <router-link to="/client/grammar"
              class="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 font-medium flex items-center gap-2 transition">
              Back to Library
            </router-link>
          </div>
        </section>

        <!-- Lesson Details (Collapsible) -->
        <details class="mt-8 text-xs text-white/70 border-t border-white/10 pt-4 fade-in" open>
          <summary class="font-semibold cursor-pointer hover:text-white flex items-center gap-2 mb-2">Lesson Details
          </summary>
          <div class="space-y-1 text-white/80 pl-4">
            <p><strong>Name:</strong> {{ lesson.name }}</p>
            <p><strong>Created:</strong> {{ formatDate(lesson.createdAt) }}</p>
            <p><strong>Status:</strong> {{ lesson.status ? 'Active' : 'Inactive' }}</p>
          </div>
        </details>
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
  name: 'LessonViewNew',
  props: { id: String },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const lesson = ref({})
    const fetchAttempts = ref([])
    const notFoundNote = ref('')
    const source = ref('') // 'Grammar' or 'Lesson' - show what collection provided the doc
    const vocabularies = ref([])
    const vocabLoading = ref(false)
    const teacherName = ref('')
    const loading = ref(false)
    const allLessons = ref([])
    const levelNames = ref({}) // Cache for level id -> name mapping
    const grammarData = ref({}) // Grammar data for the lesson
    // Default tab. We'll set this properly after loading the document (based on source: Lesson vs Grammar)
    const activeTab = ref('grammar') // New: Tab state

    const formatDate = (date) => {
      if (!date) return 'N/A'
      try {
        return new Date(date).toLocaleDateString()
      } catch (e) {
        return 'N/A'
      }
    }

    const formatLevel = (levelId) => {
      // Support populated level objects and arrays of ids/objects
      if (Array.isArray(levelId)) {
        return levelId.map(l => {
          if (!l) return ''
          if (typeof l === 'object') return l.name || l.title || 'Unknown Level'
          // It's an ID string, check cache
          return levelNames.value[l] || 'Loading...'
        }).filter(Boolean).join(', ')
      }
      if (!levelId) return 'N/A'
      if (typeof levelId === 'object') return levelId.name || levelId.title || 'Unknown Level'
      // It's an ID string, check cache
      return levelNames.value[levelId] || 'Loading...'
    }

    const loadLevelNames = async (levelIds) => {
      // Filter out IDs we already have cached
      const idsToFetch = []
      if (Array.isArray(levelIds)) {
        levelIds.forEach(id => {
          const idStr = typeof id === 'object' ? (id._id || id.id) : id
          if (idStr && !levelNames.value[idStr]) {
            idsToFetch.push(idStr)
          }
        })
      } else if (levelIds && typeof levelIds === 'string' && !levelNames.value[levelIds]) {
        idsToFetch.push(levelIds)
      }

      if (idsToFetch.length === 0) return

      try {
        const res = await axios.get(`${apiURL}/lms/api/getAllDocs/Level`, {
          params: {
            dynamicConditions: JSON.stringify(idsToFetch.map(id => ({ field: '_id', operator: '==', value: id }))),
            limit: 100
          }
        })
        const levels = res.data?.data || []
        levels.forEach(level => {
          levelNames.value[level._id || level.id] = level.name || 'Unknown'
        })
      } catch (err) {
        console.warn('Failed to load level names', err)
      }
    }

    const loadGrammarData = async (grammarId) => {
      if (!grammarId) return
      try {
        const res = await axios.get(`${apiURL}/lms/api/getDocByMultipleId`, {
          params: {
            collectionName: 'Grammar',
            id: grammarId,
            populateFields: 'levelId,teacherId'
          }
        })
        const data = res.data
        console.log('Grammar data response:', data) // Debug log
        if (Array.isArray(data) && data.length > 0) {
          grammarData.value = data[0]
        } else if (data && typeof data === 'object' && data._id) {
          grammarData.value = data
        } else if (data && typeof data === 'object' && data.data && Array.isArray(data.data)) {
          // Handle case where data is wrapped in a data property
          grammarData.value = data.data[0] || {}
        } else {
          console.warn('Unexpected grammar data format:', data)
        }
      } catch (err) {
        console.warn('Failed to load grammar data', err)
      }
    }

    const estimateDuration = (lesson) => {
      const quizCount = Array.isArray(lesson.quizId) ? lesson.quizId.length : 0
      if (quizCount > 0) return `${Math.max(5, quizCount * 2 + 3)} mins`
      const len = (lesson.description || '').length
      if (len < 200) return '5 mins'
      if (len < 600) return '10 mins'
      return '15+ mins'
    }

    const loadLesson = async () => {
      loading.value = true
      try {
        const lessonId = props.id || route.params.id

        const tryFetch = async (collectionName) => {
          try {
            const r = await axios.get(`${apiURL}/lms/api/getDocByMultipleId`, { params: { collectionName, id: lessonId, populateFields: 'levelId,teacherId' } })
            const data = r.data
            const count = Array.isArray(data) ? data.length : (data ? 1 : 0)
            fetchAttempts.value.push({ collectionName, count })
            // Accept both array and single-object responses from the backend
            if (Array.isArray(data) && data.length > 0) return data[0]
            if (data && typeof data === 'object') return data
            return null
          } catch (err) {
            console.warn(`failed to load from ${collectionName}`, err)
            fetchAttempts.value.push({ collectionName, error: String(err?.message || err) })
            return null
          }
        }

        const preferLessonFirst = route.name === 'ClientLesson'

        let doc = null
        if (preferLessonFirst) {
          doc = await tryFetch('Lesson')
          if (!doc) doc = await tryFetch('Grammar')
        } else {
          doc = await tryFetch('Grammar')
          if (!doc) doc = await tryFetch('Lesson')
        }

        if (doc) {
          lesson.value = doc
          // Mark source using available signals:
          // - if we explicitly opened /client/lesson then it's a Lesson
          // - if the returned doc has quizId, prefer 'Lesson'
          // - otherwise treat as Grammar
          if (route.name === 'ClientLesson') source.value = 'Lesson'
          else if (doc.quizId && ((Array.isArray(doc.quizId) && doc.quizId.length) || (!Array.isArray(doc.quizId) && doc.quizId))) source.value = 'Lesson'
          else source.value = 'Grammar'

          // Ensure UI tab reflects the document source (Lesson -> quiz tab, Grammar -> grammar tab)
          activeTab.value = source.value === 'Lesson' ? 'quiz' : 'grammar'

          // Load level names if needed
          if (doc.levelId) {
            await loadLevelNames(doc.levelId)
          }

          // Load grammar data if lesson has grammarId
          // If the document itself is Grammar (source === 'Grammar'), use it directly
          if (source.value === 'Grammar') {
            grammarData.value = doc
          } else if (doc.grammarId) {
            await loadGrammarData(doc.grammarId)
          }
        }

        // fetch teacher name for display
        try {
          const tObj = lesson.value.teacherId || lesson.value.teacher
            if (tObj) {
            if (typeof tObj === 'object') teacherName.value = tObj.name || tObj.username || ''
            else {
              const tr = await axios.get(`${apiURL}/lms/api/getAllDocs/Teacher`, { params: { dynamicConditions: JSON.stringify([{ field: '_id', operator: '==', value: tObj }]) } })
              teacherName.value = tr.data?.data?.[0]?.name || ''
            }
          }
        } catch (err) {
          console.warn('failed to load teacher name', err)
        }

      } catch (e) {
        console.error('Failed to load lesson', e)
      } finally {
        loading.value = false
      }
    }

    const loadVocabularies = async () => {
      vocabularies.value = []
      vocabLoading.value = true
      try {
        // try to determine level id from lesson - supports array or single id
        const rawLevel = lesson.value.levelId
        let levelId = null
        if (Array.isArray(rawLevel)) levelId = rawLevel[0]
        else levelId = rawLevel

        // if level is a populated object, we need its id
        if (levelId && typeof levelId === 'object') levelId = levelId._id || levelId.id || levelId

        if (!levelId) {
          vocabularies.value = []
          vocabLoading.value = false
          return
        }

        const res = await axios.get(`${apiURL}/lms/api/getAllDocs/Vocabulary`, {
          params: {
            dynamicConditions: JSON.stringify([{ field: 'levelId', operator: '==', value: levelId }]),
            limit: 100
          }
        })

        vocabularies.value = res.data?.data || []
      } catch (e) {
        console.error('Failed to load vocabularies', e)
        vocabularies.value = []
      }
      vocabLoading.value = false
    }

    const loadAllLessons = async () => {
      try {
        // load both Grammar and Lesson collections so navigation covers both types
        const [gRes, lRes] = await Promise.all([
          axios.get(`${apiURL}/lms/api/getAllDocs/Grammar`),
          axios.get(`${apiURL}/lms/api/getAllDocs/Lesson`)
        ])
        const gList = gRes.data?.data || []
        const lList = lRes.data?.data || []
        // combine and deduplicate by id
        const combined = [...gList, ...lList]
        const map = {}
        combined.forEach(it => { map[it._id || it.id] = it })
        allLessons.value = Object.values(map)
      } catch (e) {
        console.error('Failed to load all lessons', e)
      }
    }

    const currentIndex = computed(() => {
      return allLessons.value.findIndex(x => (x._id || x.id) === (lesson.value._id || lesson.value.id))
    })

    const hasPrevious = computed(() => currentIndex.value > 0)
    const hasNext = computed(() => currentIndex.value < allLessons.value.length - 1 && allLessons.value.length > 0)

    const prevLesson = () => {
      if (hasPrevious.value) {
        const prev = allLessons.value[currentIndex.value - 1]
        // determine if prev is a Lesson (levelId is array) or Grammar
        // prefer lesson route when the item contains a quizId (typical for Lesson documents)
        const routeName = (Array.isArray(prev.quizId) && prev.quizId.length) || (prev.quizId && prev.quizId.length) ? 'ClientLesson' : 'ClientLessonView'
        router.push({ name: routeName, params: { id: prev._id || prev.id } })
      }
    }

    const nextLesson = () => {
      if (hasNext.value) {
        const next = allLessons.value[currentIndex.value + 1]
        const routeName = (Array.isArray(next.quizId) && next.quizId.length) || (next.quizId && next.quizId.length) ? 'ClientLesson' : 'ClientLessonView'
        router.push({ name: routeName, params: { id: next._id || next.id } })
      }
    }

    const goBack = () => {
      router.back()
    }

    // New: Placeholder for quiz name (fetch if needed) - robust for object or string
    const quizName = (quizItem) => {
      if (!quizItem) return ''
      if (typeof quizItem === 'string') return `Grammar Practice ${quizItem.slice(-4)}`
      if (typeof quizItem === 'object') {
        if (quizItem.name) return quizItem.name
        const id = quizItem._id || quizItem.id
        if (id) return `Grammar Practice ${String(id).slice(-4)}`
      }
      return ''
    }

    // Watchers and onMounted
    watch(() => props.id, () => { loadLesson() })
    watch(() => route.params.id, () => { loadLesson() })
    // If the route name changes (e.g. user navigates between grammar and lesson routes)
    // keep tab selection appropriate: quiz for the lesson route, grammar otherwise.
    watch(() => route.name, (newName) => {
      // Prefer source when available; otherwise fall back to route name
      if (source.value === 'Lesson' || newName === 'ClientLesson') activeTab.value = 'quiz'
      else activeTab.value = 'grammar'
    })
    // whenever lesson changes we should try to load vocabulary for the lesson's level
    watch(() => lesson.value, () => { loadVocabularies() })
    onMounted(async () => { await Promise.all([loadLesson(), loadAllLessons()]) })

    return {
      lesson, loading, formatDate, formatLevel, hasPrevious, hasNext, prevLesson, nextLesson, goBack,
      activeTab, quizName, teacherName, estimateDuration,
      vocabularies, vocabLoading, source, fetchAttempts, notFoundNote, route, levelNames, grammarData
    }
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>