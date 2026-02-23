<template>
  <button class="btn btn-outline-dark rounded-circle p-2" 
          @click="toggleTheme"
          :style="{ width: '42px', height: '42px' }"
          :aria-label="isDark ? 'Включить светлую тему' : 'Включить тёмную тему'">
    <i :class="isDark ? 'bi bi-moon-fill' : 'bi bi-sun-fill'"></i>
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>