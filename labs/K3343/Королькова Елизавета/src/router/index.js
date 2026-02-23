import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Импортируем страницы
import HomePage from '@/views/HomePage.vue'
import SearchPage from '@/views/SearchPage.vue'
import PropertyPage from '@/views/PropertyPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage
  },
  {
    path: '/property/:id',
    name: 'property',
    component: PropertyPage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { guest: true }  // только для гостей
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { guest: true }  // только для гостей
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }  // только для авторизованных
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Защита маршрутов
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Если нужна авторизация, а пользователь не авторизован
    next('/login')
  } else if (to.meta.guest && authStore.isAuthenticated) {
    // Если маршрут для гостей, а пользователь авторизован
    next('/profile')
  } else {
    next()
  }
})

export default router
