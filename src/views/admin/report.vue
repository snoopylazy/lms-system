<template>
  <div class="space-y-6 animate-fade-up">
    <h2 class="text-primary-dark text-2xl font-bold mb-6">Reports & Analytics</h2>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-primary-border">
      <h3 class="text-lg font-semibold text-primary-dark mb-4">Filters</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Date Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
          <DatePicker v-model="dateFrom" dateFormat="yy-mm-dd" showIcon
            class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date To</label>
          <DatePicker v-model="dateTo" dateFormat="yy-mm-dd" showIcon
            class="w-full" />
        </div>

        <!-- Level Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Level</label>
          <Select v-model="selectedLevel" :options="levels" optionLabel="name" optionValue="_id"
            placeholder="All Levels" class="w-full" />
        </div>

        <!-- Report Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <Select v-model="reportType" :options="reportTypes" placeholder="Select Report Type"
            class="w-full" />
        </div>
      </div>

      <div class="mt-4 flex gap-3">
        <Button label="Apply Filters" icon="pi pi-filter" @click="applyFilters"
          class="px-6 py-2 bg-primary-default hover:bg-primary-hover text-white rounded-md transition" />
        <Button label="Reset" icon="pi pi-refresh" @click="resetFilters" severity="secondary"
          class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition" />
        <!-- <Button v-if="hasPermission('report', 'view') || isSuperAdmin"  -->
        <Button 
          label="Export" icon="pi pi-download" @click="exportReport" severity="success"
          class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition" />
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Clients -->
      <div
        class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 transform hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase opacity-90 font-medium">Total Visitors</p>
            <p class="text-3xl font-bold mt-2">{{ totalClients }}</p>
            <p class="text-xs opacity-75 mt-1">Website visitors</p>
          </div>
          <div class="text-5xl opacity-30">
            <i class="pi pi-globe"></i>
          </div>
        </div>
      </div>

      <!-- Total Lessons Completed -->
      <div
        class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 text-white p-6 transform hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase opacity-90 font-medium">Lessons Completed</p>
            <p class="text-3xl font-bold mt-2">{{ totalLessonsCompleted }}</p>
            <p class="text-xs opacity-75 mt-1">Total completions</p>
          </div>
          <div class="text-5xl opacity-30">
            <i class="pi pi-check-circle"></i>
          </div>
        </div>
      </div>

      <!-- Total Quizzes Taken -->
      <div
        class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 transform hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase opacity-90 font-medium">Quizzes Taken</p>
            <p class="text-3xl font-bold mt-2">{{ totalQuizzesTaken }}</p>
            <p class="text-xs opacity-75 mt-1">Quiz attempts</p>
          </div>
          <div class="text-5xl opacity-30">
            <i class="pi pi-question-circle"></i>
          </div>
        </div>
      </div>

      <!-- Average Score -->
      <div
        class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 transform hover:scale-105">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase opacity-90 font-medium">Average Score</p>
            <p class="text-3xl font-bold mt-2">{{ averageScore }}%</p>
            <p class="text-xs opacity-75 mt-1">Overall performance</p>
          </div>
          <div class="text-5xl opacity-30">
            <i class="pi pi-star"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Client Activity by Level -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-primary-border">
        <h3 class="text-lg font-semibold text-primary-dark mb-4 flex items-center gap-2">
          <i class="pi pi-chart-bar text-primary-600"></i>
          Client Activity by Level
        </h3>
        <div class="space-y-4">
          <div v-for="level in levelProgress" :key="level.name" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">{{ level.name }}</span>
              <span class="text-sm font-semibold text-gray-900">{{ level.clients }} clients</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div :class="level.color" class="h-full rounded-full transition-all duration-500 ease-out"
                :style="{ width: level.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Performance -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-primary-border">
        <h3 class="text-lg font-semibold text-primary-dark mb-4 flex items-center gap-2">
          <i class="pi pi-chart-line text-primary-600"></i>
          Quiz Performance
        </h3>
        <div class="space-y-4">
          <div v-for="quiz in quizPerformance" :key="quiz.name" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">{{ quiz.name }}</span>
              <span class="text-sm font-semibold text-gray-900">{{ quiz.score }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div :class="quiz.color" class="h-full rounded-full transition-all duration-500 ease-out"
                :style="{ width: quiz.score + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Most Active Clients -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-primary-border">
      <h3 class="text-lg font-semibold text-primary-dark mb-4 flex items-center gap-2">
        <i class="pi pi-users text-primary-600"></i>
        Most Active Clients
      </h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Level
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lessons Viewed
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quizzes Attempted
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(client, index) in mostActiveClients" :key="client.id"
              class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span v-if="index === 0" class="text-2xl">🥇</span>
                  <span v-else-if="index === 1" class="text-2xl">🥈</span>
                  <span v-else-if="index === 2" class="text-2xl">🥉</span>
                  <span v-else class="text-sm font-medium text-gray-900 ml-2">{{ index + 1 }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                    {{ client.name.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ client.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                  {{ client.level }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ client.lessonsViewed }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ client.quizzesAttempted }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-600">{{ client.lastActive }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-primary-border">
      <h3 class="text-lg font-semibold text-primary-dark mb-4 flex items-center gap-2">
        <i class="pi pi-clock text-primary-600"></i>
        Recent Activities
      </h3>
      <div class="space-y-4">
        <div v-for="activity in recentActivities" :key="activity.id"
          class="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div :class="activity.iconBg"
            class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
            <i :class="activity.icon" class="text-white"></i>
          </div>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ activity.description }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p class="text-gray-700 font-medium">Loading report data...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import apiURL from "@/services/apiURL";
import { usePermission } from '@/composables/usePermission';

// Initialize permissions
const { loadUserPermissions, hasPermission, isSuperAdmin } = usePermission();

// Loading state
const isLoading = ref(false);

// Filter states
const dateFrom = ref(null);
const dateTo = ref(null);
const selectedLevel = ref(null);
const reportType = ref("overview");
const levels = ref([]);
const reportTypes = ref([
  "overview",
  "client-activity",
  "quiz-performance",
  "lesson-completion",
  "learning-progress"
]);

// Statistics
const totalClients = ref(0);
const totalLessonsCompleted = ref(0);
const totalQuizzesTaken = ref(0);
const averageScore = ref(0);

// Chart data
const levelProgress = ref([]);
const quizPerformance = ref([]);

// Most active clients
const mostActiveClients = ref([]);

// Recent activities
const recentActivities = ref([]);

// Fetch all report data
const fetchReportData = async () => {
  try {
    isLoading.value = true;

    // Fetch all necessary data
    const [
      usersResponse,
      levelsResponse,
      lessonsResponse,
      quizzesResponse,
    ] = await Promise.all([
      axios.get(`${apiURL}/lms/api/getAllDocs/User`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
      axios.get(`${apiURL}/lms/api/getAllDocs/Level`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
      axios.get(`${apiURL}/lms/api/getAllDocs/Lesson`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
      axios.get(`${apiURL}/lms/api/getAllDocs/Quiz`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
    ]);

    const users = usersResponse.data?.data || [];
    const levelsData = levelsResponse.data?.data || [];
    const lessons = lessonsResponse.data?.data || [];
    const quizzes = quizzesResponse.data?.data || [];

    // Set levels for filter
    levels.value = levelsData;

    // Calculate statistics
    totalClients.value = users.length;
    totalLessonsCompleted.value = lessons.length * Math.floor(users.length * 0.7); // Mock data
    totalQuizzesTaken.value = quizzes.length * Math.floor(users.length * 0.8); // Mock data
    averageScore.value = 75; // Mock data

    // Calculate level progress (client activity by level)
    levelProgress.value = levelsData.map((level, index) => {
      const clientsInLevel = Math.floor(users.length / levelsData.length) + Math.floor(Math.random() * 10);
      const percentage = users.length > 0 ? (clientsInLevel / users.length) * 100 : 0;
      const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-yellow-500",
        "bg-pink-500",
        "bg-indigo-500"
      ];
      return {
        name: level.name,
        clients: clientsInLevel,
        percentage: percentage,
        color: colors[index % colors.length]
      };
    });

    // Calculate quiz performance
    quizPerformance.value = quizzes.slice(0, 5).map((quiz, index) => {
      const score = 60 + Math.floor(Math.random() * 35);
      const colors = [
        "bg-green-500",
        "bg-blue-500",
        "bg-purple-500",
        "bg-yellow-500",
        "bg-pink-500"
      ];
      return {
        name: quiz.name || quiz.title || 'Quiz ' + (index + 1),
        score: score,
        color: colors[index % colors.length]
      };
    });

    // Generate most active clients (mock data)
    mostActiveClients.value = users.slice(0, 10).map((user, index) => {
      const levelIndex = index % levelsData.length;
      return {
        id: user._id || index,
        name: user.displayName || user.username || "Client " + (index + 1),
        level: levelsData[levelIndex]?.name || "Beginner",
        lessonsViewed: 15 + Math.floor(Math.random() * 20),
        quizzesAttempted: 8 + Math.floor(Math.random() * 12),
        lastActive: Math.floor(Math.random() * 7) + " days ago"
      };
    }).sort((a, b) => b.lessonsViewed - a.lessonsViewed);

    // Generate recent activities (mock data)
    recentActivities.value = [
      {
        id: 1,
        icon: "pi pi-globe",
        iconBg: "bg-blue-500",
        title: "New Visitor",
        description: (users[0]?.displayName || "A client") + " visited the platform",
        time: "2 minutes ago"
      },
      {
        id: 2,
        icon: "pi pi-book",
        iconBg: "bg-green-500",
        title: "Lesson Viewed",
        description: (lessons[0]?.name || lessons[0]?.title || "A lesson") + " was viewed by a client",
        time: "15 minutes ago"
      },
      {
        id: 3,
        icon: "pi pi-question-circle",
        iconBg: "bg-purple-500",
        title: "Quiz Attempted",
        description: (quizzes[0]?.name || quizzes[0]?.title || "A quiz") + " was attempted by a client",
        time: "1 hour ago"
      },
      {
        id: 4,
        icon: "pi pi-language",
        iconBg: "bg-yellow-500",
        title: "Vocabulary Practice",
        description: "A client practiced vocabulary words",
        time: "2 hours ago"
      },
      {
        id: 5,
        icon: "pi pi-star",
        iconBg: "bg-pink-500",
        title: "Learning Milestone",
        description: "A client reached 10 completed lessons",
        time: "3 hours ago"
      }
    ];

  } catch (error) {
    console.error("Error fetching report data:", error);
  } finally {
    isLoading.value = false;
  }
};

// Apply filters
const applyFilters = () => {
  fetchReportData();
};

// Reset filters
const resetFilters = () => {
  dateFrom.value = null;
  dateTo.value = null;
  selectedLevel.value = null;
  reportType.value = "overview";
  fetchReportData();
};

// Export report
const exportReport = () => {
  // Mock export functionality
  alert("Export functionality would be implemented here. This would generate a PDF or CSV file with the report data.");
};

onMounted(async () => {
  await loadUserPermissions();
  fetchReportData();
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
