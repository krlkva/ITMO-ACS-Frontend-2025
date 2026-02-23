<template>
  <div class="container my-5">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/">Главная</router-link></li>
        <li class="breadcrumb-item"><router-link to="/search">Поиск</router-link></li>
        <li class="breadcrumb-item active">{{ property?.title || 'Загрузка...' }}</li>
      </ol>
    </nav>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>

    <div v-else-if="error" class="text-center py-5 text-danger">
      {{ error }}
    </div>

    <div v-else-if="!property" class="text-center py-5">
      <h2>Объект не найден</h2>
      <router-link to="/search" class="btn btn-dark mt-3">Вернуться к поиску</router-link>
    </div>

    <div v-else class="property-detail">
      <!-- Левая колонка -->
      <div class="property-info">
        <img :src="property.image" :alt="property.title" class="main-image">
        
        <h1>{{ property.title }}</h1>
        
        <div class="property-address">
          <span class="text-muted">
            <i class="bi bi-geo-alt"></i> {{ property.address }}
          </span>
          <span class="text-muted">
            <i class="bi bi-arrows-angle-expand"></i> {{ property.area }} м²
          </span>
          <span v-if="property.floor" class="text-muted">
            <i class="bi bi-stairs"></i> {{ property.floor }} этаж
          </span>
        </div>
        
        <div class="badge-soft mb-4">{{ property.type }}</div>
        
        <h2>Описание</h2>
        <p class="text-muted">{{ property.description }}</p>
        
        <h2>Удобства</h2>
        <ul class="amenities-list">
          <li v-for="amenity in property.amenities" :key="amenity">
            <i class="bi bi-check-lg"></i>
            {{ amenity }}
          </li>
        </ul>
      </div>
      
      <!-- Правая колонка -->
      <div class="property-sidebar">
        <div class="property-detail-price">
          {{ formatPrice(property.price) }} <span class="period">₽/мес</span>
        </div>
        
        <hr>
        
        <!-- Форма бронирования -->
        <div class="booking-form">
          <h3>Забронировать</h3>
          <div class="form-group mb-3">
            <label for="startDate">Дата заезда</label>
            <input 
              type="date" 
              class="form-control" 
              id="startDate" 
              v-model="booking.startDate"
              :min="today"
            >
          </div>
          <div class="form-group mb-3">
            <label for="endDate">Дата выезда</label>
            <input 
              type="date" 
              class="form-control" 
              id="endDate" 
              v-model="booking.endDate"
              :min="booking.startDate || today"
            >
          </div>
          <button 
            class="btn btn-dark w-100" 
            @click="createBooking" 
            :disabled="bookingLoading"
          >
            <span v-if="bookingLoading" class="spinner-border spinner-border-sm me-2"></span>
            Забронировать
          </button>
        </div>
        
        <hr>
        
        <!-- Информация об арендодателе -->
        <div class="owner-info">
          <div class="owner-avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <div>
            <div class="fw-semibold">{{ property.owner?.name || 'Анна Иванова' }}</div>
            <div class="text-muted small">На сайте с 2022</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore } from '@/stores/properties'
import { useBookingsStore } from '@/stores/bookings'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const propertiesStore = usePropertiesStore()
const bookingsStore = useBookingsStore()
const authStore = useAuthStore()
const { show } = useNotification()  // Получаем функцию показа уведомлений

const loading = ref(false)
const bookingLoading = ref(false)
const error = ref(null)
const property = ref(null)
const booking = ref({
  startDate: '',
  endDate: ''
})

// Сегодняшняя дата для min атрибута
const today = computed(() => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const propertyId = computed(() => Number(route.params.id))

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price || 0)
}

const createBooking = async () => {
  // Проверка авторизации
  if (!authStore.isAuthenticated) {
    show('Войдите, чтобы забронировать', 'warning')
    router.push('/login')
    return
  }
  
  // Проверка дат
  if (!booking.value.startDate || !booking.value.endDate) {
    show('Выберите даты заезда и выезда', 'warning')
    return
  }
  
  // Проверка, что дата выезда позже даты заезда
  if (new Date(booking.value.endDate) <= new Date(booking.value.startDate)) {
    show('Дата выезда должна быть позже даты заезда', 'error')
    return
  }
  
  bookingLoading.value = true
  try {
    await bookingsStore.createBooking({
      userId: authStore.user.id,
      propertyId: propertyId.value,
      propertyTitle: property.value.title,
      startDate: booking.value.startDate,
      endDate: booking.value.endDate,
      status: 'активно'
    })
    
    // УСПЕХ - показываем уведомление
    show('Бронирование успешно создано!')
    
    // Очищаем форму
    booking.value = { startDate: '', endDate: '' }
    
  } catch (err) {
    console.error('Ошибка бронирования:', err)
    show('Ошибка при создании бронирования', 'error')
  } finally {
    bookingLoading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null
  
  try {
    // Сначала пробуем найти в сторе
    property.value = propertiesStore.getPropertyById(propertyId.value)
    
    // Если не нашли - загружаем с сервера
    if (!property.value) {
      await propertiesStore.fetchProperty(propertyId.value)
      property.value = propertiesStore.currentProperty
    }
    
    if (!property.value) {
      error.value = 'Объект не найден'
    }
  } catch (err) {
    console.error('Ошибка загрузки:', err)
    error.value = 'Ошибка загрузки данных'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.property-detail {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.main-image {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.property-address {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.amenities-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
}

.amenities-list li {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.property-sidebar {
  position: sticky;
  top: 20px;
  background-color: var(--bg-card);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-light);
  height: fit-content;
}

.property-detail-price {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.property-detail-price .period {
  font-size: 1rem;
  color: var(--text-muted);
  font-weight: normal;
}

.owner-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.owner-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--badge-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--badge-text);
}

@media (max-width: 768px) {
  .property-detail {
    grid-template-columns: 1fr;
  }
  
  .property-sidebar {
    position: static;
  }
}
</style>