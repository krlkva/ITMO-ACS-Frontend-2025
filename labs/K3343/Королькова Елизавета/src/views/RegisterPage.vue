<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Регистрация</h1>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Имя и Фамилия в одной строке -->
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="firstName">Имя</label>
            <input 
              type="text" 
              id="firstName" 
              v-model="form.firstName" 
              class="form-control" 
              :class="{ 'is-invalid': errors.firstName }"
              required
            >
            <div v-if="errors.firstName" class="invalid-feedback">
              {{ errors.firstName }}
            </div>
          </div>
          
          <div class="col-md-6 mb-3">
            <label for="lastName">Фамилия</label>
            <input 
              type="text" 
              id="lastName" 
              v-model="form.lastName" 
              class="form-control"
              :class="{ 'is-invalid': errors.lastName }"
            >
          </div>
        </div>
        
        <!-- Email -->
        <div class="mb-3">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            class="form-control" 
            :class="{ 'is-invalid': errors.email }"
            required
          >
          <div v-if="errors.email" class="invalid-feedback">
            {{ errors.email }}
          </div>
        </div>
        
        <!-- Телефон -->
        <div class="mb-3">
          <label for="phone">Телефон</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="form.phone" 
            class="form-control"
            placeholder="+7 (999) 123-45-67"
          >
        </div>
        
        <!-- Пароль -->
        <div class="mb-3">
          <label for="password">Пароль</label>
          <input 
            type="password" 
            id="password" 
            v-model="form.password" 
            class="form-control" 
            :class="{ 'is-invalid': errors.password }"
            required 
            minlength="6"
          >
          <small class="form-text text-muted">Минимум 6 символов</small>
          <div v-if="errors.password" class="invalid-feedback">
            {{ errors.password }}
          </div>
        </div>
        
        <!-- Подтверждение пароля -->
        <div class="mb-3">
          <label for="confirmPassword">Подтвердите пароль</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="form.confirmPassword" 
            class="form-control" 
            :class="{ 'is-invalid': errors.confirmPassword }"
            required
          >
          <div v-if="errors.confirmPassword" class="invalid-feedback">
            {{ errors.confirmPassword }}
          </div>
        </div>
        
        <!-- Общая ошибка -->
        <div v-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <!-- Кнопка отправки -->
        <button 
          type="submit" 
          class="btn btn-dark w-100 py-3" 
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Зарегистрироваться
        </button>
        
        <!-- Ссылка на вход -->
        <p class="text-center mt-3">
          Уже есть аккаунт? <router-link to="/login">Войти</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const authStore = useAuthStore()
const { show } = useNotification()

// Данные формы
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// Ошибки валидации
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref(null)

// Валидация формы
const validateForm = () => {
  let isValid = true
  
  // Сброс ошибок
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Проверка имени
  if (!form.firstName.trim()) {
    errors.firstName = 'Введите имя'
    isValid = false
  }
  
  // Проверка email
  if (!form.email.trim()) {
    errors.email = 'Введите email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Введите корректный email'
    isValid = false
  }
  
  // Проверка пароля
  if (!form.password) {
    errors.password = 'Введите пароль'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Пароль должен быть минимум 6 символов'
    isValid = false
  }
  
  // Проверка подтверждения пароля
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
    isValid = false
  }
  
  return isValid
}

// Отправка формы
const handleSubmit = async () => {
  // Валидация
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    // Подготавливаем данные для отправки (убираем confirmPassword)
    const { confirmPassword, ...userData } = form
    
    console.log('Отправляем данные:', userData)
    
    // Отправляем запрос на регистрацию
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...userData,
        id: Date.now() // создаём уникальный ID
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      // Успешная регистрация
      authStore.setUser(data)
      show('Регистрация успешна!', 'success')
      
      // Перенаправляем в профиль
      setTimeout(() => router.push('/profile'), 1500)
    } else {
      // Ошибка от сервера
      throw new Error(data.message || 'Ошибка при регистрации')
    }
    
  } catch (err) {
    console.error('Ошибка регистрации:', err)
    
    // Проверяем, может email уже существует
    if (err.message.includes('unique') || err.message.includes('already exists')) {
      error.value = 'Пользователь с таким email уже существует'
    } else {
      error.value = err.message || 'Ошибка при регистрации'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 500px;
  margin: 2rem auto;
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

/* Стили для полей с ошибками */
.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Фиксируем ширину полей */
.form-control {
  width: 100%;
  box-sizing: border-box;
}

/* Для мобильных устройств */
@media (max-width: 768px) {
  .auth-container {
    max-width: 100%;
    margin: 1rem;
  }
  
  .auth-card {
    padding: 1.5rem;
  }
}
</style>