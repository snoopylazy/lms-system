<template>
  <div class="page-root">
    <div class="bg-gradient-to-b from-blue-900 to-blue-800 min-h-screen">

      <!-- Hero Section with Title and Header Menu -->
      <div class="bg-black px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <!-- Left: Title -->
          <div class="flex items-center space-x-3">
            <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
              <span class="text-blue-400">English</span>
              <span class="text-red-400 ml-2">Lesson</span>
              <span class="text-purple-400 ml-2">Library</span>
            </h1>
          </div>

          <!-- Right: Header Menu -->
          <nav class="hidden md:flex items-center gap-4">
            <router-link to="/client/grammar" class="text-sm text-white/90 hover:text-blue-300 px-3 py-2 rounded-md hover:bg-white/5 transition">Grammar</router-link>
            <router-link :to="{ name: 'ClientLessonList' }" class="text-sm text-white/90 hover:text-blue-300 px-3 py-2 rounded-md hover:bg-white/5 transition">Lessons</router-link>
          </nav>

          <!-- Mobile menu (simple) -->
          <div class="md:hidden">
            <details class="text-white">
              <summary class="cursor-pointer">Menu</summary>
              <div class="mt-2 bg-white/5 rounded-md p-2 flex flex-col gap-1">
                <router-link to="/client/grammar" class="text-sm text-white/90 px-2 py-1 rounded hover:bg-white/10">Grammar</router-link>
                <router-link :to="{ name: 'ClientLessonList' }" class="text-sm text-white/90 px-2 py-1 rounded hover:bg-white/10">Lessons</router-link>
              </div>
            </details>
          </div>
        </div>
      </div>

      <!-- Lesson Cards  -->
      <div class="px-6 py-12">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <template v-if="loadingFeatured">
              <!-- Loading skeletons -->
              <div v-for="i in 6" :key="i" class="h-56 rounded-xl p-6 border border-white/10 bg-white/5 animate-pulse"></div>
            </template>
            <template v-else-if="featuredLessons.length > 0">
              <router-link v-for="(lesson, idx) in featuredLessons" :key="lesson._id || lesson.id"
                    :to="{ name: 'ClientLessonView', params: { id: lesson._id || lesson.id } }"
                :class="['relative block group rounded-xl p-6 border transition-all overflow-hidden fade-in hover:shadow-xl', chooseGradient(idx), 'border-gray-200 hover:border-blue-500']">
                <div class="h-48 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition">
                  <!-- image/graphic intentionally removed per styling request -->
                </div>
                <div class="absolute top-4 right-4 bg-white/75 px-3 py-1 rounded text-xs font-semibold">{{ lesson.name ? lesson.name.slice(0,18) : '' }}</div>
                <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition">{{ lesson.name }}
                </h3>
                <p class="text-white/90 text-sm line-clamp-2 mb-3">{{ lesson.description }}</p>
                <div class="flex items-center justify-between text-sm text-white/80">
                  <div class="flex items-center gap-3">
                    <span class="px-2 py-1 bg-white/10 rounded-full">{{ getTeacherNameForLesson(lesson) }}</span>
                    <span class="px-2 py-1 bg-white/10 rounded-full">{{ estimateDuration(lesson) }}</span>
                  </div>
                  <span class="text-blue-200 font-medium">Start →</span>
                </div>
              </router-link>
            </template>
            <template v-else>
              <div class="col-span-1 md:col-span-2 lg:col-span-3 border rounded-xl p-6 bg-white text-center text-gray-600">No featured lessons yet — check back later.</div>
            </template>
          </div>
        </div>
      </div>

      <!-- Welcome Section -->
      <section class="py-16 px-4 max-w-7xl mx-auto bg-gradient-to-b from-blue-900 to-blue-800">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 class="text-4xl font-bold mb-6 text-white">Welcome to Chinda!</h2>
            <p class="text-lg text-white leading-relaxed mb-8">
              Chinda has over 3,000 free listening lessons for all levels! Most activities have audio or video, a
              transcript, vocabulary lesson and interactive quiz.
            </p>

            <!-- Featured Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <router-link to="/client/grammar" class="block border rounded-lg overflow-hidden hover:shadow-lg transition bg-white">
                <!-- <img src="/placeholder.svg?height=200&width=300" alt="Grammar Lessons" class="w-full h-40 object-cover" /> -->
                <div class="p-4">
                  <h3 class="text-lg font-bold text-gray-900 mb-2">100+ Grammar Lessons</h3>
                  <p class="text-gray-600 text-sm">Learn grammar with conversations. Browse all grammar topics and study any lesson.</p>
                  <div class="mt-2 text-sm text-blue-600 font-semibold">Browse grammar →</div>
                </div>
              </router-link>

              <div class="border rounded-lg overflow-hidden hover:shadow-lg transition">
                <!-- <img src="/placeholder.svg?height=200&width=300" alt="Sign Up" class="w-full h-40 object-cover" /> -->
                <div class="p-4">
                  <h3 class="text-lg font-bold text-white mb-2">Sign up for Free Lessons</h3>
                  <p class="text-white-600 text-sm">Get lessons by email or join a course for free!</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side Featured Card -->
          <div>
            <div class="bg-gradient-to-br from-white/60 to-white p-0 rounded-lg overflow-hidden shadow-sm">
              <div v-if="levelsList.length > 0" class="flex h-72 items-stretch">
                <!-- show the first level as a featured level card -->
                <div :class="chooseGradient(0) + ' flex-1 p-6 flex flex-col justify-center'">
                  <div class="text-6xl font-black text-black">{{ levelsList[0]?.name || 'Level' }}</div>
                  <div class="mt-2 font-bold text-lg">{{ levelsList[0]?.description ? levelsList[0].description.slice(0,80) : 'Study beginner lessons and improve skills.' }}</div>
                  <router-link :to="{ name: 'ClientGrammar' }" class="mt-4 inline-block text-sm text-white font-semibold bg-black/20 px-4 py-2 rounded">Browse grammar →</router-link>
                  <router-link :to="{ name: 'ClientLessonList' }" class="mt-4 inline-block text-sm text-white font-semibold bg-black/20 px-4 py-2 rounded ml-2">Browse lessons →</router-link>
                </div>
                <div class="w-48 bg-white/30 p-4 flex flex-col justify-center items-start border-l">
                  <div class="text-xs text-gray-600">Top Level</div>
                  <div class="text-sm font-semibold text-gray-800 mt-1">{{ getLevelNamePreview(levelsList[0]) }}</div>
                </div>
              </div>
              <div v-else class="p-6 text-center text-gray-600">No levels yet — check admin to add Levels.</div>
            </div>
          </div>
        </div>

      </section>

      <section class="py-16 px-4 max-w-7xl mx-auto bg-gradient-to-b from-blue-900 to-blue-800">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>


            <!-- Featured Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div class="border rounded-lg overflow-hidden hover:shadow-lg transition">
                <!-- <img src="/placeholder.svg?height=200&width=300" alt="Grammar Lessons"
                  class="w-full h-40 object-cover" /> -->
                <div class="p-4">
                  <h3 class="text-lg font-bold text-blue-600 mb-2">100+ Grammar Lessons</h3>
                  <p class="text-white-600 text-sm">Learn grammar with conversations.</p>
                  <a href="#" class="text-blue-600 font-semibold text-sm mt-2 inline-block">500 Free Worksheets!</a>
                </div>
              </div>

              <div class="border rounded-lg overflow-hidden hover:shadow-lg transition">
                <!-- <img src="/placeholder.svg?height=200&width=300" alt="Sign Up" class="w-full h-40 object-cover" /> -->
                <div class="p-4">
                  <h3 class="text-lg font-bold text-blue-600 mb-2">Sign up for Free Lessons</h3>
                  <p class="text-white-600 text-sm">Get lessons by email or join a course for free!</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side Featured Card -->
          <div>
            <div class="bg-green-300 rounded-lg overflow-hidden">
              <!-- <img src="/placeholder.svg?height=300&width=400" alt="Beginner lessons"
                class="w-full h-72 object-cover" /> -->
              <div class="bg-green-100 p-6">
                <div class="flex items-center gap-4">
                  <div class="text-6xl font-black text-black">A1</div>
                  <div>
                    <div class="font-bold text-lg">Beginner</div>
                    <div class="font-bold text-lg">1-Minute</div>
                    <div class="font-bold text-lg">ESL Videos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import apiURL from '@/services/apiURL'

