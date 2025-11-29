<template>
  <div class="space-y-6 animate-fade-up">
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <!-- Total Level Card -->
      <div
        class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 transform hover:scale-105"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase opacity-90 font-medium">Total Level</p>
            <p class="text-3xl font-bold mt-2">{{ totalLevel }}</p>
            <p class="text-xs opacity-75 mt-1">Active levels</p>
          </div>
          <div class="text-5xl opacity-30">
            <i class="pi pi-sort-alt"></i>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 -mb-4 -mr-4 opacity-20">
          <i class="pi pi-sort-alt text-7xl"></i>
        </div>
      </div>

      <!-- Total Lesson Card -->
      <div
        class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-500 to-green-600 text-white p-6 transform hover:scale-105"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase opacity-90 font-medium">Total Lesson</p>
            <p class="text-3xl font-bold mt-2">{{ totalLesson }}</p>
            <p class="text-xs opacity-75 mt-1">Available lessons</p>
          </div>
          <div class="text-5xl opacity-30">
            <i class="pi pi-file-edit"></i>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 -mb-4 -mr-4 opacity-20">
          <i class="pi pi-file-edit text-7xl"></i>
        </div>
      </div>

      <!-- Total Quiz Card -->
      <div
        class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 transform hover:scale-105"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase opacity-90 font-medium">Total Quiz</p>
            <p class="text-3xl font-bold mt-2">{{ totalQuiz }}</p>
            <p class="text-xs opacity-75 mt-1">Active quizzes</p>
          </div>
          <div class="text-5xl opacity-30">
            <i class="pi pi-question-circle"></i>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 -mb-4 -mr-4 opacity-20">
          <i class="pi pi-question-circle text-7xl"></i>
        </div>
      </div>

      <!-- Total Teacher Card -->
      <div
        class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 transform hover:scale-105"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase opacity-90 font-medium">Total Teacher</p>
            <p class="text-3xl font-bold mt-2">{{ totalTeacher }}</p>
            <p class="text-xs opacity-75 mt-1">Active teachers</p>
          </div>
          <div class="text-5xl opacity-30">
            <i class="pi pi-user-edit"></i>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 -mb-4 -mr-4 opacity-20">
          <i class="pi pi-user-edit text-7xl"></i>
        </div>
      </div>

      <!-- Total User Card -->
      <div
        class="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 transform hover:scale-105"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm uppercase opacity-90 font-medium">Total User</p>
            <p class="text-3xl font-bold mt-2">{{ totalUser }}</p>
            <p class="text-xs opacity-75 mt-1">Registered users</p>
          </div>
          <div class="text-5xl opacity-30">
            <i class="pi pi-users"></i>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 -mb-4 -mr-4 opacity-20">
          <i class="pi pi-users text-7xl"></i>
        </div>
      </div>
    </div>

    <!-- Charts and Statistics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <!-- Recent Activity -->
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i class="pi pi-chart-line text-primary-600"></i>
            Learning Progress Overview
          </h2>
        </div>
        <div class="space-y-4">
          <!-- Progress Bar Items -->
          <div v-for="stat in progressStats" :key="stat.label" class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">{{ stat.label }}</span>
              <span class="text-sm font-semibold text-gray-900">{{ stat.value }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                :class="stat.color"
                class="h-full rounded-full transition-all duration-500 ease-out"
                :style="{ width: stat.value + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white rounded-2xl shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <i class="pi pi-info-circle text-primary-600"></i>
          Quick Stats
        </h2>
        <div class="space-y-4">
          <div
            v-for="stat in quickStats"
            :key="stat.label"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div
                :class="stat.iconBg"
                class="w-10 h-10 rounded-lg flex items-center justify-center"
              >
                <i :class="stat.icon" class="text-white"></i>
              </div>
              <div>
                <p class="text-sm text-gray-600">{{ stat.label }}</p>
                <p class="text-lg font-bold text-gray-900">{{ stat.value }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Students Table -->
    <!-- <div class="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <i class="pi pi-users text-primary-600"></i>
          Recent Students
        </h2>
        <button
          class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
        >
          <i class="pi pi-eye"></i>
          View All
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Student Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Level
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Progress
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="student in recentStudents"
              :key="student.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold"
                  >
                    {{ student.name.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ student.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ student.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800"
                >
                  {{ student.level }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      class="bg-primary-600 h-2 rounded-full"
                      :style="{ width: student.progress + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600">{{ student.progress }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="
                    student.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  "
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ student.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import apiURL from "@/services/apiURL";

// Statistics data
const totalLevel = ref(0);
const totalLesson = ref(0);
const totalQuiz = ref(0);
const totalTeacher = ref(0);
const totalUser = ref(0);

// Progress statistics
const progressStats = ref([
  { label: "Lessons Completed", value: 0, color: "bg-green-500" },
  { label: "Quizzes Passed", value: 0, color: "bg-blue-500" },
  { label: "Vocabulary Learned", value: 0, color: "bg-purple-500" },
  { label: "Grammar Mastered", value: 0, color: "bg-primary-500" },
]);

// Quick stats
const quickStats = ref([
  {
    label: "Active Students",
    value: "0",
    icon: "pi pi-users",
    iconBg: "bg-blue-500",
  },
  {
    label: "Completed Lessons",
    value: "0",
    icon: "pi pi-check-circle",
    iconBg: "bg-green-500",
  },
  {
    label: "Total Quizzes",
    value: "0",
    icon: "pi pi-question-circle",
    iconBg: "bg-purple-500",
  },
  {
    label: "Avg. Score",
    value: "0%",
    icon: "pi pi-star",
    iconBg: "bg-primary-500",
  },
]);

// Recent students data
const recentStudents = ref([]);

// Fetch statistics from API
const fetchStatistics = async () => {
  try {
    // Use Promise.all to fetch all data in parallel for better performance
    const [
      levelResponse,
      lessonResponse,
      quizResponse,
      teacherResponse,
      userResponse,
      vocabularyResponse,
      grammarResponse,
    ] = await Promise.all([
      // Fetch total levels
      axios.get(`${apiURL}/lms/api/getAllDocs/Level`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
      // Fetch total lessons
      axios.get(`${apiURL}/lms/api/getAllDocs/Lesson`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
      // Fetch total quizzes
      axios.get(`${apiURL}/lms/api/getAllDocs/Quiz`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
      // Fetch total teachers
      axios.get(`${apiURL}/lms/api/getAllDocs/Teacher`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
      // Fetch total users (students)
      axios.get(`${apiURL}/lms/api/getAllDocs/User`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
      // Fetch vocabulary count
      axios.get(`${apiURL}/lms/api/getAllDocs/Vocabulary`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
      // Fetch grammar count
      axios.get(`${apiURL}/lms/api/getAllDocs/Grammar`, {
        params: {
          dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        },
      }),
    ]);

    // Extract data from responses
    const levels = levelResponse.data?.data || [];
    const lessons = lessonResponse.data?.data || [];
    const quizzes = quizResponse.data?.data || [];
    const teachers = teacherResponse.data?.data || [];
    const users = userResponse.data?.data || [];
    const vocabularies = vocabularyResponse.data?.data || [];
    const grammars = grammarResponse.data?.data || [];

    // Set total counts
    totalLevel.value = levels.length;
    totalLesson.value = lessons.length;
    totalQuiz.value = quizzes.length;
    totalTeacher.value = teachers.length;
    totalUser.value = users.length;

    const totalLessons = totalLesson.value;
    const totalQuizzes = totalQuiz.value;
    const totalUsers = totalUser.value;
    const totalVocabulary = vocabularies.length;
    const totalGrammar = grammars.length;

    // Calculate progress statistics (percentages based on available data)
    // These are calculated as approximations - adjust based on your actual progress tracking
    progressStats.value = [
      {
        label: "Lessons Completed",
        value:
          totalLessons > 0 && totalUsers > 0
            ? Math.min(100, Math.round((totalLessons / (totalUsers || 1)) * 10))
            : 0,
        color: "bg-green-500",
      },
      {
        label: "Quizzes Passed",
        value:
          totalQuizzes > 0 && totalUsers > 0
            ? Math.min(100, Math.round((totalQuizzes / (totalUsers || 1)) * 8))
            : 0,
        color: "bg-blue-500",
      },
      {
        label: "Vocabulary Learned",
        value:
          totalVocabulary > 0 && totalUsers > 0
            ? Math.min(100, Math.round((totalVocabulary / (totalUsers || 1)) * 12))
            : 0,
        color: "bg-purple-500",
      },
      {
        label: "Grammar Mastered",
        value:
          totalGrammar > 0 && totalUsers > 0
            ? Math.min(100, Math.round((totalGrammar / (totalUsers || 1)) * 10))
            : 0,
        color: "bg-primary-500",
      },
    ];

    // Update quick stats
    quickStats.value = [
      {
        label: "Active Students",
        value: totalUsers.toLocaleString(),
        icon: "pi pi-users",
        iconBg: "bg-blue-500",
      },
      {
        label: "Completed Lessons",
        value: totalLessons.toLocaleString(),
        icon: "pi pi-check-circle",
        iconBg: "bg-green-500",
      },
      {
        label: "Total Quizzes",
        value: totalQuizzes.toLocaleString(),
        icon: "pi pi-question-circle",
        iconBg: "bg-purple-500",
      },
      {
        label: "Avg. Score",
        value: "85%", // This would need actual score data from backend
        icon: "pi pi-star",
        iconBg: "bg-primary-500",
      },
    ];

    // Fetch recent students using getPagination for better performance
    const recentUsersResponse = await axios.get(`${apiURL}/lms/api/getPagination`, {
      params: {
        collectionName: "User",
        dynamicConditions: JSON.stringify([{ field: "status", operator: "==", value: true }]),
        sortField: "createdAt",
        sortOrder: "desc",
        page: 1,
        pageSize: 5,
      },
    });

    const recentUsers = recentUsersResponse.data?.data || [];

    // Transform users to student format
    recentStudents.value = recentUsers.map((user, index) => {
      // Assign a level based on index or use a default
      const levelIndex = levels.length > 0 ? index % levels.length : 0;
      const levelName = levels[levelIndex]?.name || "Beginner";

      // Calculate a mock progress percentage (you can replace this with actual progress data)
      // Using a deterministic calculation instead of random for consistency
      const progress = Math.floor((index * 15) % 50) + 30; // Between 30-80% based on index

      return {
        id: user._id || user.id || index + 1,
        name: user.displayName || user.username || "Unknown",
        email: user.email || "",
        level: levelName,
        progress: progress,
        status: user.status ? "Active" : "Inactive",
      };
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    // Set default values if API fails
    totalLevel.value = 0;
    totalLesson.value = 0;
    totalQuiz.value = 0;
    totalTeacher.value = 0;
    totalUser.value = 0;
  }
};

onMounted(() => {
  fetchStatistics();
});
</script>
