import Dashboard from '@/views/admin/dashboard.vue'
import Default from '@/views/admin/default.vue'
import Level from '@/views/admin/level.vue'
import Grammar from '@/views/admin/grammar.vue'
import Quiz from '@/views/admin/quiz.vue'
import Lesson from '@/views/admin/lesson.vue'
import Vocabulary from '@/views/admin/vocabulary.vue'
import Teacher from '@/views/admin/teacher.vue'
import User from '@/views/admin/user.vue'
import Report from '@/views/admin/report.vue'
import MainPage from '@/views/client/mainPage.vue'
import GrammarLessonList from '@/views/client/GrammarLessonList.vue'
import LessonView from '@/views/client/lessonview.vue'
import QuizView from '@/views/client/quizView.vue'
import Role from '@/views/admin/role.vue'
import { createRouter, createWebHistory } from 'vue-router'
import SuperAdmin from '@/views/auth/superAdmin.vue'
import { isAuthenticated } from '@/composables/checkAuthentication'
import axios from 'axios'
import apiURL from '@/services/apiURL'

// Check if user is authenticated for admin routes
const requireAuth = async (to, from, next) => {
  if (isAuthenticated()) {
    next();
  } else {
    // Check if any users exist in the system
    try {
      const response = await axios.get(`${apiURL}/lms/api/getAllDocs/User`, {
        params: {
          dynamicConditions: JSON.stringify([]),
          limit: 1
        }
      });
      
      // If no users exist, redirect to super admin login
      if (!response.data?.data || response.data.data.length === 0) {
        next("/superadminlms");
      } else {
        // Users exist, redirect to regular login
        next("/login");
      }
    } catch (error) {
      console.error("Error checking users:", error);
      // On error, try super admin login
      next("/superadminlms");
    }
  }
};

// Redirect to admin dashboard if already logged in
const redirectIfAuthenticated = (to, from, next) => {
  if (isAuthenticated()) {
    next("/admin");
  } else {
    next();
  }
};

const routes = [
  // Client mainpage - public access, no login required
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
  },
  {
    path: '/client/grammar',
    name: 'ClientGrammar',
    component: GrammarLessonList,
  },
  {
    path: '/client/lessons',
    name: 'ClientLessonList',
    component: () => import('@/views/client/LessonList.vue'),
  },
  {
    path: '/client/grammar/:id',
    name: 'ClientLessonView',
    component: LessonView,
    props: true,
  },
  {
    path: '/client/lesson/:id',
    name: 'ClientLesson',
    component: LessonView,
    props: true,
  },
  {
    path: '/client/quiz/:id',
    name: 'ClientQuizView',
    component: QuizView,
    props: true,
  },

  // Admin routes - require authentication
  {
    path: '/admin',
    name: 'admin',
    component: Default,
    beforeEnter: requireAuth,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'level',
        name: 'level',
        component: Level,
        meta: { title: 'Level' }
      },
      {
        path: 'grammar',
        name: 'grammar',
        component: Grammar,
        meta: { title: 'Grammar' }
      },
      {
        path: 'quiz',
        name: 'quiz',
        component: Quiz,
        meta: { title: 'Quiz' }
      },
      {
        path: 'lesson',
        name: 'lesson',
        component: Lesson,
        meta: { title: 'Lesson' }
      },
      {
        path: 'vocabulary',
        name: 'vocabulary',
        component: Vocabulary,
        meta: { title: 'Vocabulary' }
      },
      {
        path: 'teacher',
        name: 'teacher',
        component: Teacher,
        meta: { title: 'Teacher' }
      },
      {
        path: 'user',
        name: 'user',
        component: User,
        meta: { title: 'User' }
      },
      {
        path: 'report',
        name: 'report',
        component: Report,
        meta: { title: 'Report' }
      },
      {
        path: 'role',
        name: 'role',
        component: Role,
        meta: { title: 'Role' }
      }
    ]
  },

  // Legacy routes - redirect to admin routes
  {
    path: '/level',
    redirect: '/admin/level'
  },
  {
    path: '/grammar',
    redirect: '/admin/grammar'
  },
  {
    path: '/quiz',
    redirect: '/admin/quiz'
  },
  {
    path: '/lesson',
    redirect: '/admin/lesson'
  },
  {
    path: '/vocabulary',
    redirect: '/admin/vocabulary'
  },
  {
    path: '/teacher',
    redirect: '/admin/teacher'
  },
  {
    path: '/user',
    redirect: '/admin/user'
  },
  {
    path: '/report',
    redirect: '/admin/report'
  },
  {
    path: '/dashboard',
    redirect: '/admin'
  },

  // Super Admin login - for initial setup
  {
    path: "/superadminlms",
    name: "SuperAdminLMS",
    component: SuperAdmin,
    beforeEnter: redirectIfAuthenticated,
  },
  
  // Regular login - redirect if already authenticated
  {
    path: "/login",
    component: () => import("@/views/auth/login.vue"),
    name: "login",
    beforeEnter: redirectIfAuthenticated,
  },

  // 404 page
  {
    path: "/not-Found",
    component: () => import("@/views/notFound.vue"),
    name: "not-Found",
  },

  // Catch all - redirect to 404
  {
    path: "/:pathMatch(.*)*",
    redirect: "/not-Found",
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
