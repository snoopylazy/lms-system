<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden h-full',
        sidebarOpen ? 'w-64' : 'w-0 md:w-20',
        'fixed md:relative z-50 md:z-auto'
      ]"
    >
      <div class="h-full flex flex-col">
        <!-- Sidebar Header -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <transition name="fade">
            <h1 v-if="sidebarOpen" class="text-xl font-bold text-gray-800">
              Learning Platform
            </h1>
            <div v-else class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <i class="pi pi-graduation-cap text-white text-sm"></i>
            </div>
          </transition>
        </div>

        <!-- Sidebar Navigation -->
        <nav class="flex-1 overflow-y-auto py-4">
          <ul class="space-y-1 px-2">
            <li>
              <router-link
                to="/admin"
                class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                :class="{ 'bg-primary-50 text-primary-600': $route.name === 'dashboard' }"
              >
                <i class="pi pi-home text-lg"></i>
                <transition name="fade">
                  <span v-if="sidebarOpen" class="ml-3 font-medium">Dashboard</span>
                </transition>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/level"
                class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                :class="{ 'bg-primary-50 text-primary-600': $route.name === 'level' }"
              >
                <i class="pi pi-sort-alt text-lg"></i>
                <transition name="fade">
                  <span v-if="sidebarOpen" class="ml-3 font-medium">Level</span>
                </transition>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/grammar"
                class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                :class="{ 'bg-primary-50 text-primary-600': $route.name === 'grammar' }"
              >
                <i class="pi pi-book text-lg"></i>
                <transition name="fade">
                  <span v-if="sidebarOpen" class="ml-3 font-medium">Grammar</span>
                </transition>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/quiz"
                class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                :class="{ 'bg-primary-50 text-primary-600': $route.name === 'quiz' }"
              >
                <i class="pi pi-question-circle text-lg"></i>
                <transition name="fade">
                  <span v-if="sidebarOpen" class="ml-3 font-medium">Quiz</span>
                </transition>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/lesson"
                class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                :class="{ 'bg-primary-50 text-primary-600': $route.name === 'lesson' }"
              >
                <i class="pi pi-file-edit text-lg"></i>
                <transition name="fade">
                  <span v-if="sidebarOpen" class="ml-3 font-medium">Lesson</span>
                </transition>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/vocabulary"
                class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                :class="{ 'bg-primary-50 text-primary-600': $route.name === 'vocabulary' }"
              >
                <i class="pi pi-list text-lg"></i>
                <transition name="fade">
                  <span v-if="sidebarOpen" class="ml-3 font-medium">Vocabulary</span>
                </transition>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/teacher"
                class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                :class="{ 'bg-primary-50 text-primary-600': $route.name === 'teacher' }"
              >
                <i class="pi pi-user-edit text-lg"></i>
                <transition name="fade">
                  <span v-if="sidebarOpen" class="ml-3 font-medium">Teacher</span>
                </transition>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/user"
                class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                :class="{ 'bg-primary-50 text-primary-600': $route.name === 'user' }"
              >
                <i class="pi pi-users text-lg"></i>
                <transition name="fade">
                  <span v-if="sidebarOpen" class="ml-3 font-medium">User</span>
                </transition>
              </router-link>
            </li>
            <li>
              <router-link
                to="/admin/report"
                class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                :class="{ 'bg-primary-50 text-primary-600': $route.name === 'report' }"
              >
                <i class="pi pi-chart-bar text-lg"></i>
                <transition name="fade">
                  <span v-if="sidebarOpen" class="ml-3 font-medium">Report</span>
                </transition>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Logout Button in Sidebar -->
        <div class="px-2 pb-4 border-t border-gray-200 pt-4">
          <button
            @click="handleLogout"
            class="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <i class="pi pi-sign-out text-lg"></i>
            <transition name="fade">
              <span v-if="sidebarOpen" class="ml-3">Logout</span>
            </transition>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
        <div class="flex items-center space-x-4">
          <!-- Sidebar Toggle Button -->
          <button
            @click="toggleSidebar"
            class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <i class="pi pi-bars text-xl"></i>
          </button>

          <!-- Breadcrumb or Page Title -->
          <div class="hidden md:block">
            <h2 class="text-lg font-semibold text-gray-800">
              {{ pageTitle }}
            </h2>
          </div>
        </div>

        <!-- Navbar Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Search (optional) -->
          <div class="relative">
            <input
              type="text"
              placeholder="Search..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
            <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-3">
            <div class="hidden md:block text-right">
              <p class="text-sm font-medium text-gray-800">
                {{ userData?.displayName || userData?.username || 'User' }}
              </p>
              <p class="text-xs text-gray-500">
                {{ userData?.email || '' }}
              </p>
            </div>
            <div class="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <i class="pi pi-user text-white"></i>
            </div>
            
            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-sm"
              title="Logout"
            >
              <i class="pi pi-sign-out mr-2"></i>
              <span class="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <router-view />
      </main>
    </div>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBranchStore } from '@/store/branch'
import { fetchUserById } from '@/composables/fetchUserByID'

const route = useRoute()
const router = useRouter()
const branchStore = useBranchStore()
const sidebarOpen = ref(true)
const userData = ref(null)
const isLoadingUser = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const pageTitle = computed(() => {
  // You can customize this based on the route
  return route.meta?.title || 'Dashboard'
})

// Handle logout
const handleLogout = () => {
  // Show confirmation dialog
  if (confirm('Are you sure you want to logout?')) {
    // Clear authentication token
    localStorage.removeItem('token')
    
    // Clear any other stored data if needed
    localStorage.removeItem('userId')
    
    // Redirect to login page
    router.push('/login')
  }
}

// Fetch user data
const loadUserData = async () => {
  try {
    // Import getUserId composable for fallback logic
    const { getUserId } = await import('@/composables/getUserId');
    const userId = await getUserId();
    
    if (!userId) {
      console.warn('No userId found');
      return;
    }

    isLoadingUser.value = true;
    const user = await fetchUserById();
    if (user) {
      userData.value = user;
      console.log('User data loaded:', user);
    } else {
      console.warn('User data not found');
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  } finally {
    isLoadingUser.value = false;
  }
}

// Handle responsive behavior
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      sidebarOpen.value = true
    } else {
      sidebarOpen.value = false
    }
  }

  handleResize()
  window.addEventListener('resize', handleResize)
  
  // Load user data when component mounts
  loadUserData()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
