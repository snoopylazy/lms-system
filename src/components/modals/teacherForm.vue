<template>
    <Dialog :visible="open" @update:visible="val => open = val" modal :style="{ width: '95vw', maxWidth: '48rem' }" class="p-2 scrollbar-gold"
        @hide="handleClose('close')" position="top" draggable closable>

        <!-- Custom Header -->
        <template #header>
            <div class="flex items-center space-x-2 text-primary-text border-b-2 border-primary-border w-full p-1">
                <i class="fa-solid fa-user-tie"></i>
                <span class="font-semibold">
                    {{ isEditDoc ? 'Edit Teacher' : 'Create New Teacher' }}
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
                <InputText id="name" v-model="name" placeholder="Enter teacher name"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
            </div>

            <!-- Email -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="email" class="block font-semibold mb-1 text-primary-text">
                    Email <span class="text-red-500">*</span>
                </label>
                <InputText id="email" v-model="email" type="email" :invalid="isExistEmail" placeholder="Enter email"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
                <div v-if="isExistEmail" class="mt-2">
                    <Message severity="error">Email already exists!</Message>
                </div>
            </div>

            <!-- Phone -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="phone" class="block font-semibold mb-1 text-primary-text">
                    Phone <span class="text-red-500">*</span>
                </label>
                <InputText id="phone" v-model="phone" placeholder="Enter phone number"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
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
const email = ref('');
const originalEmail = ref(null);
const phone = ref('');
const status = ref(true);
const isExistEmail = ref(null);
const loading = ref(false);
const open = ref(false);

onMounted(async () => {
    if (props.visible) {
        open.value = props.visible;
    }

    if (props.isEditDoc) {
        name.value = props.doc.name || '';
        email.value = props.doc.email || '';
        originalEmail.value = props.doc.email || '';
        phone.value = props.doc.phone || '';
        status.value = props.doc.status ?? true;
    } else {
        // Clear form for add mode
        handleClear();
    }
});

// Watch for duplicate email
watch(email, async (newV) => {
    if (email.value == originalEmail.value && email.value !== null) {
        return;
    } else {
        if (newV) {
            originalEmail.value = null;
            const dataExist = await fetchAllDoc('Teacher', {
                dynamicConditions: [
                    {
                        field: "email",
                        operator: "==",
                        value: newV
                    }
                ]
            });

            if (dataExist.length > 0) {
                isExistEmail.value = true;
            } else {
                isExistEmail.value = null;
            }
        } else {
            isExistEmail.value = null;
        }
    }
}, { deep: true });

const handleClear = () => {
    name.value = '';
    email.value = '';
    originalEmail.value = null;
    phone.value = '';
    isExistEmail.value = null;
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

        // Validate for duplicate email
        if (isExistEmail.value == true) {
            loading.value = false;
            return;
        }

        const requestBody = {
            fields: {
                name: name.value.trim(),
                email: email.value.trim(),
                phone: phone.value.trim(),
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

        const { add, update } = useDocument('Teacher');

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

