<template>
  <div class="text-primary-text animate-fade-up">
    <h2 class="text-primary-dark text-lg font-bold mb-2">Quiz</h2>

    <div
      class="border-2 border-primary-border p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 my-4 bg-white rounded-xl shadow-sm">
      <!-- Row selector -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <Select v-model="pageSize" :options="optionPageSize" option-label="value" option-value="value"
          placeholder="Select a row" size="small" class="w-full sm:w-30 md:w-40 border rounded-xl" />
      </div>

      <!-- Search input -->
      <div class="w-full md:w-[30%] flex items-center">
        <InputText v-model="searchQuery" type="text" placeholder="Search by name"
          class="w-full rounded-xl border border-primary-border p-3 focus:border-primary-focus focus:ring-1 focus:ring-primary-focus transition shadow-inner" />
      </div>

      <!-- Add button -->
      <div class="flex items-center justify-end">
        <Button 
          label="Create" icon="pi pi-plus-circle" iconPos="left"
          @click="handlePopOpenform('add', null)"
          class="h-10 px-6 rounded-xl bg-primary-default text-primary-text hover:bg-primary-hover transition shadow-md" />
      </div>
    </div>

    <!-- table -->
    <div class="mt-10 bg-white rounded-xl overflow-hidden shadow-lg">

      <!-- Responsive Table Wrapper -->
      <div class="overflow-x-auto">
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <table class="min-w-full text-center w-full" :class="{ 'opacity-50': isLoading }">
          <!-- Table Head -->
          <thead class="bg-primary-light text-primary-dark text-xs uppercase whitespace-nowrap">
            <tr>
              <th class="px-4 py-3 border border-primary-border font-bold">ID</th>
              <th class="px-4 py-3 border border-primary-border font-bold">Name</th>
              <th class="px-4 py-3 border border-primary-border font-bold">Type</th>
              <th class="px-4 py-3 border border-primary-border font-bold">Level</th>
              <th class="px-4 py-3 border border-primary-border font-bold">Teacher</th>
              <th class="px-4 py-3 border border-primary-border font-bold">Questions</th>
              <th class="px-4 py-3 border border-primary-border font-bold">Created By</th>
              <th class="px-4 py-3 border border-primary-border font-bold">Created At</th>
              <th class="px-4 py-3 border border-primary-border font-bold">Status</th>
              <th class="px-4 py-3 border border-primary-border font-bold">Actions</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="text-primary-text text-sm" v-if="quizData.length > 0">
            <tr class="hover:bg-gray-50 transition whitespace-nowrap" v-for="(item, index) in quizData"
              :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-25'">
              <td class="px-4 py-3 border border-primary-border font-medium">{{ index + 1 }}</td>
              <td class="px-4 py-3 border border-primary-border font-semibold">{{ item.name }}</td>
              <td class="px-4 py-3 border border-primary-border">
                <span class="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-medium">
                  {{ item.type || 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-3 border border-primary-border">
                <span class="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
                  {{ getLevelName(item.levelId) || 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-3 border border-primary-border">
                <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  {{ getTeacherName(item.teacherId) || 'N/A' }}
                </span>
              </td>
              <td class="px-4 py-3 border border-primary-border">
                <span class="font-semibold text-primary-dark">{{ item.questions?.length || 0 }}</span>
              </td>
              <td class="px-4 py-3 border border-primary-border">
                {{ getUserName(item.createdBy) || 'N/A' }}
              </td>
              <td class="px-4 py-3 border border-primary-border">{{ formatDate(item.createdAt) }}</td>
              <td class="px-4 py-3 border border-primary-border">
                <div @click="handleChangeStatus(item)"
                  class="cursor-pointer inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition"
                  :class="item.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                  <i :class="item.status ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                  <span>{{ item.status ? 'Active' : 'Inactive' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 border border-primary-border">
                <div class="flex justify-center gap-3">
                  <i 
                    @click="handlePopOpenform('edit', item)"
                    class="fa-solid fa-pen-to-square cursor-pointer hover:text-yellow-500 transform hover:scale-110 transition duration-200 text-lg"
                    title="Edit"
                  ></i>
                  <i 
                    @click="handleConfirmDetele(item)"
                    class="fa-solid fa-trash cursor-pointer hover:text-red-500 transform hover:scale-110 transition duration-200 text-lg"
                    title="Delete"
                  ></i>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="10" class="py-8 text-center text-gray-500">No quizzes found. Create one to get started!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Dynamic Modal (for forms, delete, etc.) -->
    <component :is="currentComponent" 
      v-if="openForm" 
      :visible="openForm" 
      :is-edit="isEditDoc" 
      :doc="docData" 
      :category="elementCategory" 
      :name="elementName" 
      @on-close="handleListenEmitEvent" 
      @update="handleListenEmitEvent"
      @delete="handleListenEmitEvent"
      @status-change="handleListenEmitEvent"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import apiURL from '@/services/apiURL'
import QuizForm from '@/components/modals/quizForm.vue' // Adjust path
import ConfirmationDelete from '@/components/confirmationdelete.vue' // Assume path
import ChangeStatus from '@/components/changestatus.vue' // Assume path
import ToastedMessage from '@/components/toastmessage.vue' // Assume path
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'

// Refs
const quizData = ref([])
const isLoading = ref(false)
const searchQuery = ref('')
const pageSize = ref(10)
const optionPageSize = ref([{ value: 10 }, { value: 25 }, { value: 50 }])
const openForm = ref(false)
const currentComponent = ref(null)
const isEditDoc = ref(false)
const docData = ref(null)
const elementCategory = ref(null)
const elementName = ref(null)
const isLastRecordOnPage = ref(false)
const currentPageIsLastRecord = ref(null)
const showToast = ref(false)
const informMessage = ref('')
const isFailed = ref(false)

// Caches
const userCache = ref({})
const levelCache = ref({})
const teacherCache = ref({})

// Load all quizzes
const loadQuizzes = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(`${apiURL}/lms/api/getAllDocs/Quiz`)
    quizData.value = res.data?.data || []
    handleListenToPagination(quizData.value)
  } catch (e) {
    console.error('Failed to load quizzes', e)
  }
  isLoading.value = false
}

// Format date
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString()
}

// Fetch user by ID (with cache)
const fetchUserById = async (userId) => {
  if (!userId) return null
  if (userCache.value[userId]) return userCache.value[userId]
  try {
    const params = {
      dynamicConditions: JSON.stringify([{ field: '_id', operator: '==', value: userId }])
    }
    const response = await axios.get(`${apiURL}/lms/api/getAllDocs/User`, { params })
    const user = response.data.data[0] || null
    if (user) userCache.value[userId] = user
    return user
  } catch (err) {
    console.error('Failed to fetch user:', err)
    return null
  }
}

// Similar for level and teacher (from snippet)
const fetchLevelById = async (levelId) => {
  if (!levelId || levelCache.value[levelId]) return levelCache.value[levelId]
  try {
    const params = { dynamicConditions: JSON.stringify([{ field: '_id', operator: '==', value: levelId }]) }
    const response = await axios.get(`${apiURL}/lms/api/getAllDocs/Level`, { params })
    const level = response.data.data[0] || null
    if (level) levelCache.value[levelId] = level
    return level
  } catch (err) {
    console.error('Failed to fetch level:', err)
    return null
  }
}

const fetchTeacherById = async (teacherId) => {
  if (!teacherId || teacherCache.value[teacherId]) return teacherCache.value[teacherId]
  try {
    const params = { dynamicConditions: JSON.stringify([{ field: '_id', operator: '==', value: teacherId }]) }
    const response = await axios.get(`${apiURL}/lms/api/getAllDocs/Teacher`, { params })
    const teacher = response.data.data[0] || null
    if (teacher) teacherCache.value[teacherId] = teacher
    return teacher
  } catch (err) {
    console.error('Failed to fetch teacher:', err)
    return null
  }
}

const getUserName = (userId) => userCache.value[userId]?.displayName || userCache.value[userId]?.username || 'Loading...'
const getLevelName = (levelId) => levelCache.value[levelId]?.name || 'Loading...'
const getTeacherName = (teacherId) => teacherCache.value[teacherId]?.name || 'Loading...'

// Handlers
const handleListenToPagination = async (items) => {
  quizData.value = items || []
  if (items && items.length > 0) {
    const userIds = [...new Set(items.map(item => item.createdBy).filter(Boolean))]
    const levelIds = [...new Set(items.map(item => item.levelId).filter(Boolean))]
    const teacherIds = [...new Set(items.map(item => item.teacherId).filter(Boolean))]
    await Promise.all([
      ...userIds.map(fetchUserById),
      ...levelIds.map(fetchLevelById),
      ...teacherIds.map(fetchTeacherById)
    ])
  }
}

const handleListenIsLoading = (status) => isLoading.value = status
const handleListenIsLastRecordOnPage = (status) => currentPageIsLastRecord.value = status

const handlePopOpenform = (status, item) => {
  if (status === 'add') {
    openForm.value = true
    currentComponent.value = QuizForm
  } else {
    isEditDoc.value = true
    docData.value = item
    openForm.value = true
    currentComponent.value = QuizForm
  }
}

const handleConfirmDetele = (item) => {
  docData.value = item
  elementCategory.value = "Quiz"
  elementName.value = item.name
  openForm.value = true
  currentComponent.value = ConfirmationDelete
  if (quizData.value.length === 1 && currentPageIsLastRecord.value > 1) {
    isLastRecordOnPage.value = true
  }
}

const handleChangeStatus = (item) => {
  docData.value = item
  elementCategory.value = "Quiz"
  elementName.value = item.name
  openForm.value = true
  currentComponent.value = ChangeStatus
}

const handleListenEmitEvent = (status) => {
  if (status === 'add' || status === 'create') {
    informMessage.value = "Data has been created successfully!"
    showToast.value = true
    isFailed.value = false
    openForm.value = false
    currentComponent.value = ToastedMessage
    isEditDoc.value = false
    docData.value = null
    elementCategory.value = null
    elementName.value = null
    isLastRecordOnPage.value = null
  } else if (status === 'update') {
    informMessage.value = "Data has been updated successfully!"
    searchQuery.value = ""
    showToast.value = true
    currentComponent.value = ToastedMessage
    isFailed.value = false
    openForm.value = false
    isEditDoc.value = false
    docData.value = null
    elementCategory.value = null
    elementName.value = null
    isLastRecordOnPage.value = null
  } else if (status === 'close') {
    showToast.value = false
    isFailed.value = false
    openForm.value = false
    currentComponent.value = ""
    isEditDoc.value = false
    docData.value = null
    elementCategory.value = null
    elementName.value = null
    isLastRecordOnPage.value = null
  } else if (status === 'delete') {
    informMessage.value = "Data has been deleted successfully!"
    searchQuery.value = ""
    showToast.value = true
    currentComponent.value = ToastedMessage
    isFailed.value = false
    openForm.value = false
    isEditDoc.value = false
    docData.value = null
    elementCategory.value = null
    elementName.value = null
    isLastRecordOnPage.value = null
  } else {
    showToast.value = false
    isFailed.value = false
    openForm.value = false
    isEditDoc.value = false
    docData.value = null
    currentComponent.value = ""
    elementCategory.value = null
    elementName.value = null
    isLastRecordOnPage.value = null
  }
  loadQuizzes() // Reload after changes
}

// Mount
onMounted(() => {
  loadQuizzes()
})
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.5s ease-out;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>