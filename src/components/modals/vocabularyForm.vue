<template>
    <Dialog :visible="open" @update:visible="val => open = val" modal :style="{ width: '95vw', maxWidth: '52rem' }" class="p-2 scrollbar-gold"
        @hide="handleClose('close')" position="top" draggable closable>

        <!-- Custom Header -->
        <template #header>
            <div class="flex items-center space-x-2 text-primary-text border-b-2 border-primary-border w-full p-1">
                <i class="fa-solid fa-spell-check"></i>
                <span class="font-semibold">
                    {{ isEditDoc ? 'Edit Vocabulary' : 'Create New Vocabulary' }}
                </span>
            </div>
        </template>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-2">

            <!-- Word -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm col-span-1">
                <label for="word" class="block font-semibold mb-1 text-primary-text">
                    Word <span class="text-red-500">*</span>
                </label>
                <InputText id="word" v-model="word" :invalid="isExistWord" placeholder="Enter word"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
                <div v-if="isExistWord" class="mt-2">
                    <Message severity="error">Word already exists!</Message>
                </div>
            </div>

            <!-- Translation -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="translation" class="block font-semibold mb-1 text-primary-text">
                    Translation <span class="text-red-500">*</span>
                </label>
                <InputText id="translation" v-model="translation" placeholder="Enter translation"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
            </div>

            <!-- Pronunciation -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="pronunciation" class="block font-semibold mb-1 text-primary-text">
                    Pronunciation <span class="text-red-500">*</span>
                </label>
                <InputText id="pronunciation" v-model="pronunciation" placeholder="Enter pronunciation (e.g., /həˈləʊ/)"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
            </div>

            <!-- Example -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="example" class="block font-semibold mb-1 text-primary-text">
                    Example <span class="text-red-500">*</span>
                </label>
                <Textarea id="example" v-model="example" placeholder="Enter example sentence" rows="2"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
            </div>

            <!-- Level and Teacher -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Level -->
                <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                    <label for="level" class="block font-semibold mb-1 text-primary-text">
                        Level <span class="text-red-500">*</span>
                    </label>
                    <Select v-model="levelId" :options="levels" optionLabel="name" optionValue="_id"
                        placeholder="Select a level"
                        class="w-full border border-primary-border rounded-md focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                        required />
                </div>

                <!-- Teacher -->
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

            <!-- Status -->
            <div class="field flex items-center space-x-3">
                <ToggleSwitch id="status" v-model="status" :binary="true" class="" />
                <label for="status" class="font-semibold cursor-pointer text-primary-text">Status</label>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3 mt-6">
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
                    <span v-else> {{ isEditDoc ? 'Save' : 'Create' }}</span>

                </button>
            </div>

        </form>
    </Dialog>

</template>

<script setup>
import useDocument from '@/composables/useDocument';
import { fetchAllDoc } from '@/composables/getDocument';
import { fetchTimestamp } from '@/services/timeStamp';
import { useBranchStore } from '@/store/branch';
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
    visible: Boolean,
    isEditDoc: Boolean,
    doc: Object,
});
const emit = defineEmits(['onClose']);
const branchStore = useBranchStore();

const word = ref('');
const originalWord = ref(null);
const translation = ref('');
const pronunciation = ref('');
const example = ref('');
const levelId = ref(null);
const teacherId = ref(null);
const status = ref(true);
const isExistWord = ref(null);
const loading = ref(false);
const open = ref(false);
const levels = ref([]);
const teachers = ref([]);

onMounted(async () => {
    if (props.visible) {
        open.value = props.visible;
    }

    // Fetch levels and teachers
    await Promise.all([fetchLevels(), fetchTeachers()]);

    if (props.isEditDoc) {
        word.value = props.doc.word || '';
        originalWord.value = props.doc.word || '';
        translation.value = props.doc.translation || '';
        pronunciation.value = props.doc.pronunciation || '';
        example.value = props.doc.example || '';
        levelId.value = props.doc.levelId || null;
        teacherId.value = props.doc.teacherId || null;
        status.value = props.doc.status ?? true;
    } else {
        // Clear form for add mode
        handleClear();
    }
});

// Fetch all levels
const fetchLevels = async () => {
    try {
        const data = await fetchAllDoc('Level', {
            dynamicConditions: [
                {
                    field: "status",
                    operator: "==",
                    value: true
                }
            ]
        });
        levels.value = data || [];
    } catch (error) {
        console.error('Error fetching levels:', error);
        levels.value = [];
    }
};

// Fetch all teachers
const fetchTeachers = async () => {
    try {
        const data = await fetchAllDoc('Teacher', {
            dynamicConditions: [
                {
                    field: "status",
                    operator: "==",
                    value: true
                }
            ]
        });
        teachers.value = data || [];
    } catch (error) {
        console.error('Error fetching teachers:', error);
        teachers.value = [];
    }
};

// Watch for duplicate word
watch(word, async (newV) => {
    if (word.value == originalWord.value && word.value !== null) {
        return;
    } else {
        if (newV) {
            originalWord.value = null;
            const dataExist = await fetchAllDoc('Vocabulary', {
                dynamicConditions: [
                    {
                        field: "word",
                        operator: "==",
                        value: newV
                    }
                ]
            });

            if (dataExist.length > 0) {
                isExistWord.value = true;
            } else {
                isExistWord.value = null;
            }
        } else {
            isExistWord.value = null;
        }
    }
}, { deep: true });

const handleClear = () => {
    word.value = '';
    originalWord.value = null;
    translation.value = '';
    pronunciation.value = '';
    example.value = '';
    levelId.value = null;
    teacherId.value = null;
    isExistWord.value = null;
    status.value = true;
}

// Close modal
const handleClose = (status) => {
    open.value = false;
    handleClear();
    setTimeout(() => {
        emit('onClose', status);
    }, 100);
};

// Submit form
const handleSubmit = async () => {
    try {
        loading.value = true;
        const timestamp = await fetchTimestamp();

        // Validate for duplicate word
        if (isExistWord.value == true) {
            loading.value = false;
            return;
        }

        const requestBody = {
            fields: {
                word: word.value.trim(),
                translation: translation.value.trim(),
                pronunciation: pronunciation.value.trim(),
                example: example.value.trim(),
                levelId: levelId.value,
                teacherId: teacherId.value,
                status: status.value,
            }
        }

        // Get userId using the composable
        const { getValidUserId } = await import('@/composables/getUserId');
        let userId;
        try {
            userId = await getValidUserId(true); // Show alert if userId not found
        } catch (error) {
            loading.value = false;
            return;
        }

        const { add, update } = useDocument('Vocabulary');

        if (!props.isEditDoc) {
            requestBody.fields.createdAt = timestamp;
            requestBody.fields.createdBy = userId;
            const response = await add(requestBody);
            if (response && response.status === 200 && response.data) {
                loading.value = false;
                handleClose('add');
            } else {
                loading.value = false;
                console.error('Create failed:', response);
            }
        } else {
            requestBody.fields.updatedAt = timestamp;
            requestBody.fields.updatedBy = userId;
            const response = await update(requestBody, props.doc._id);
            if (response && response.status === 200 && response.data) {
                loading.value = false;
                handleClose('update');
            } else {
                loading.value = false;
                console.error('Update failed:', response);
            }
        }

    } catch (err) {
        loading.value = false;
        console.error('Error submitting form:', err);
    }
};
</script>

