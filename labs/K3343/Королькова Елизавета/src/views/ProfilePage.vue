<template>
  <div class="container my-5">
    <div v-if="!authStore.isAuthenticated" class="text-center py-5">
      <h2>Для просмотра профиля необходимо войти</h2>
      <router-link to="/login" class="btn btn-dark mt-3">Войти</router-link>
    </div>

    <div v-else>
      <!-- Информация о пользователе -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="profile-card">
            <div class="d-flex align-items-center gap-4">
              <div class="user-avatar">
                {{ userInitials }}
              </div>
              <div>
                <h1 class="h3 mb-2">{{ user?.firstName }} {{ user?.lastName }}</h1>
                <p class="text-muted mb-1">
                  <i class="bi bi-envelope me-2"></i>{{ user?.email }}
                </p>
                <p class="text-muted mb-0">
                  <i class="bi bi-telephone me-2"></i>{{ user?.phone || 'Телефон не указан' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Вкладки -->
      <div class="profile-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'bookings' }"
          @click="activeTab = 'bookings'"
        >
          <i class="bi bi-calendar-check me-2"></i>
          Мои бронирования
          <span class="badge bg-secondary ms-2">{{ userBookings.length }}</span>
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'favorites' }"
          @click="activeTab = 'favorites'"
        >
          <i class="bi bi-heart me-2"></i>
          Избранное
          <span class="badge bg-danger ms-2">{{ favoritesCount }}</span>
        </button>
      </div>
      
      <!-- Контент вкладок -->
      <div class="tab-content">
        <!-- Вкладка с бронированиями -->
        <div v-show="activeTab === 'bookings'" class="bookings-tab">
          <div v-if="loadingBookings" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </div>
          </div>
          
          <div v-else-if="userBookings.length === 0" class="empty-state">
            <i class="bi bi-calendar-x" style="font-size: 3rem;"></i>
            <h3 class="h5 mt-3">У вас пока нет бронирований</h3>
            <router-link to="/search" class="btn btn-dark mt-3">
              Найти жилье
            </router-link>
          </div>
          
          <div v-else class="bookings-list">
            <div v-for="booking in userBookings" :key="booking.id" class="booking-item">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h4 class="h6 mb-2">{{ booking.propertyTitle }}</h4>
                  <p class="small text-muted mb-1">
                    <i class="bi bi-calendar me-1"></i>
                    {{ formatDate(booking.startDate) }} — {{ formatDate(booking.endDate) }}
                  </p>
                  <span class="badge" :class="getStatusClass(booking.status)">
                    {{ booking.status }}
                  </span>
                </div>
                <button class="btn btn-sm btn-outline-danger" @click="cancelBooking(booking.id)">
                  Отменить
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Вкладка с избранным -->
        <div v-show="activeTab === 'favorites'" class="favorites-tab">
          <div v-if="loadingFavorites" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Загрузка...</span>
            </div>
          </div>
          
          <div v-else-if="favoriteProperties.length === 0" class="empty-state">
            <i class="bi bi-heart" style="font-size: 3rem;"></i>
            <h3 class="h5 mt-3">В избранном пока пусто</h3>
            <p class="text-muted">Добавляйте понравившиеся объекты, чтобы не потерять их</p>
            <router-link to="/search" class="btn btn-dark mt-3">
              Перейти к поиску
            </router-link>
          </div>
          
          <!-- Отображение избранного -->
          <div v-else class="row g-4">
            <div class="col-md-6 col-lg-4" v-for="property in favoriteProperties" :key="property.id">
              <PropertyCard :property="property" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePropertiesStore } from '@/stores/properties'
import { useBookingsStore } from '@/stores/bookings'
import { useNotification } from '@/composables/useNotification'
import PropertyCard from '@/components/PropertyCard.vue'

const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()
const bookingsStore = useBookingsStore()
const { show } = useNotification()

const activeTab = ref('bookings')
const loadingBookings = ref(false)
const loadingFavorites = ref(false)

// Данные пользователя
const user = computed(() => authStore.user)
const userInitials = computed(() => {
  if (!user.value) return '?'
  const first = user.value.firstName?.[0] || ''
  const last = user.value.lastName?.[0] || ''
  return (first + last).toUpperCase() || '?'
})

// Бронирования
const userBookings = computed(() => {
  return bookingsStore.bookings
    .filter(b => b.userId === user.value?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

// Избранное
const favoriteProperties = computed(() => propertiesStore.favoriteProperties)
const favoritesCount = computed(() => propertiesStore.favoritesCount)

// Форматирование даты
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ru-RU')
}

// Класс для статуса
const getStatusClass = (status) => {
  switch (status) {
    case 'активно': return 'bg-success'
    case 'отменено': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

// Отмена бронирования
const cancelBooking = async (bookingId) => {
  if (confirm('Отменить бронирование?')) {
    try {
      await bookingsStore.cancelBooking(bookingId)
      show('Бронирование отменено', 'success')
    } catch (error) {
      show('Ошибка при отмене', 'error')
    }
  }
}

// Загрузка данных
const loadData = async () => {
  if (!authStore.isAuthenticated) return
  
  loadingBookings.value = true
  loadingFavorites.value = true
  
  try {
    await Promise.all([
      bookingsStore.fetchBookings(),
      propertiesStore.fetchProperties()
    ])
  } catch (error) {
    console.error('Ошибка загрузки:', error)
  } finally {
    loadingBookings.value = false
    loadingFavorites.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.profile-card {
  background-color: var(--bg-card);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border-light);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--badge-bg);
  color: var(--badge-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
}

.profile-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 2rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  color: var(--text-muted);
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  color: var(--text-primary);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--link-color);
}

.tab-content {
  min-height: 300px;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  background-color: var(--bg-card);
  border-radius: 16px;
  border: 1px dashed var(--border-light);
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-item {
  padding: 1.5rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.booking-item:hover {
  box-shadow: var(--card-shadow-hover);
}

@media (max-width: 768px) {
  .profile-tabs {
    flex-direction: column;
    border-bottom: none;
  }
  
  .tab-btn.active::after {
    display: none;
  }
  
  .tab-btn.active {
    background-color: var(--bg-hover);
    border-radius: 8px;
  }
}
</style>