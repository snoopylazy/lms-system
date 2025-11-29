<template>
    <div class="text-primary-text animate-fade-up">
        <h2 class="text-primary-dark text-lg font-bold mb-2">Role</h2>

        <div
            class="border-2 border-primary-border p-4 rounded-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 my-4">
            <!-- Row selector -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                <!-- Row selector -->
                <Select v-model="pageSize" :options="optionPageSize" option-label="value" option-value="value"
                    placeholder="Select a row" size="small" class="w-full sm:w-30 md:w-40" />
            </div>

            <!-- Search input -->
            <div class="w-full md:w-[30%] flex items-center">
                <InputText v-model="searchQuery" type="text" placeholder="Search by name"
                    class="w-full rounded-md border border-primary-border p-2 focus:border-primary-focus focus:ring-1 focus:ring-primary-focus transition" />
            </div>

            <!-- Add button -->
            <div class="flex items-center justify-end">
                <!-- <Button v-if="hasPermission('role', 'add') || isSuperAdmin"  -->
                <Button 
                    label="Create" icon="pi pi-plus-circle" iconPos="left"
                    @click="handlePopOpenform('add', null)"
                    class="h-10 px-4 rounded-md bg-primary-default text-primary-text hover:bg-primary-hover transition" />
            </div>
        </div>

        <!-- table -->
        <div class="mt-10">

            <!-- Responsive Table Wrapper -->
            <div class="overflow-x-auto rounded-lg shadow-md border border-primary-border">
                <!-- Loading Overlay -->
                <div v-if="isLoading" class="absolute inset-0  bg-opacity-70 flex items-center justify-center z-10">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>

                <table class="min-w-full bg-primary-bg text-center" :class="{ 'opacity-50': isLoading }">
                    <!-- Table Head -->
                    <thead class="bg-primary-light text-primary-dark text-xs uppercase whitespace-nowrap">
                        <tr>
                            <th class="px-3 sm:px-4 py-3 border border-primary-border">ID</th>
                            <th class="px-3 sm:px-4 py-3 border border-primary-border">Name</th>
                            <th class="px-3 sm:px-4 py-3 border border-primary-border">Note</th>
                            <th class="px-3 sm:px-4 py-3 border border-primary-border">Created By</th>
                            <th class="px-3 sm:px-4 py-3 border border-primary-border">CreateAt</th>
                            <th class="px-3 sm:px-4 py-3 border border-primary-border">Status</th>
                            <th class="px-3 sm:px-4 py-3 border border-primary-border">Actions</th>
                        </tr>
                    </thead>

                    <!-- Table Body -->
                    <tbody class="text-primary-text text-xs" v-if="roleData.length > 0">
                        <tr class="hover:bg-primary-hover whitespace-nowrap" v-for="(item, index) in roleData"
                            :key="index" :class="index % 2 === 0 ? '' : 'bg-primary-30'">
                            <td class="px-3 sm:px-4 py-3 border border-primary-border">{{ index + 1 }}</td>
                            <td class="px-3 sm:px-4 py-3 border border-primary-border">
                                <span class="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                    {{ item.name }}
                                </span>
                            </td>
                            <td class="px-3 sm:px-4 py-3 border border-primary-border text-xs">{{ item.note || 'N/A' }}</td>
                            <td class="px-3 sm:px-4 py-3 border border-primary-border">
                                {{ getUserName(item.createdBy) || 'N/A' }}
                            </td>
                            <td class="px-3 sm:px-4 py-3 border border-primary-border">{{ formatDate(item.createdAt) }}
                            </td>
                            <td class="px-3 sm:px-4 py-3 border border-primary-border">
                                <div @click="handleChangeStatus(item)"
                                    class="cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-medium"
                                    :class="item.status ? 'text-green-700' : 'text-red-700'">
                                    <i :class="item.status ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
                                    <span>{{ item.status ? 'Active' : 'Inactive' }}</span>
                                </div>
                            </td>
                            <td class="px-3 sm:px-4 py-3 border border-primary-border">
                                <div class="flex justify-center gap-3">
                                    <!-- <i v-if="hasPermission('role', 'edit') || isSuperAdmin"  -->
                                    <i 
                                        @click="handlePopOpenform('edit', item)"
                                        class="fa-solid fa-pen-to-square cursor-pointer hover:text-yellow-500 transform hover:scale-110 transition duration-200 ease-in-out"></i>
                                    <!-- <i v-if="hasPermission('role', 'delete') || isSuperAdmin"  -->
                                    <i 
                                        @click="handleConfirmDetele(item)"
                                        class="fa-solid fa-trash cursor-pointer hover:text-red-600 transform hover:scale-110 transition duration-200 ease-in-out"></i>
                                    <!-- <span v-if="!hasPermission('role', 'edit') && !hasPermission('role', 'delete') && !isSuperAdmin" 
                                        class="text-gray-400 text-xs">No access</span> -->
                                </div>
                            </td>
                        </tr>

                    </tbody>
                    <tbody v-else>
                        <tr class=" [&>*]:p-2">
                            <td colspan="7" class="font-semibold text-center text-lg">
                                No Data!
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
            @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
            :limitedPerPage="pageSize" :searchQuery="searchText" />
    </div>

    <component :is="currentComponent" :visible="openForm" :isEditDoc="isEditDoc" :doc="docData" :isFailed="isFailed"
        :elementName="elementName" :elementCategory="elementCategory" :informMessage="informMessage"
        :showToast="showToast" :isLastRecordOnPage="isLastRecordOnPage" @onClose="handleListenEmitEvent" />
        
</template>