// const hoveredCard = ref(null)
const featuredLessons = ref([])
const levelsMap = ref({})
const levelsList = ref([])
const teachersMap = ref({})
const loadingFeatured = ref(false)

const gradients = [
  'bg-gradient-to-br from-indigo-50 to-indigo-200 text-gray-900',
  'bg-gradient-to-br from-rose-50 to-rose-200 text-gray-900',
  'bg-gradient-to-br from-lime-50 to-lime-200 text-gray-900',
  'bg-gradient-to-br from-yellow-50 to-yellow-200 text-gray-900',
  'bg-gradient-to-br from-fuchsia-50 to-fuchsia-200 text-gray-900',
  'bg-gradient-to-br from-cyan-50 to-sky-200 text-gray-900'
]

const chooseGradient = (i) => gradients[i % gradients.length] || gradients[0]

const formatLevel = (levelId) => {
  // fallback to id or array element
  if (Array.isArray(levelId)) return levelId[0] || 'Beginner'
  return levelId || 'Beginner'
}

const loadLevels = async () => {
  try {
    // load active levels and build a map of _id -> name
    const res = await axios.get(`${apiURL}/lms/api/getAllDocs/Level`, {
      params: {
        dynamicConditions: JSON.stringify([{ field: 'status', operator: '==', value: true }])
      }
    })
    const levels = res.data?.data || []
    levelsList.value = levels
    levelsMap.value = levels.reduce((acc, l) => { acc[l._id || l.id] = l.name || l.title || 'Level'; return acc }, {})
  } catch (err) {
    console.error('Failed to load levels', err)
  }
}

