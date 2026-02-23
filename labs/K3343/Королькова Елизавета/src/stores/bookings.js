import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'
import { useAuthStore } from './auth'

export const useBookingsStore = defineStore('bookings', {
  state: () => ({
    bookings: []
  }),
  
  getters: {
    userBookings: (state) => {
      const authStore = useAuthStore()
      if (!authStore.user) return []
      return state.bookings.filter(b => b.userId === authStore.user.id)
    }
  },
  
  actions: {
    async fetchBookings() {
      const { get } = useApi()
      try {
        this.bookings = await get('/bookings')
      } catch (error) {
        console.error('Ошибка загрузки бронирований:', error)
      }
    },
    
    async createBooking(bookingData) {
      const { post } = useApi()
      try {
        const newBooking = await post('/bookings', {
          ...bookingData,
          createdAt: new Date().toISOString()
        })
        this.bookings.push(newBooking)
        return newBooking
      } catch (error) {
        console.error('Ошибка создания бронирования:', error)
        throw error
      }
    },
    
    async cancelBooking(bookingId) {
      const { delete: del } = useApi()
      try {
        await del(`/bookings/${bookingId}`)
        this.bookings = this.bookings.filter(b => b.id !== bookingId)
      } catch (error) {
        console.error('Ошибка отмены бронирования:', error)
        throw error
      }
    }
  }
})