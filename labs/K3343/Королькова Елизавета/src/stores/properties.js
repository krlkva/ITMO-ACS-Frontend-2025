import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from './auth'

export const usePropertiesStore = defineStore('properties', {
  state: () => ({
    properties: [],
    currentProperty: null,
    favorites: {}  // { userId: [propertyIds] }
  }),
  
  getters: {
    // Получить объект по ID
    getPropertyById: (state) => (id) => {
      return state.properties.find(p => p.id === Number(id))
    },
    
    // Проверить, есть ли объект в избранном для текущего пользователя
    isFavorite: (state) => (propertyId) => {
      const authStore = useAuthStore()
      if (!authStore.user) return false
      
      const userFavorites = state.favorites[authStore.user.id] || []
      // Приводим к одному типу (числа)
      return userFavorites.includes(Number(propertyId))
    },
    
    // Получить все избранные объекты для текущего пользователя
    favoriteProperties: (state) => {
      const authStore = useAuthStore()
      if (!authStore.user) {
        console.log('Нет пользователя')
        return []
      }
      
      const userId = authStore.user.id
      const userFavorites = state.favorites[userId] || []
      
      console.log('userId:', userId)
      console.log('userFavorites (числа):', userFavorites)
      console.log('Все объекты (id):', state.properties.map(p => p.id))
      
      // Важно: приводим p.id к числу для сравнения
      const result = state.properties.filter(p => {
        return userFavorites.includes(Number(p.id))
      })
      
      console.log('Найдено объектов в избранном:', result.length)
      console.log('Результат:', result.map(p => ({ id: p.id, title: p.title })))
      
      return result
    },
    
    // Количество избранного для текущего пользователя
    favoritesCount: (state) => {
      const authStore = useAuthStore()
      if (!authStore.user) return 0
      
      return (state.favorites[authStore.user.id] || []).length
    }
  },
  
  actions: {
    // Инициализация - загружаем избранное из localStorage
    initFavorites() {
      const saved = localStorage.getItem('favorites')
      if (saved) {
        try {
          this.favorites = JSON.parse(saved)
          console.log('Загружено избранное из localStorage:', this.favorites)
        } catch (e) {
          console.error('Ошибка загрузки избранного:', e)
          this.favorites = {}
        }
      } else {
        this.favorites = {}
      }
    },
    
    // Загрузить все объекты
    async fetchProperties() {
      const { get } = useApi()
      try {
        const data = await get('/properties')
        this.properties = data
        console.log('Загружено объектов с сервера:', data.length)
        return data
      } catch (error) {
        console.error('Ошибка загрузки объектов:', error)
        throw error
      }
    },
    
    // Загрузить конкретный объект
    async fetchProperty(id) {
      const { get } = useApi()
      try {
        this.currentProperty = await get(`/properties/${id}`)
        return this.currentProperty
      } catch (error) {
        console.error('Ошибка загрузки объекта:', error)
        throw error
      }
    },
    
    // Переключить избранное для текущего пользователя
    toggleFavorite(propertyId) {
      const authStore = useAuthStore()
      
      if (!authStore.user) {
        console.log('Пользователь не авторизован')
        return false
      }
      
      const userId = authStore.user.id
      // Важно: сохраняем как ЧИСЛО
      const id = Number(propertyId)
      
      // Создаем копию объекта
      const newFavorites = { ...this.favorites }
      
      // Создаем массив для пользователя, если его нет
      if (!newFavorites[userId]) {
        newFavorites[userId] = []
      }
      
      const index = newFavorites[userId].indexOf(id)
      
      if (index === -1) {
        // Добавляем в избранное
        newFavorites[userId].push(id)
        console.log(`Добавлено в избранное пользователя ${userId}:`, id)
      } else {
        // Удаляем из избранного
        newFavorites[userId].splice(index, 1)
        console.log(`Удалено из избранного пользователя ${userId}:`, id)
        
        // Если массив стал пустым, удаляем запись о пользователе
        if (newFavorites[userId].length === 0) {
          delete newFavorites[userId]
        }
      }
      
      // Обновляем состояние
      this.favorites = newFavorites
      
      // Сохраняем в localStorage
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
      console.log('Сохранено в localStorage:', this.favorites)
      
      return true
    },
    
    // Очистить избранное для текущего пользователя
    clearFavorites() {
      const authStore = useAuthStore()
      if (!authStore.user) return
      
      const newFavorites = { ...this.favorites }
      delete newFavorites[authStore.user.id]
      this.favorites = newFavorites
      
      localStorage.setItem('favorites', JSON.stringify(this.favorites))
    }
  }
})