const getLevelNameForLesson = (lesson) => {
  if (!lesson) return 'Unknown'
  const lid = Array.isArray(lesson.levelId) ? lesson.levelId[0] : lesson.levelId
  if (!lid) return 'General'
  return levelsMap.value[lid] || String(lid).slice(0,6)
}

const getLevelNamePreview = (lvl) => {
  if (!lvl) return 'Level'
  return lvl.name || lvl.title || lvl._id?.slice(0,6) || 'Level'
}

const getTeacherNameForLesson = (lesson) => {
  if (!lesson) return 'Staff'
  const t = lesson.teacherId || lesson.teacher
  if (!t) return 'Staff'
  return teachersMap.value[t] || String(t).slice(0,6)
}

const estimateDuration = (lesson) => {
  const quizCount = Array.isArray(lesson.quizId) ? lesson.quizId.length : 0
  if (quizCount > 0) return `${Math.max(5, quizCount * 2 + 3)} mins`
  const len = (lesson.description || '').length
  if (len < 200) return '5 mins'
  if (len < 600) return '10 mins'
  return '15+ mins'
}

const loadTeachers = async () => {
  try {
    const res = await axios.get(`${apiURL}/lms/api/getAllDocs/Teacher`, {
      params: { dynamicConditions: JSON.stringify([{ field: 'status', operator: '==', value: true }]) }
    })
    const teachers = res.data?.data || []
    teachersMap.value = teachers.reduce((acc, t) => { acc[t._id || t.id] = t.name || t.username || 'Teacher'; return acc }, {})
  } catch (err) {
    console.error('Failed to load teachers', err)
  }
}

const loadFeatured = async () => {
  try {
    loadingFeatured.value = true
    const res = await axios.get(`${apiURL}/lms/api/getAllDocs/Grammar`, { params: { limit: 6 } })
    featuredLessons.value = res.data?.data || []
    // load levels and teachers map used to show readable names
    await Promise.all([loadLevels(), loadTeachers()])
  } catch (err) {
    console.error('Failed to load featured lessons', err)
  } finally {
    loadingFeatured.value = false
  }
}

onMounted(loadFeatured)
</script>

<style scoped></style>