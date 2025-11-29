<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white">
    <!-- Enhanced Navigation -->
    <nav class="bg-black/30 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm text-white">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-bold text-white">OpenCourse</h1>
          <nav class="text-sm text-gray-500" aria-label="Breadcrumb">
            <ol class="flex items-center gap-2">
              <li><router-link to="/" class="hover:text-blue-600">Home</router-link></li>
              <li><span>/</span></li>
              <li class="text-gray-900 font-medium">Grammar Library</li>
            </ol>
          </nav>
        </div>
        <!-- <div class="flex gap-4">
          <button @click="goBack" class="text-white/90 hover:text-white font-medium flex items-center gap-1">←
            Back</button>
          <router-link to="/" class="text-white/90 hover:text-white font-medium">Home</router-link>
        </div> -->
      </div>
    </nav>

    <!-- Main Content -->
    <div class="p-6 max-w-6xl mx-auto">
      <!-- Header with Search Integration -->
      <header class="mb-8 fade-in text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-4xl font-bold text-white">Grammar Library</h1>
            <p class="text-white/80 text-lg mt-2">Master English with 50+ interactive lessons. Filter by level or search
              topics.</p>
          </div>
          <button @click="goBack" class="text-blue-600 hover:underline text-sm font-medium">← Back to Home</button>
        </div>
      </header>

      <!-- Enhanced Filters -->
      <section class="mb-8 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-sm fade-in">
        <div class="flex flex-col md:flex-row gap-4">
          <input v-model="query" @input="onSearch" placeholder="Search lessons (e.g., 'past tense')"
            class="flex-1 border-2 rounded-xl px-5 py-3 text-base focus:outline-none focus:border-white/60 bg-white/5 shadow-inner placeholder:text-white/70 text-white" />
          <select v-model="selectedGrammar" @change="filterByGrammar"
            class="border-2 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 bg-black">
            <option value="">All Topics</option>
            <option value="tense">Tenses</option>
            <option value="subject">Subjects</option>
            <option value="verb">Verbs</option>
          </select>
          <button @click="resetFilters" class="bg-black px-6 py-3 rounded-xl hover:bg-gray-400 font-medium transition">
            Reset
          </button>
        </div>
      </section>

      <!-- Lessons Grid -->
      <section class="fade-in">
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="h-56 rounded-xl p-6 border border-white/10 bg-white/5 animate-pulse">
          </div>
        </div>
        <div v-else-if="filtered.length === 0" class="text-center py-12 text-white/80 fade-in">
          <p v-if="query">No lessons match "{{ query }}". Try a different search!</p>
          <p v-else>No lessons yet—explore featured ones on home.</p>
        </div>
        <div v-if="grouped.length > 0" class="space-y-8">
          <section v-for="group in grouped" :key="group.level" class="fade-in">
            <h3 class="text-xl font-semibold text-white mb-4">{{ group.level }} ({{ group.items.length }})</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <router-link v-for="g in group.items" :key="g._id || g.id"
                    :to="{ name: 'ClientLessonView', params: { id: g._id || g.id } }"
                class="block group bg-white/5 rounded-xl p-6 border border-white/10 hover:shadow-xl hover:border-white/20 transition-all overflow-hidden">
                <div class="h-48 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition"
                  :class="'bg-white/5'">
                </div>
                <h3 class="font-bold text-xl text-white mb-2 group-hover:text-white transition">{{ g.name }}</h3>
                <p class="text-white/80 text-sm line-clamp-2 mb-4">{{ g.description }}</p>
                <div class="flex items-center justify-between text-sm text-white/80">
                  <div class="flex items-center gap-3">
                    <span class="px-2 py-1 bg-white/5 rounded-full">{{ teachersMap[g.teacherId] || 'Staff' }}</span>
                    <span class="px-2 py-1 bg-white/5 rounded-full">{{ (g.quizId?.length || 0) ? (g.quizId.length * 2 + 3) + ' mins' : '—' }}</span>
                  </div>
                  <span class="text-blue-200 font-medium">Start →</span>
                </div>
              </router-link>
            </div>
          </section>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link v-for="g in filtered" :key="g._id || g.id"
            :to="{ name: 'ClientLessonView', params: { id: g._id || g.id } }"
            class="block group bg-white/5 rounded-xl p-6 border border-white/10 hover:shadow-xl hover:border-white/20 transition-all overflow-hidden fade-in">
            <div class="h-48 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition"
              :class="'bg-white/5'">
            </div>
            <h3 class="font-bold text-xl text-white mb-2 group-hover:text-white transition">{{ g.name }}</h3>
            <p class="text-white/80 text-sm line-clamp-2 mb-4">{{ g.description }}</p>
            <div class="flex items-center justify-between text-sm text-white/80">
              <div class="flex items-center gap-3">
                <span class="px-2 py-1 bg-white/5 rounded-full">{{ teachersMap[g.teacherId] || 'Staff' }}</span>
                <span class="px-2 py-1 bg-white/5 rounded-full">{{ (g.quizId?.length || 0) ? (g.quizId.length * 2 + 3) + ' mins' : '—' }}</span>
              </div>
              <span class="text-blue-200 font-medium">Start →</span>
            </div>
          </router-link>
        </div>
      </section>

      <!-- Stats with Motivation -->
      <section
        class="mt-12 bg-gradient-to-r from-black/20 to-black/10 rounded-xl p-8 text-center border border-white/10 fade-in">
        <h3 class="text-2xl font-bold text-white mb-2">Ready to Level Up?</h3>
        <p class="text-white/90 text-lg">
          <span class="font-bold text-white">{{ filtered.length }}</span> topics to explore. Consistent practice makes
          perfect!
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import apiURL from '@/services/apiURL'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'GrammarLessonListNew',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const lessons = ref([])
    const loading = ref(false)
    const teachersMap = ref({})
      const levelsMap = ref({})
      const levels = ref([])
    const query = ref('')
    const selectedGrammar = ref('')

    const load = async () => {
      loading.value = true
      try {
        const res = await axios.get(`${apiURL}/lms/api/getAllDocs/Grammar`)
        lessons.value = res.data?.data || []
          // fetch teachers to display on cards
        const tRes = await axios.get(`${apiURL}/lms/api/getAllDocs/Teacher`, { params: { dynamicConditions: JSON.stringify([{ field: 'status', operator: '==', value: true }]) } })
        const tList = tRes.data?.data || []
        teachersMap.value = tList.reduce((acc, t) => { acc[t._id || t.id] = t.name || t.username || 'Teacher'; return acc }, {})
        // load level names so we can group lessons by level
        const lvRes = await axios.get(`${apiURL}/lms/api/getAllDocs/Level`, { params: { dynamicConditions: JSON.stringify([{ field: 'status', operator: '==', value: true }]) } })
        const lvlList = lvRes.data?.data || []
        levels.value = lvlList
        levelsMap.value = lvlList.reduce((acc, l) => { acc[l._id || l.id] = l.name || l.title || 'Level'; return acc }, {})
      } catch (e) {
        console.error('Failed to load grammar', e)
      }
      loading.value = false
    }

    const onSearch = () => {
      // triggers computed reactivity
    }

    const filterByGrammar = () => {
      // Grammar type filter
    }

    const resetFilters = () => {
      query.value = ''
      selectedGrammar.value = ''
    }

    const goBack = () => {
      router.back()
    }

    const formatLevel = (levelId) => Array.isArray(levelId) ? levelId[0] || 'Beginner' : levelId || 'Beginner'

    const filtered = computed(() => {
      let result = lessons.value

      if (query.value) {
        const q = query.value.toLowerCase()
        result = result.filter(x =>
          (x.name || '').toLowerCase().includes(q) ||
          (x.description || '').toLowerCase().includes(q)
        )
      }

      if (selectedGrammar.value) {
        result = result.filter(x =>
          (x.name || '').toLowerCase().includes(selectedGrammar.value)
        )
      }

      return result
    })

    // Group filtered lessons by level id/name so the UI shows grammar grouped by lesson/level
    const grouped = computed(() => {
      const groups = {}
      filtered.value.forEach((item) => {
        // normalize level id/value
        let lid = item.levelId
        if (Array.isArray(lid)) lid = lid[0]
        // if it's an object (populated), try its name first then fall back to _id
        let nameKey = null
        if (lid && typeof lid === 'object') {
          nameKey = lid.name || lid.title || lid._id || lid.id
        } else {
          nameKey = lid
        }
        const name = levelsMap.value[nameKey] || (typeof lid === 'object' ? (lid.name || 'General') : 'General')
        if (!groups[name]) groups[name] = []
        groups[name].push(item)
      })
      // convert to array of { level, items }
      return Object.keys(groups).map((k) => ({ level: k, items: groups[k] }))
    })

    onMounted(load)
    // expose teachers map to template and keep other values
    return { lessons, loading, query, onSearch, selectedGrammar, filterByGrammar, resetFilters, goBack, filtered, formatLevel, teachersMap, grouped, levels, levelsMap }
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>