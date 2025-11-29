<template>
    <Teleport to="body">
        <transition name="toast" appear>
            <div v-if="visible" class="fixed inset-0 z-[9999] flex justify-center items-start pt-8"
                @click="handleBackdropClick">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"></div>

                <!-- Modal container -->
                <div class="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 transform transition-all duration-300"
                    @click.stop role="dialog" aria-modal="true" :aria-labelledby="`status-modal-title-${doc._id}`"
                    :aria-describedby="`status-modal-description-${doc._id}`">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-6 pb-4">
                        <div class="flex items-center gap-3">
                            <!-- Info icon -->
                            <div
                                class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                                </svg>
                            </div>
                            <h3 :id="`status-modal-title-${doc._id}`" class="text-lg font-semibold text-gray-900">
                                Confirmation change status {{ elementCategory }}
                            </h3>
                        </div>

                        <!-- Close button -->
                        <button @click="handleClose('close')"
                            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label="Close">
                            <svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="px-6 pb-6">
                        <p :id="`status-modal-description-${doc._id}`" class="text-gray-700 leading-relaxed">
                            Are you sure you want to
                            <span class="font-medium text-blue-600">change status</span> of
                            <span class="font-medium text-gray-900">
                                {{ elementName }}
                            </span>
                            ?
                        </p>
                        <p class="text-sm text-blue-700 mt-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
                            </svg>
                            This action will update the current status.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div class="flex justify-end gap-3 p-6 pt-0">
                        <button type="button" @click="handleClose"
                            class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                            :disabled="loading">
                            Cancel
                        </button>
                        <button type="button" @click="handleSubmit(elementCategory)" :disabled="loading"
                            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium min-w-[120px] flex items-center justify-center">
                            <span v-if="loading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Updating...
                            </span>
                            <span v-else>Confirm</span>
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<script setup>
import useDocument from '@/composables/useDocument';
import { fetchTimestamp } from '@/services/timeStamp';
import { useBranchStore } from '@/store/branch';
import { ref } from 'vue';


const props = defineProps({
    visible: Boolean,
    doc: Object,
    elementCategory: String,
    elementName: String
});
const emit = defineEmits(['onClose', 'onConfirmStatusChange']);
const loading = ref(false);
let collectionName = '';

// Close modal
const handleClose = (status) => {
    loading.value = false; // Reset loading when closing
    emit('onClose', status);
};

// Handle backdrop click
const handleBackdropClick = () => {
    if (!loading.value) {
        handleClose('close');
    }
};

// Confirm status change
const handleConfirmStatusChange = (status) => {
    emit('onConfirmStatusChange'); // emit event to parent
    emit('onClose', status);               // close the modal
};

const branchStore = useBranchStore();


const handleSubmit = async (category) => {
    try {
        loading.value = true;

        const timestamp = await fetchTimestamp();
        
        // Get userId using the composable
        const { getValidUserId } = await import('@/composables/getUserId');
        let userId;
        try {
            userId = await getValidUserId(true); // Show alert if userId not found
        } catch (error) {
            loading.value = false;
            return;
        }
        
        switch (category) {
            case 'Level':
                collectionName = 'Level'
                break

            case 'User':
                collectionName = 'User'
                break

            case 'Grammar':
                collectionName = 'Grammar'
                break

            case 'Quiz':
                collectionName = 'Quiz'
                break

            case 'Lesson':
                collectionName = 'Lesson'
                break

            case 'Vocabulary':
                collectionName = 'Vocabulary'
                break

            case 'Teacher':
                collectionName = 'Teacher'
                break

            case 'Role':
                collectionName = 'Role'
                break
        }

        const { update } = useDocument(collectionName);

        // All collections use the same update logic for status change
        const requestBody = {
            fields: {
                status: props.doc.status == true ? false : true,
                updatedBy: userId,
                updatedAt: timestamp
            }
        }

        const response = await update(requestBody, props.doc._id);

        if (response && response.status === 200 && response.data) {
            loading.value = false;
            handleConfirmStatusChange('update')
        } else {
            loading.value = false;
            console.error('Update failed:', response);
        }

        

    } catch (err) {
        loading.value = false;
        console.log("failde to submit data", err)
    }
}

</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease-out;
}

.toast-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.toast-enter-to,
.toast-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.toast {
    transition: all 0.3s ease-in-out;
}

/* Additional backdrop animation */
.toast-enter-from .bg-black\/50,
.toast-leave-to .bg-black\/50 {
    opacity: 0;
}
</style>
