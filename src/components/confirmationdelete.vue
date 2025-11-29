<template>
    <Teleport to="body">
        <transition name="toast" appear>
            <div v-if="visible" class="fixed inset-0 z-[9999] flex justify-center items-start pt-8"
                @click="handleBackdropClick">
                <!-- Backdrop with blur effect -->
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"></div>

                <!-- Modal container with enhanced styling -->
                <div class="relative bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 transform transition-all duration-300"
                    @click.stop role="dialog" aria-modal="true" :aria-labelledby="`delete-modal-title-${doc._id}`"
                    :aria-describedby="`delete-modal-description-${doc._id}`">
                    <!-- Header with improved styling -->
                    <div class="flex items-center justify-between p-6 pb-4">
                        <div class="flex items-center gap-3">
                            <!-- Warning icon -->
                            <div
                                class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 :id="`delete-modal-title-${doc._id}`" class="text-lg font-semibold text-gray-900">
                                Delete confirmation {{ elementCategory }}
                            </h3>
                        </div>

                        <!-- Enhanced close button -->
                        <button @click="handleClose('close')"
                            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            aria-label="បិទ">
                            <svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Content with better spacing -->
                    <div class="px-6 pb-6">
                        <p :id="`delete-modal-description-${doc._id}`" class="text-gray-700 leading-relaxed">
                            Are you sure you want to delete this ?
                            <span class="font-medium text-red-600">
                                {{ elementName }}
                            </span>
                            <!-- មែនដែរឬទេ? -->
                        </p>
                        <p class="text-sm text-red-600 mt-2 bg-red-50 p-3 rounded-lg border border-red-200">
                            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            Deleted and unacceptable.
                        </p>
                    </div>

                    <!-- Footer with improved button styling -->
                    <div class="flex justify-end gap-3 p-6 pt-0">
                        <button type="button" @click="handleClose"
                            class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                            :disabled="loading">
                            Cancel
                        </button>
                        <button type="button" @click="handleSubmit(elementCategory)" :disabled="loading"
                            class="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium min-w-[100px] flex items-center justify-center">
                            <span v-if="loading" class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Deleting...
                            </span>
                            <span v-else>Yes</span>
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </Teleport>


</template>


<script setup>


import useDocument from '@/composables/useDocument';
import socket from '@/services/socket';
import { ref } from 'vue';


const props = defineProps({
    visible: Boolean,
    doc: Object,
    elementCategory: String,
    elementName: String,
    isLastRecordOnPage: Boolean
});
const emit = defineEmits(['onClose', 'onConfirmDelete']);

const loading = ref(false);
let collectionName = '';

// Computed to sync prop with v-model

// Close modal
const handleClose = () => {
    loading.value = false; // Reset loading when closing
    emit('onClose');
};

// Handle backdrop click
const handleBackdropClick = () => {
    if (!loading.value) {
        handleClose();
    }
};

// Confirm delete
const handleConfirmDelete = (status) => {
    emit('onConfirmDelete'); // emit event to parent
    emit('onClose', status);          // close the modal
};


const handleSubmit = async (category) => {
    try {
        loading.value = true;

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

        const { remove } = useDocument(collectionName);

        // All collections use the same delete logic
        const response = await remove(props.doc._id);

        if (response && response.status === 200 && response.data) {
            handleConfirmDelete('delete');
            if (props.isLastRecordOnPage == true) {
                console.log("is Last Record On Page", props.isLastRecordOnPage)
                socket.emit("lastRecordDeleted", {
                    collection: collectionName
                });
            }
            loading.value = false;
        } else {
            loading.value = false;
            console.error('Delete failed:', response);
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
