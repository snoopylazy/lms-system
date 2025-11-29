<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <!-- Main Card -->
        <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <!-- Logo / Title Section -->
            <div class="text-center mb-8">
                <div class="flex justify-center mb-4">
                    <div class="w-16 h-16 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <i class="pi pi-user-plus text-white text-3xl"></i>
                    </div>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">
                    Learning Platform
                </h1>
                <p class="text-sm text-gray-600">Create Super Admin Account</p>
            </div>

            <!-- Form -->
            <form class="space-y-4" @submit.prevent="handleSubmit">
                <!-- Username -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="userName">
                        Username
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="pi pi-user text-gray-400"></i>
                        </div>
                        <input
                            id="userName"
                            type="text"
                            placeholder="Enter username"
                            v-model="userName"
                            :disabled="loading"
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="email">
                        Email
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="pi pi-envelope text-gray-400"></i>
                        </div>
                        <input
                            id="email"
                            v-model="email"
                            type="email"
                            placeholder="Enter email"
                            :disabled="loading"
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                <!-- Password -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="password">
                        Password
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i class="pi pi-lock text-gray-400"></i>
                        </div>
                        <input
                            :type="showPassword ? 'text' : 'password'"
                            v-model="password"
                            id="password"
                            placeholder="Enter your password"
                            :disabled="loading"
                            class="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <!-- Password Toggle Button -->
                        <button
                            type="button"
                            @click="showPassword = !showPassword"
                            :disabled="loading"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
                        >
                            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                        </button>
                    </div>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                    <i v-else class="pi pi-user-plus"></i>
                    <span>{{ loading ? "Creating..." : "Create Super Admin" }}</span>
                </button>
            </form>

            <!-- Footer -->
            <div class="text-center mt-6 pt-6 border-t border-gray-200">
                <p class="text-xs text-gray-500">
                    © 2024 Learning Platform. All rights reserved.
                </p>
            </div>
        </div>

        <!-- Toast Message -->
        <toastmessage
            :visible="openForm"
            :informMessage="informMessage"
            :showToast="showToast"
            :isFailed="isFailed"
            @onClose="handleMessageClose"
        />
    </div>
</template>


<script setup>
import apiURL from "@/services/apiURL";
import { fetchTimestamp } from "@/services/timeStamp";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from 'vue-router';
import toastmessage from "@/components/toastmessage.vue";

const router = useRouter();
const userName = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const showPassword = ref(false);

// Toast system
const openForm = ref(false);
const informMessage = ref("");
const showToast = ref(false);
const isFailed = ref(false);

const handleMessageClose = () => {
    showToast.value = false;
    openForm.value = false;
    informMessage.value = "";
    isFailed.value = false;
};

const handleSubmit = async () => {
    try {
        loading.value = true;

        // Validation
        if (!userName.value || !email.value || !password.value) {
            loading.value = false;
            informMessage.value = "Please fill in all fields.";
            isFailed.value = true;
            showToast.value = true;
            openForm.value = true;
            return;
        }

        const timestamp = await fetchTimestamp();
        const requestBody = {
            fields: {
                username: userName.value,
                displayName: userName.value,
                email: email.value,
                password: password.value,
                mainRole: 'Super Admin',
                status: true,
                createdAt: timestamp,
                createdBy: "Self Created"
            }
        };

        const response = await axios.post(`${apiURL}/lms/api/insertDoc/User`, requestBody);
        
        if (response && response.status === 200 && response.data) {
            // Success message
            informMessage.value = "Super Admin account created successfully!";
            isFailed.value = false;
            showToast.value = true;
            openForm.value = true;

            // Redirect to login after a short delay
            setTimeout(() => {
                router.push('/login');
            }, 1500);

            loading.value = false;
        } else {
            throw new Error('Failed to create account');
        }

    } catch (err) {
        loading.value = false;
        console.error('Failed to submit data', err);

        // Error message
        informMessage.value = err.response?.data?.message || "Failed to create Super Admin account!";
        isFailed.value = true;
        showToast.value = true;
        openForm.value = true;
    }
};




</script>

<style scoped>
/* Simple, clean design - no animations */
</style>