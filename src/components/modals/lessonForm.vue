<template>
    <Dialog :visible="open" @update:visible="val => open = val" modal :style="{ width: '95vw', maxWidth: '52rem' }" class="p-2 scrollbar-gold"
        @hide="handleClose('close')" position="top" draggable closable>

        <!-- Custom Header -->
        <template #header>
            <div class="flex items-center space-x-2 text-primary-text border-b-2 border-primary-border w-full p-1">
                <i class="fa-solid fa-book-open"></i>
                <span class="font-semibold">
                    {{ isEditDoc ? 'Edit Lesson' : 'Create New Lesson' }}
                </span>
            </div>
        </template>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-2">

            <!-- Name -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm col-span-1">
                <label for="name" class="block font-semibold mb-1 text-primary-text">
                    Name <span class="text-red-500">*</span>
                </label>
                <InputText id="name" v-model="name" placeholder="Enter lesson name"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
            </div>

            <!-- Description -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="description" class="block font-semibold mb-1 text-primary-text">
                    Description <span class="text-red-500">*</span>
                </label>
                <Textarea id="description" v-model="description" placeholder="Enter lesson description" rows="4"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
            </div>

            <!-- Levels (Multiple Select) -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="levelId" class="block font-semibold mb-1 text-primary-text">
                    Levels <span class="text-red-500">*</span>
                </label>
                <MultiSelect v-model="levelId" :options="levels" optionLabel="name" optionValue="_id"
                    placeholder="Select levels" display="chip"
                    class="w-full border border-primary-border rounded-md focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    :maxSelectedLabels="3"
                    required />
                <small class="text-gray-500">Select one or more levels for this lesson</small>
            </div>

            <!-- Quizzes (Multiple Select) -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="quizId" class="block font-semibold mb-1 text-primary-text">
                    Quizzes
                </label>
                <MultiSelect v-model="quizId" :options="quizzes" optionLabel="name" optionValue="_id"
                    placeholder="Select quizzes" display="chip"
                    class="w-full border border-primary-border rounded-md focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    :maxSelectedLabels="3"
                    :loading="loadingQuizzes" />
                <small class="text-gray-500">Select one or more quizzes for this lesson (optional)</small>
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

const name = ref('');
const description = ref('');
const levelId = ref([]);
const quizId = ref([]);
const status = ref(true);
const loading = ref(false);
const loadingQuizzes = ref(false);
const open = ref(false);
const levels = ref([]);
const quizzes = ref([]);

onMounted(async () => {
    if (props.visible) {
        open.value = props.visible;
    }

    // Fetch levels and quizzes
    await Promise.all([fetchLevels(), fetchQuizzes()]);

    if (props.isEditDoc) {
        name.value = props.doc.name || '';
        description.value = props.doc.description || '';
        levelId.value = props.doc.levelId || [];
        quizId.value = props.doc.quizId || [];
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

// Fetch all quizzes
const fetchQuizzes = async () => {
    try {
        loadingQuizzes.value = true;
        const data = await fetchAllDoc('Quiz', {
            dynamicConditions: [
                {
                    field: "status",
                    operator: "==",
                    value: true
                }
            ]
        });
        quizzes.value = data || [];
        loadingQuizzes.value = false;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        quizzes.value = [];
        loadingQuizzes.value = false;
    }
};

const handleClear = () => {
    name.value = '';
    description.value = '';
    levelId.value = [];
    quizId.value = [];
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

        const requestBody = {
            fields: {
                name: name.value.trim(),
                description: description.value.trim(),
                levelId: levelId.value,
                quizId: quizId.value,
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

        const { add, update } = useDocument('Lesson');

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

