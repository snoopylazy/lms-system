<template>
    <Dialog :visible="open" @update:visible="val => open = val" modal :style="{ width: '95vw', maxWidth: '40rem' }" class="p-2 scrollbar-gold"
        @hide="handleClose('close')" position="top" draggable closable>

        <!-- Custom Header -->
        <template #header>
            <div class="flex items-center space-x-2 text-primary-text border-b-2 border-primary-border w-full p-1">
                <i class="fa-solid fa-user-shield"></i>
                <span class="font-semibold">
                    {{ isEditDoc ? 'Edit Role' : 'Create New Role' }}
                </span>
            </div>
        </template>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-2">

            <!-- name -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm col-span-1">
                <label for="name" class="block font-semibold mb-1 text-primary-text">
                    Name <span class="text-red-500">*</span>
                </label>
                <InputText id="name" v-model="name" :invalid="isExistName" placeholder="Enter role name"
                    class="w-full p-3 border border-primary-border rounded-md text-base font-medium focus:border-primary-focus focus:ring-2 focus:ring-primary-light transition-all duration-200"
                    required />
                <div v-if="isExistName" class="mt-2">
                    <Message severity="error">Role name already exists!</Message>
                </div>
            </div>

            <!-- Permissions Section -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label class="block font-semibold mb-3 text-primary-text">
                    Module Permissions
                </label>
                <div class="overflow-x-auto">
                    <table class="min-w-full border border-gray-300">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-4 py-2 border border-gray-300 text-left text-sm font-semibold text-gray-700">
                                    Module
                                </th>
                                <th class="px-4 py-2 border border-gray-300 text-center text-sm font-semibold text-gray-700">
                                    View
                                </th>
                                <th class="px-4 py-2 border border-gray-300 text-center text-sm font-semibold text-gray-700">
                                    Add
                                </th>
                                <th class="px-4 py-2 border border-gray-300 text-center text-sm font-semibold text-gray-700">
                                    Edit
                                </th>
                                <th class="px-4 py-2 border border-gray-300 text-center text-sm font-semibold text-gray-700">
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="module in modules" :key="module.key" class="hover:bg-gray-50">
                                <td class="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-800">
                                    <i :class="module.icon" class="mr-2"></i>
                                    {{ module.label }}
                                </td>
                                <td class="px-4 py-2 border border-gray-300 text-center">
                                    <Checkbox v-model="permissions[`${module.key}_view`]" :binary="true" />
                                </td>
                                <td class="px-4 py-2 border border-gray-300 text-center">
                                    <Checkbox v-model="permissions[`${module.key}_add`]" :binary="true" />
                                </td>
                                <td class="px-4 py-2 border border-gray-300 text-center">
                                    <Checkbox v-model="permissions[`${module.key}_edit`]" :binary="true" />
                                </td>
                                <td class="px-4 py-2 border border-gray-300 text-center">
                                    <Checkbox v-model="permissions[`${module.key}_delete`]" :binary="true" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Quick Actions -->
                <div class="mt-3 flex gap-2 flex-wrap">
                    <button type="button" @click="selectAllPermissions" 
                        class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                        <i class="fa-solid fa-check-double mr-1"></i>
                        Select All
                    </button>
                    <button type="button" @click="deselectAllPermissions" 
                        class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                        <i class="fa-solid fa-xmark mr-1"></i>
                        Deselect All
                    </button>
                    <button type="button" @click="selectAllView" 
                        class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                        <i class="fa-solid fa-eye mr-1"></i>
                        All View
                    </button>
                </div>
            </div>

            <!-- Note -->
            <div class="field p-3 rounded-md border border-gray-200 shadow-sm">
                <label for="note" class="block font-semibold mb-1 text-primary-text">
                    Note
                </label>
                <Textarea id="note" v-model="note" placeholder="Enter note" rows="2"
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

const name = ref('');
const originalName = ref(null);
const permissions = ref({});
const note = ref('');
const status = ref(true);
const isExistName = ref(null);
const loading = ref(false);
const open = ref(false);

// Available modules with permissions
const modules = ref([
    { key: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
    { key: 'user', label: 'Users', icon: 'fa-solid fa-users' },
    { key: 'teacher', label: 'Teachers', icon: 'fa-solid fa-chalkboard-teacher' },
    { key: 'level', label: 'Levels', icon: 'fa-solid fa-layer-group' },
    { key: 'lesson', label: 'Lessons', icon: 'fa-solid fa-book' },
    { key: 'vocabulary', label: 'Vocabulary', icon: 'fa-solid fa-spell-check' },
    { key: 'grammar', label: 'Grammar', icon: 'fa-solid fa-language' },
    { key: 'quiz', label: 'Quizzes', icon: 'fa-solid fa-question-circle' },
    { key: 'report', label: 'Reports', icon: 'fa-solid fa-file-chart-line' },
    { key: 'role', label: 'Roles', icon: 'fa-solid fa-user-shield' },
]);

onMounted(async () => {
    if (props.visible) {
        open.value = props.visible;
    }

    if (props.isEditDoc) {
        name.value = props.doc.name || '';
        originalName.value = props.doc.name || '';
        // Load permissions from doc
        if (props.doc.permission) {
            // Initialize all permissions to false first
            modules.value.forEach(module => {
                ['view', 'add', 'edit', 'delete'].forEach(action => {
                    const key = `${module.key}_${action}`;
                    permissions.value[key] = props.doc.permission[key] === true;
                });
            });
        }
        note.value = props.doc.note || '';
        status.value = props.doc.status ?? true;
    } else {
        // Clear form for add mode
        handleClear();
    }
});

// Watch for duplicate name
watch(name, async (newV) => {
    if (name.value == originalName.value && name.value !== null) {
        return;
    } else {
        if (newV) {
            originalName.value = null;
            const dataExist = await fetchAllDoc('Role', {
                dynamicConditions: [
                    {
                        field: "name",
                        operator: "==",
                        value: newV
                    }
                ]
            });

            if (dataExist.length > 0) {
                isExistName.value = true;
            } else {
                isExistName.value = null;
            }
        } else {
            isExistName.value = null;
        }
    }
}, { deep: true });

const handleClear = () => {
    name.value = '';
    originalName.value = null;
    isExistName.value = null;
    permissions.value = {};
    // Initialize all permissions to false
    modules.value.forEach(module => {
        ['view', 'add', 'edit', 'delete'].forEach(action => {
            permissions.value[`${module.key}_${action}`] = false;
        });
    });
    note.value = '';
    status.value = true;
}

// Select all permissions
const selectAllPermissions = () => {
    modules.value.forEach(module => {
        ['view', 'add', 'edit', 'delete'].forEach(action => {
            permissions.value[`${module.key}_${action}`] = true;
        });
    });
};

// Deselect all permissions
const deselectAllPermissions = () => {
    modules.value.forEach(module => {
        ['view', 'add', 'edit', 'delete'].forEach(action => {
            permissions.value[`${module.key}_${action}`] = false;
        });
    });
};

// Select all View permissions
const selectAllView = () => {
    modules.value.forEach(module => {
        permissions.value[`${module.key}_view`] = true;
    });
};

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

        // Validate for duplicate name
        if (isExistName.value == true) {
            loading.value = false;
            return;
        }

        const requestBody = {
            fields: {
                name: name.value.trim(),
                permission: permissions.value,
                note: note.value.trim(),
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

        const { add, update } = useDocument('Role');

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

