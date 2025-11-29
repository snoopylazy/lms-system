<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <!-- Main Login Card -->
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">
      <!-- Logo / Title Section -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <i class="pi pi-graduation-cap text-white text-3xl"></i>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">
          Learning Platform
        </h1>
        <p class="text-sm text-gray-600">Sign in to access your account</p>
      </div>

      <!-- Login Form -->
      <form class="space-y-4" @submit.prevent="handleLogin">
        <!-- Email/Username Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="email">
            Email or Username
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="pi pi-user text-gray-400"></i>
            </div>
            <input
              id="email"
              v-model="usernameOrEmail"
              type="text"
              placeholder="Enter your email or username"
              :disabled="isPending"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Password Input -->
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
              :disabled="isPending"
              placeholder="Enter your password"
              class="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <!-- Password Toggle Button -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              :disabled="isPending"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
            >
              <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="isPending"
          class="w-full py-2.5 bg-primary hover:bg-primary text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <i v-if="isPending" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-sign-in"></i>
          <span>{{ isPending ? "Signing In..." : "Sign In" }}</span>
        </button>
      </form>

      <!-- Footer -->
      <div class="text-center mt-6 pt-6 border-t border-gray-200">
        <p class="text-xs text-gray-500">
          © 2024 Learning Platform. All rights reserved.
        </p>
      </div>
    </div>

    <!-- Toast Message Component -->
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useBranchStore } from "@/store/branch";
import { fetchTimestamp } from "@/services/timeStamp";
import { getDeviceDetails } from "@/composables/getDeviceDetail";
import { decodeJwt } from "@/composables/decodeJWT";
import axios from "axios";
import apiURL from "@/services/apiURL";
import { v4 as uuidv4 } from "uuid";
import toastmessage from "@/components/toastmessage.vue";


const router = useRouter();
const branchStore = useBranchStore();

// Form state
const usernameOrEmail = ref("");
const password = ref("");
const isPending = ref(false);
const showPassword = ref(false);

// Toast state
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

const handleLogin = async () => {
  try {
    isPending.value = true;

    // Validation
    if (!usernameOrEmail.value) {
      isPending.value = false;
      informMessage.value = "Please enter your email or username.";
      isFailed.value = true;
      showToast.value = true;
      openForm.value = true;
      return;
    }

    if (!password.value) {
      isPending.value = false;
      informMessage.value = "Please enter your password.";
      isFailed.value = true;
      showToast.value = true;
      openForm.value = true;
      return;
    }

    // Get device details and timestamp
    const deviceDetails = getDeviceDetails();
    const timestamp = await fetchTimestamp();
    const deviceUUID = uuidv4();

    // Determine if input is email or username
    const isEmail = usernameOrEmail.value.includes("@");

    // Build query parameters
    const params = {
      dynamicConditions: JSON.stringify([
        {
          field: isEmail ? "email" : "username",
          operator: "==",
          value: usernameOrEmail.value,
        },
      ]),
    };

    // Fetch user
    const response = await axios.get(
      `${apiURL}/lms/api/getAllDocs/User`,
      { params }
    );
    const userDoc = response.data.data[0];

    // Check if user exists
    if (response.data.data.length <= 0) {
      isPending.value = false;
      informMessage.value = "User not found! Please check your credentials.";
      isFailed.value = true;
      showToast.value = true;
      openForm.value = true;
      return;
    }

    // Check account status for non-Super Admin users
    if (userDoc?.status === false && userDoc?.mainRole !== "Super Admin") {
      isPending.value = false;
      informMessage.value =
        "Your account has been disabled. Please contact administrator.";
      isFailed.value = true;
      showToast.value = true;
      openForm.value = true;
      return;
    }

    // Handle login for all users
    const responseLogin = await axios.post(`${apiURL}/lms/api/login`, {
      usernameOrEmail: usernameOrEmail.value,
      password: password.value,
    });

    const token = responseLogin.data.token;
    if (token) {
      const decodedToken = await decodeJwt(token);

      // Log user activity
      const req = {
        fields: {
          userId: decodedToken.userId,
          createdAt: timestamp,
          deviceLog: {
            ...deviceDetails,
            uuid: deviceUUID,
          },
        },
      };

      await axios.post(
        `${apiURL}/lms/api/insertDoc/UserLog`,
        req
      );

      // Store user data
      if (decodedToken && decodedToken.userId) {
        branchStore.userId = decodedToken.userId;
        // Store userId in localStorage as backup
        localStorage.setItem("userId", decodedToken.userId);
        localStorage.setItem("token", token);
        localStorage.setItem("deviceId", deviceUUID);
        console.log("UserId stored:", decodedToken.userId);
      } else {
        console.error("Failed to decode userId from token:", decodedToken);
      }

      // Show success message
      informMessage.value = "Login successful!";
      isFailed.value = false;
      showToast.value = true;
      openForm.value = true;

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push("/admin");
      }, 300);
    } else {
      isPending.value = false;
      informMessage.value = "Invalid credentials. Please try again.";
      isFailed.value = true;
      showToast.value = true;
      openForm.value = true;
    }

    isPending.value = false;
  } catch (err) {
    console.error("Failed to login", err);
    isPending.value = false;
    informMessage.value = "Login failed! Please check your credentials.";
    isFailed.value = true;
    showToast.value = true;
    openForm.value = true;
  }
};
</script>

<style scoped>
/* Simple, clean design - no animations */
</style>
