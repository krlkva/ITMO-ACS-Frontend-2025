<!-- src/components/layout/TheHeader.vue -->
<template>
  <header>
    <nav class="navbar navbar-expand-lg" :class="{'navbar-dark': isDark, 'navbar-light': !isDark}">
      <div class="container">
        <!-- Логотип -->
        <router-link class="navbar-brand" to="/">
          <i class="bi bi-house-heart me-2"></i>
          MyHome
        </router-link>
        
        <!-- Кнопка для мобильной версии -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <!-- Навигация -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/search">
                <i class="bi bi-search me-1"></i> Поиск
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="bi bi-star me-1"></i> Популярные
              </router-link>
            </li>
          </ul>
          
          <!-- Правая часть меню -->
          <div class="d-flex gap-2 align-items-center">
            <!-- Переключатель темы (будет отдельный компонент) -->
            <ThemeToggle />
            
            <!-- Если пользователь не авторизован -->
            <template v-if="!user">
              <router-link to="/login" class="btn btn-outline-dark">
                <i class="bi bi-box-arrow-in-right me-1"></i> Вход
              </router-link>
              <router-link to="/register" class="btn btn-dark">
                <i class="bi bi-person-plus me-1"></i> Регистрация
              </router-link>
            </template>
            
            <!-- Если пользователь авторизован -->
            <template v-else>
              <router-link to="/profile" class="btn btn-outline-dark">
                <i class="bi bi-person-circle me-1"></i> {{ user.firstName }}
              </router-link>
              <button class="btn btn-outline-dark" @click="logout">
                <i class="bi bi-box-arrow-right"></i>
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const logout = () => {
  authStore.logout()
  window.location.href = '/'
}
</script>