<script setup>
import ChangeStatus from '@/components/changestatus.vue';
import ConfirmationDelete from '@/components/confirmationdelete.vue';
import RoleForm from '@/components/modals/roleForm.vue';
import Pagination from '@/components/pagination.vue';
import ToastedMessage from '@/components/toastmessage.vue';
import { formatDate } from '@/composables/formatDate';
import { usePermission } from '@/composables/usePermission';
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import apiURL from '@/services/apiURL';

// Initialize permissions
const { loadUserPermissions, hasPermission, isSuperAdmin } = usePermission();


const openForm = ref(false);
const isEditDoc = ref(false);
const informMessage = ref("");
const showToast = ref(false);
const isFailed = ref(false);
const currentComponent = ref("");
const roleData = ref([]);
const searchQuery = ref("")
const searchText = ref("");
const docData = ref(null);
const elementCategory = ref(null);
const elementName = ref(null);
const isLoading = ref(false);
const currentPage = ref(1);
const isLastRecordOnPage = ref(null)
const pageSize = ref(50);
const optionPageSize = ref([

    {
        value: 50
    },


    {
        value: 100
    },

    {
        value: 200
    },
    {
        value: 500
    },
    {
        value: 1000
    },


]);

// Load permissions on component mount
onMounted(async () => {
    await loadUserPermissions();
});

watch(searchQuery, (newValue) => {
    searchText.value = newValue;
    // Reset to page 1 when searching
    currentPage.value = 1;
}, { immediate: true }); // Add immediate option to trigger on component mount



// User cache to store fetched user data
const userCache = ref({});

// Fetch user data by ID
const fetchUserById = async (userId) => {
    if (!userId) return null;
    
    // Check cache first
    if (userCache.value[userId]) {
        return userCache.value[userId];
    }

    try {
        const params = {
            dynamicConditions: JSON.stringify([
                {
                    field: '_id',
                    operator: "==",
                    value: userId,
                },
            ])
        };
        const response = await axios.get(`${apiURL}/lms/api/getAllDocs/User`, { params });
        const user = response.data.data[0] || null;
        
        if (user) {
            // Cache the user data
            userCache.value[userId] = user;
        }
        
        return user;
    } catch (err) {
        console.error("Failed to fetch user:", err);
        return null;
    }
};

// Get user name from cache
const getUserName = (userId) => {
    if (!userId) return 'N/A';
    
    const user = userCache.value[userId];
    if (user) {
        return user.displayName || user.username || user.email || 'Unknown';
    }
    
    return 'Loading...';
};

const handleListenToPagination = async (items) => {
    roleData.value = items || [];
    
    // Fetch user data for all createdBy IDs
    if (items && items.length > 0) {
        const userIds = [...new Set(items.map(item => item.createdBy).filter(Boolean))];
        await Promise.all(userIds.map(userId => fetchUserById(userId)));
    }
};

const handleListenIsLoading = (status) => {
    isLoading.value = status;
};


const currentPageIsLastRecord = ref(null);
const handleListenIsLastRecordOnPage = (status) => {
    currentPageIsLastRecord.value = status;
}


const handlePopOpenform = (status, item) => {
    if (status == 'add') {
        openForm.value = true;
        currentComponent.value = RoleForm;
    } else {
        isEditDoc.value = true;
        docData.value = item
        openForm.value = true;
        currentComponent.value = RoleForm;
    }

};

const handleConfirmDetele = (item) => {
    docData.value = item;
    elementCategory.value = "Role";
    elementName.value = item.name;
    openForm.value = true;
    currentComponent.value = ConfirmationDelete;

    if (roleData.value.length === 1 && currentPageIsLastRecord.value > 1) {

        isLastRecordOnPage.value = true;
    }
};

const handleChangeStatus = (item) => {
    docData.value = item;
    elementCategory.value = "Role";
    elementName.value = item.name;
    openForm.value = true;
    currentComponent.value = ChangeStatus;
};


const handleListenEmitEvent = (status) => {

    if (status == 'add' || status == 'create') {
        console.log("part add")
        informMessage.value = "Data has been created successfully !"
        showToast.value = true;
        isFailed.value = false;
        openForm.value = false;
        currentComponent.value = ToastedMessage
        isEditDoc.value = false;
        docData.value = null;
        elementCategory.value = null;
        elementName.value = null;
        isLastRecordOnPage.value = null;
    } else if (status == 'update') {

        informMessage.value = "Data has been updated successfully !"
        searchQuery.value = "";
        showToast.value = true;
        currentComponent.value = ToastedMessage
        isFailed.value = false;
        openForm.value = false;
        isEditDoc.value = false;
        docData.value = null;
        elementCategory.value = null;
        elementName.value = null;
        isLastRecordOnPage.value = null
    } else if (status == 'close') {
        console.log("part close")
        showToast.value = false
        isFailed.value = false;
        openForm.value = false;
        currentComponent.value = "";
        isEditDoc.value = false;
        docData.value = null;
        elementCategory.value = null;
        elementName.value = null;
        isLastRecordOnPage.value = null
    } else if (status == 'delete') {

        informMessage.value = "Data has been deleted successfully !"
        searchQuery.value = "";
        showToast.value = true;
        currentComponent.value = ToastedMessage
        isFailed.value = false;
        openForm.value = false;
        isEditDoc.value = false;
        docData.value = null;
        elementCategory.value = null;
        elementName.value = null;
        isLastRecordOnPage.value = null
    }
    else {

        showToast.value = false
        isFailed.value = false;
        openForm.value = false;
        isEditDoc.value = false;
        docData.value = null;
        currentComponent.value = "";
        elementCategory.value = null;
        elementName.value = null;
        isLastRecordOnPage.value = null
    }

}

</script>
