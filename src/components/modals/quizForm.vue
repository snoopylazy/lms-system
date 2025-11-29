<template>
  <Dialog :visible="open" @update:visible="val => open = val" modal :style="{ width: '95vw', maxWidth: '60rem' }" class="p-2 scrollbar-gold"
    @hide="handleClose('close')" position="top" draggable closable>

    <!-- Custom Header -->
    <template #header>
      <div class="flex items-center space-x-2 text-primary-text border-b-2 border-primary-border w-full p-1">
        <i class="fa-solid fa-clipboard-question"></i>
        <span class="font-semibold">
          {{ isEditDoc ? 'Edit Quiz' : 'Create New Quiz' }}
        </span>
      </div>
    </template>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4 max-h-[70vh] overflow-y-auto p-4">
      <!-- Name & Type -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
          <label for="name" class="block font-semibold mb-1 text-primary-text">
            Name <span class="text-red-500">*</span>
          </label>
          <InputText id="name" v-model="name" placeholder="e.g., Past Tense Quiz"
            class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
            required />
        </div>
        <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
          <label for="type" class="block font-semibold mb-1 text-primary-text">
            Type <span class="text-red-500">*</span>
          </label>
          <Select v-model="type" :options="quizTypes" optionLabel="label" optionValue="value" placeholder="Select quiz type"
            class="w-full border border-primary-border rounded-md focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
            required />
        </div>
      </div>

      <!-- Level and Teacher -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
          <label for="level" class="block font-semibold mb-1 text-primary-text">
            Level <span class="text-red-500">*</span>
          </label>
          <Select v-model="levelId" :options="levels" optionLabel="name" optionValue="_id"
            placeholder="Select a level"
            class="w-full border border-primary-border rounded-md focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
            required />
        </div>
        <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
          <label for="teacher" class="block font-semibold mb-1 text-primary-text">
            Teacher <span class="text-red-500">*</span>
          </label>
          <Select v-model="teacherId" :options="teachers" optionLabel="name" optionValue="_id"
            placeholder="Select a teacher"
            class="w-full border border-primary-border rounded-md focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
            required />
        </div>
      </div>

      <!-- Dynamic Questions Section -->
      <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <label class="block font-semibold text-primary-text">
            Questions <span class="text-red-500">*</span> ({{ questions.length }})
          </label>
          <Button type="button" label="Add Question" icon="pi pi-plus" size="small"
            @click="addQuestion"
            class="px-4 py-2 rounded-md bg-primary-default text-primary-text hover:bg-primary-hover transition" />
        </div>
        <div v-if="questions.length > 0" class="space-y-4">
          <div v-for="(q, qIndex) in questions" :key="qIndex"
            class="p-4 border border-primary-border rounded-md bg-gray-50">
            <div class="flex items-start justify-between mb-2 gap-3">
              <div class="flex items-center gap-4">
                <h4 class="font-semibold text-primary-text">Question {{ qIndex + 1 }}</h4>
                <Select v-model="q.type" :options="quizTypes" optionLabel="label" optionValue="value" class="w-48 text-sm" @change="onQuestionTypeChange(q)" />
              </div>
              <Button type="button" icon="pi pi-trash" severity="danger" size="small" text
                @click="removeQuestion(qIndex)" />
            </div>

            <!-- Question Text -->
            <div class="mb-3">
              <label class="block text-sm font-medium mb-1 text-primary-text">
                Question Text <span class="text-red-500">*</span>
              </label>
              <Textarea v-model="q.question" placeholder="Enter question" rows="2"
                class="w-full p-2 border border-primary-border rounded-md text-sm focus:border-primary-focus focus:ring-1 focus:ring-primary-light transition-all duration-200"
                required />
            </div>

            <!-- Dynamic Options/Correct Based on Type -->
              <div v-if="q.type === 'multiple-choice'" class="mb-3">
              <label class="block text-sm font-medium mb-1 text-primary-text">Options (add 4+)</label>
              <div class="space-y-2">
                <div v-for="(opt, oIdx) in q.options" :key="oIdx" class="flex items-center gap-2">
                  <InputText v-model="q.options[oIdx]" :placeholder="`Option ${oIdx + 1}`"
                    class="flex-1 p-2 border border-primary-border rounded-md text-sm" required />
                  <Button v-if="q.options.length > 2" type="button" icon="pi pi-times"
                    severity="danger" size="small" text @click="q.options.splice(oIdx, 1)" />
                </div>
                <Button type="button" label="Add Option" icon="pi pi-plus" size="small" text
                  @click="q.options.push('')" />
              </div>
              <label class="block text-sm font-medium mb-1 text-primary-text mt-2">Correct Option Index (0-based) *</label>
              <InputText v-model.number="q.correctAnswer" type="number" min="0" placeholder="e.g., 0"
                class="w-full p-2 border border-primary-border rounded-md text-sm" required />
            </div>

            <div v-else-if="q.type === 'true-false'" class="mb-3">
              <label class="block text-sm font-medium mb-1 text-primary-text">Correct Answer *</label>
              <Select v-model="q.correctAnswer" :options="['true', 'false']" placeholder="True or False"
                class="w-full border border-primary-border rounded-md text-sm" required />
            </div>

            <div v-else-if="q.type === 'fill-blank'" class="mb-3">
              <label class="block text-sm font-medium mb-1 text-primary-text">Correct Fill-in Text *</label>
              <InputText v-model="q.correctAnswer" placeholder="e.g., 'walked'"
                class="w-full p-2 border border-primary-border rounded-md text-sm" required />
              <small class="text-gray-500 block mt-1">Enter the exact correct answer text</small>
            </div>

            <!-- Explanation -->
            <div class="mt-3">
              <label class="block text-sm font-medium mb-1 text-primary-text">Explanation (Optional)</label>
              <InputText v-model="q.explanation" placeholder="Helpful note for users"
                class="w-full p-2 border border-primary-border rounded-md text-sm" />
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-500">
          No questions added yet. Click "Add Question" to start.
        </div>
      </div>

      <!-- Status -->
      <div class="field flex items-center space-x-3 p-3 rounded-md border border-gray-200 shadow-sm">
        <ToggleSwitch id="status" v-model="status" :binary="true" class="" />
        <label for="status" class="font-semibold cursor-pointer text-primary-text">Active</label>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3 mt-6 sticky bottom-0 bg-white pt-4 border-t">
        <button type="button" @click="handleClose('close')" :disabled="loading"
          class="px-6 py-2 rounded-full font-semibold text-primary-text bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
          Close
        </button>
        <button type="submit"
          class="px-6 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary active:scale-95 transition-all duration-200">
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
              </circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ isEditDoc ? 'Saving...' : 'Creating...' }}
          </span>
          <span v-else>{{ isEditDoc ? 'Save' : 'Create' }}</span>
        </button>
      </div>
      <p v-if="questions.length === 0 && !loading" class="text-red-500 text-sm mt-2">* At least one question is required</p>
    </form>
  </Dialog>
