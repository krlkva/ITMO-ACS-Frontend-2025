import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user
  },
  
  actions: {
    setUser(userData) {
      this.user = userData
      localStorage.setItem('user', JSON.stringify(userData))
    },
    
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  },
  
  persist: true  // сохраняем в localStorage
})