<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white">
    <nav class="bg-black/30 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm text-white">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-white">OpenCourse</h1>
          <nav class="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol class="flex items-center gap-2">
              <li><router-link to="/" class="hover:text-blue-600">Home</router-link></li>
              <li><span>/</span></li>
              <li class="text-gray-900 font-medium">Lessons</li>
            </ol>
          </nav>
        </div>
        <div>
          <router-link to="/client/grammar" class="text-white/80 hover:text-white">Grammar</router-link>
        </div>
      </div>
    </nav>

    <div class="p-6 max-w-6xl mx-auto">
      <header class="mb-8 fade-in text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold">Lessons</h1>
            <p class="text-white/80 mt-2">Browse lessons that may include quizzes and vocabulary. Click a card to open the lesson page.</p>
          </div>
        </div>
      </header>

      <section class="fade-in">
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="h-56 rounded-xl p-6 border border-white/10 bg-white/5 animate-pulse"></div>
        </div>

        <div v-else-if="lessons.length === 0" class="text-center py-12 text-white/80 fade-in">
          <p>No lessons yet — check admin to add Lesson documents.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link v-for="l in lessons" :key="l._id || l.id" :to="{ name: 'ClientLesson', params: { id: l._id || l.id } }"
            class="block group bg-white/5 rounded-xl p-6 border border-white/10 hover:shadow-xl hover:border-white/20 transition-all overflow-hidden">
            <div class="h-40 rounded-lg mb-4 bg-white/5 flex items-center justify-center"></div>
            <h3 class="font-bold text-xl text-white mb-2">{{ l.name }}</h3>
            <p class="text-white/80 text-sm line-clamp-2 mb-4">{{ l.description }}</p>
            <div class="flex items-center justify-between text-sm text-white/80">
              <div class="flex items-center gap-3">
                <span class="px-2 py-1 bg-white/5 rounded-full">{{ getLevelName(l) }}</span>
                <span class="px-2 py-1 bg-white/5 rounded-full">{{ (l.quizId?.length || 0) ? l.quizId.length + ' quizzes' : '—' }}</span>
              </div>
              <span class="text-blue-200 font-medium">Open →</span>
            </div>
          </router-link>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import apiURL from '@/services/apiURL'

const lessons = ref([])
const loading = ref(false)
const levelsMap = ref({})

const loadLevels = async () => {
  try {
    const res = await axios.get(`${apiURL}/lms/api/getAllDocs/Level`, { params: { dynamicConditions: JSON.stringify([{ field: 'status', operator: '==', value: true }]) } })
    const list = res.data?.data || []
    levelsMap.value = list.reduce((acc, l) => { acc[l._id || l.id] = l.name || l.title || 'Level'; return acc }, {})
  } catch (e) { console.error('failed load levels', e) }
}

const getLevelName = (item) => {
  const lid = Array.isArray(item.levelId) ? item.levelId[0] : item.levelId
  if (!lid) return 'General'
  if (typeof lid === 'object') return lid.name || lid.title || String(lid._id || lid.id).slice(0,6)
  return levelsMap.value[lid] || String(lid).slice(0,6)
}

const loadLessons = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiURL}/lms/api/getAllDocs/Lesson`)
    lessons.value = res.data?.data || []
    await loadLevels()
  } catch (e) {
    console.error('failed to load lessons', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadLessons)
</script>

<style scoped>
.fade-in { animation: fadeIn 0.5s ease-in; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden }
</style>
