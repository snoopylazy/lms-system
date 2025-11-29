<template>
    <Dialog :visible="open" @update:visible="val => open = val" modal :style="{ width: '95vw', maxWidth: '48rem' }" class="p-2 scrollbar-gold"
        @hide="handleClose('close')" position="top" draggable closable>

        <!-- Custom Header -->
        <template #header>
            <div class="flex items-center space-x-2 text-primary-text border-b-2 border-primary-border w-full p-1">
                <i class="fa-solid fa-user"></i>
                <span class="font-semibold">
                    {{ isEditDoc ? 'Edit User' : 'Create New User' }}
                </span>
            </div>
        </template>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-2">

            <!-- Display Name -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm col-span-1">
                <label for="displayName" class="block font-semibold mb-1 text-primary-text">
                    Display Name <span class="text-red-500">*</span>
                </label>
                <InputText id="displayName" v-model="displayName" placeholder="Enter display name"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
            </div>

            <!-- Username -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="username" class="block font-semibold mb-1 text-primary-text">
                    Username <span class="text-red-500">*</span>
                </label>
                <InputText id="username" v-model="username" :invalid="isExistUsername" placeholder="Enter username"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
                <div v-if="isExistUsername" class="mt-2">
                    <Message severity="error">Username already exists!</Message>
                </div>
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

            <!-- Password (only for new users) -->
            <div v-if="!isEditDoc" class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="password" class="block font-semibold mb-1 text-primary-text">
                    Password <span class="text-red-500">*</span>
                </label>
                <Password id="password" v-model="password" placeholder="Enter password" toggleMask
                    class="w-full"
                    inputClass="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    :required="!isEditDoc" />
            </div>

            <!-- Role and Main Role -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Role -->
                <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                    <label for="role" class="block font-semibold mb-1 text-primary-text">
                        Role
                    </label>
                    <Select v-model="roleId" :options="roles" optionLabel="name" optionValue="_id"
                        placeholder="Select a role"
                        class="w-full border border-primary-border rounded-md focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200" />
                </div>

                <!-- Main Role -->
                <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                    <label for="mainRole" class="block font-semibold mb-1 text-primary-text">
                        Main Role
                    </label>
                    <Select v-model="mainRole" :options="mainRoles" placeholder="Select main role"
                        class="w-full border border-primary-border rounded-md focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200" />
                </div>
            </div>

            <!-- Phone Number and Gender -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Phone Number -->
                <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                    <label for="phoneNumber" class="block font-semibold mb-1 text-primary-text">
                        Phone Number
                    </label>
                    <InputText id="phoneNumber" v-model="phoneNumber" placeholder="Enter phone number"
                        class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200" />
                </div>

                <!-- Gender -->
                <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                    <label for="gender" class="block font-semibold mb-1 text-primary-text">
                        Gender
                    </label>
                    <Select v-model="gender" :options="genders" placeholder="Select gender"
                        class="w-full border border-primary-border rounded-md focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200" />
                </div>
            </div>

            <!-- Date of Birth -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="dob" class="block font-semibold mb-1 text-primary-text">
                    Date of Birth
                </label>
                <Calendar id="dob" v-model="dob" placeholder="Select date of birth" dateFormat="yy-mm-dd"
                    class="w-full"
                    inputClass="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200" />
            </div>

            <!-- Address -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="address" class="block font-semibold mb-1 text-primary-text">
                    Address
                </label>
                <Textarea id="address" v-model="address" placeholder="Enter address" rows="2"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200" />
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

const displayName = ref('');
const username = ref('');
const originalUsername = ref(null);
const email = ref('');
const originalEmail = ref(null);
const password = ref('');
const roleId = ref(null);
const mainRole = ref('');
const phoneNumber = ref('');
const gender = ref('');
const dob = ref(null);
const address = ref('');
const status = ref(true);
const isExistUsername = ref(null);
const isExistEmail = ref(null);
const loading = ref(false);
const open = ref(false);
const roles = ref([]);

const mainRoles = ref(['Super Admin', 'Admin', 'User', 'Public User']);
const genders = ref(['Male', 'Female', 'Other']);

onMounted(async () => {
    if (props.visible) {
        open.value = props.visible;
    }

    // Fetch roles
    await fetchRoles();

    if (props.isEditDoc) {
        displayName.value = props.doc.displayName || '';
        username.value = props.doc.username || '';
        originalUsername.value = props.doc.username || '';
        email.value = props.doc.email || '';
        originalEmail.value = props.doc.email || '';
        roleId.value = props.doc.roleId || null;
        mainRole.value = props.doc.mainRole || '';
        phoneNumber.value = props.doc.phoneNumber || '';
        gender.value = props.doc.gender || '';
        dob.value = props.doc.dob ? new Date(props.doc.dob) : null;
        address.value = props.doc.address || '';
        status.value = props.doc.status ?? true;
    } else {
        // Clear form for add mode
        handleClear();
    }
});

// Fetch all roles
const fetchRoles = async () => {
    try {
        const data = await fetchAllDoc('Role', {
            dynamicConditions: [
                {
                    field: "status",
                    operator: "==",
                    value: true
                }
            ]
        });
        roles.value = data || [];
    } catch (error) {
        console.error('Error fetching roles:', error);
        roles.value = [];
    }
};

// Watch for duplicate username
watch(username, async (newV) => {
    if (username.value == originalUsername.value && username.value !== null) {
        return;
    } else {
        if (newV) {
            originalUsername.value = null;
            const dataExist = await fetchAllDoc('User', {
                dynamicConditions: [
                    {
                        field: "username",
                        operator: "==",
                        value: newV
                    }
                ]
            });

            if (dataExist.length > 0) {
                isExistUsername.value = true;
            } else {
                isExistUsername.value = null;
            }
        } else {
            isExistUsername.value = null;
        }
    }
}, { deep: true });

// Watch for duplicate email
watch(email, async (newV) => {
    if (email.value == originalEmail.value && email.value !== null) {
        return;
    } else {
        if (newV) {
            originalEmail.value = null;
            const dataExist = await fetchAllDoc('User', {
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
    displayName.value = '';
    username.value = '';
    originalUsername.value = null;
    email.value = '';
    originalEmail.value = null;
    password.value = '';
    roleId.value = null;
    mainRole.value = '';
    phoneNumber.value = '';
    gender.value = '';
    dob.value = null;
    address.value = '';
    isExistUsername.value = null;
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

        // Validate for duplicate username or email
        if (isExistUsername.value == true || isExistEmail.value == true) {
            loading.value = false;
            return;
        }

        const requestBody = {
            fields: {
                username: username.value.trim(),
                displayName: displayName.value.trim(),
                email: email.value.trim(),
                roleId: roleId.value,
                mainRole: mainRole.value,
                phoneNumber: phoneNumber.value.trim(),
                gender: gender.value,
                dob: dob.value,
                address: address.value.trim(),
                status: status.value,
            }
        }

        // Add password only for new users
        if (!props.isEditDoc && password.value) {
            requestBody.fields.password = password.value;
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

        const { add, update } = useDocument('User');

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