</template>

<script setup>
import useDocument from '@/composables/useDocument'
import { fetchAllDoc } from '@/composables/getDocument'
import { fetchTimestamp } from '@/services/timeStamp'
import { useBranchStore } from '@/store/branch'
import { ref, onMounted } from 'vue'

const props = defineProps({
  visible: Boolean,
  isEditDoc: Boolean,
  doc: Object,
})
const emit = defineEmits(['onClose'])
const branchStore = useBranchStore()

const name = ref('')
const type = ref('')
const questions = ref([]) // New: Array of objects { question, type, options?, correctAnswer, explanation? }
const levelId = ref(null)
const teacherId = ref(null)
const status = ref(true)
const loading = ref(false)
const open = ref(false)
const levels = ref([])
const teachers = ref([])

const quizTypes = ref([
  { label: 'Multiple Choice', value: 'multiple-choice' },
  { label: 'True/False', value: 'true-false' },
  { label: 'Fill in the Blank', value: 'fill-blank' },
  { label: 'Matching', value: 'matching' },
  { label: 'Essay', value: 'essay' }
])

onMounted(async () => {
  if (props.visible) open.value = props.visible

  await Promise.all([fetchLevels(), fetchTeachers()])

  if (props.isEditDoc) {
    name.value = props.doc.name || ''
    type.value = props.doc.type || 'multiple-choice'
    // Support both old structure (arrays) and new nested structure (objects)
    const rawQ = props.doc.questions || []
    questions.value = rawQ.map((q, idx) => {
      if (q && q.question) {
        // already in new format
        return {
          question: q.question || '',
          type: q.type || 'multiple-choice',
          options: q.options?.length ? q.options.slice() : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: q.correctAnswer ?? (q.correctAnswers ? q.correctAnswers[0] : 0),
          explanation: q.explanation || ''
        }
      }
      // old format: q holds just question text
      return {
        question: q || '',
        type: type.value,
        options: props.doc.answers?.[idx] || ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: props.doc.correctAnswers?.[idx] || 0,
        explanation: ''
      }
    })
    levelId.value = props.doc.levelId || null
    teacherId.value = props.doc.teacherId || null
    status.value = props.doc.status ?? true
  } else {
    handleClear()
  }
})

