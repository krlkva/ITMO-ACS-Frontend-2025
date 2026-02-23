<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Вход</h1>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="form.email" 
                 class="form-control" required>
        </div>
        
        <div class="form-group">
          <label for="password">Пароль</label>
          <input type="password" id="password" v-model="form.password" 
                 class="form-control" required>
        </div>
        
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <button type="submit" class="btn btn-dark w-100 py-3" 
                :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Войти
        </button>
        
        <p class="text-center mt-3">
          Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApi } from '@/composables/useApi'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const authStore = useAuthStore()
const { post } = useApi()
const { show } = useNotification()

const form = ref({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await post('/login', form.value)
    authStore.setUser(response.user)
    authStore.setToken(response.accessToken)
    show('Вход выполнен!', 'success')
    setTimeout(() => router.push('/profile'), 1500)
  } catch (err) {
    error.value = 'Неверный email или пароль'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 3rem auto;
}

.auth-card {
  background-color: var(--bg-card);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: var(--card-shadow);
}

.auth-title {
  color: var(--text-primary);
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
}
</style>