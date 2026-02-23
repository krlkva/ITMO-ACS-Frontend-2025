import { ref, watch } from 'vue'

export function useTheme() {
  // Состояние темы
  const isDark = ref(localStorage.getItem('theme') === 'dark' || false)
  
  // Применяем тему к документу
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
  
  // Переключение темы
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }
  
  // Следим за системной темой
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
  if (!localStorage.getItem('theme')) {
    isDark.value = prefersDark.matches
    applyTheme()
  }
  
  // Применяем при создании
  applyTheme()
  
  return {
    isDark,
    toggleTheme
  }
}