const fetchLevels = async () => {
  try {
    const data = await fetchAllDoc('Level', {
      dynamicConditions: [{ field: "status", operator: "==", value: true }]
    })
    levels.value = data || []
  } catch (error) {
    console.error('Error fetching levels:', error)
    levels.value = []
  }
}

const fetchTeachers = async () => {
  try {
    const data = await fetchAllDoc('Teacher', {
      dynamicConditions: [{ field: "status", operator: "==", value: true }]
    })
    teachers.value = data || []
  } catch (error) {
    console.error('Error fetching teachers:', error)
    teachers.value = []
  }
}

const addQuestion = () => {
  questions.value.push({
    question: '',
    type: 'multiple-choice',
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: 0,
    explanation: ''
  })
}

const onQuestionTypeChange = (q) => {
  if (!q) return
  if (q.type === 'multiple-choice') {
    q.options = q.options && q.options.length ? q.options : ['Option A', 'Option B', 'Option C', 'Option D']
    q.correctAnswer = (q.correctAnswer !== undefined && q.correctAnswer !== null) ? q.correctAnswer : 0
  } else if (q.type === 'true-false') {
    q.options = ['true', 'false']
    q.correctAnswer = (q.correctAnswer === 'true' || q.correctAnswer === 'false') ? q.correctAnswer : 'true'
  } else if (q.type === 'fill-blank') {
    q.options = []
    q.correctAnswer = q.correctAnswer || ''
  } else {
    // generic default
    q.options = q.options || []
  }
}

const removeQuestion = (index) => {
  questions.value.splice(index, 1)
}

const handleClear = () => {
  name.value = ''
  type.value = ''
  questions.value = []
  levelId.value = null
  teacherId.value = null
  status.value = true
}

const handleClose = (status) => {
  open.value = false
  handleClear()
  setTimeout(() => emit('onClose', status), 100)
}

const handleSubmit = async () => {
  if (questions.value.length === 0) {
    alert('Please add at least one question')
    return
  }
  // Validate based on type
  for (let i=0; i<questions.value.length; i++) {
    const q = questions.value[i]
    if (!q.question || typeof q.question !== 'string' || q.question.trim() === '') {
      alert(`Question ${i+1} requires question text`)
      return
    }

    if (q.type === 'multiple-choice') {
      if (!q.options || q.options.length < 2) { alert('Multiple-choice needs at least 2 options!'); return }
      // correctAnswer can be 0
      if (q.correctAnswer === null || q.correctAnswer === undefined || q.correctAnswer === '') { alert(`Question ${i+1}: please provide a valid correct option index`); return }
    } else if (q.type === 'true-false') {
      if (q.correctAnswer !== 'true' && q.correctAnswer !== 'false') { alert(`Question ${i+1}: correct answer must be 'true' or 'false'`); return }
    } else if (q.type === 'fill-blank') {
      if (!q.correctAnswer || String(q.correctAnswer).trim() === '') { alert(`Question ${i+1}: fill-blank requires a correct text`); return }
    }
    // other types are accepted but not strictly validated here
  }

  try {
    loading.value = true
    const timestamp = await fetchTimestamp()
    const { getValidUserId } = await import('@/composables/getUserId')
    const userId = await getValidUserId(true)

    const { add, update } = useDocument('Quiz')
    const requestBody = {
      fields: {
        name: name.value.trim(),
        type: type.value,
        questions: questions.value,
        levelId: levelId.value,
        teacherId: teacherId.value,
        status: status.value,
      }
    }

    if (!props.isEditDoc) {
      requestBody.fields.createdAt = timestamp
      requestBody.fields.createdBy = userId
      const response = await add(requestBody)
      if (response?.status === 200) handleClose('add')
    } else {
      requestBody.fields.updatedAt = timestamp
      requestBody.fields.updatedBy = userId
      const response = await update(requestBody, props.doc._id)
      if (response?.status === 200) handleClose('update')
    }
  } catch (err) {
    console.error('Error submitting form:', err)
  } finally {
    loading.value = false
  }
}
</script>