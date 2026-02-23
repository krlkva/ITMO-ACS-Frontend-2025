<template>
  <div class="property-card">
    <router-link :to="`/property/${property.id}`" class="text-decoration-none">
      <img :src="property.image" class="property-img" :alt="property.title">
      <div class="card-body">
        <h3 class="h5 mb-2" :style="{ color: isDark ? '#f0f0f0' : '#1a1a1a' }">
          {{ property.title }}
        </h3>
        <p class="text-muted small mb-3">
          <i class="bi bi-geo-alt me-1"></i>
          {{ property.address }}
        </p>
        
        <div class="d-flex justify-content-between align-items-center">
          <span class="property-price">
            {{ formatPrice(property.price) }} ₽/мес
          </span>
          
          <div class="d-flex gap-2">
            <!-- Кнопка избранного -->
            <button 
              class="btn btn-sm favorite-btn" 
              :class="[ 
                isFavorite ? 'btn-danger' : 'btn-outline-danger',
                { 'active': isFavorite }
              ]"
              @click.stop="toggleFavorite"
              :disabled="!isAuthenticated"
              :aria-label="isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'"
            >
              <i :class="isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
            </button>
            
            <router-link :to="`/property/${property.id}`" class="btn btn-outline-dark btn-sm">
              Подробнее
            </router-link>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertiesStore } from '@/stores/properties'
import { useAuthStore } from '@/stores/auth'
import { useNotification } from '@/composables/useNotification'
import { useTheme } from '@/composables/useTheme'

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const propertiesStore = usePropertiesStore()
const authStore = useAuthStore()
const { show } = useNotification()  // Получаем функцию показа уведомлений
const { isDark } = useTheme()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isFavorite = computed(() => propertiesStore.isFavorite(props.property.id))

const toggleFavorite = (event) => {
  event.stopPropagation()
  event.preventDefault()
  
  // Проверяем авторизацию
  if (!isAuthenticated.value) {
    show('Войдите, чтобы добавлять в избранное', 'warning')
    router.push('/login')
    return
  }
  
  const wasFavorite = isFavorite.value
  const success = propertiesStore.toggleFavorite(props.property.id)
  
  if (success) {
    if (wasFavorite) {
      show('Удалено из избранного')
    } else {
      show('Добавлено в избранное')
    }
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price)
}
</script>

<style scoped>
.property-card {
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  background-color: var(--bg-card);
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--card-shadow-hover);
}

.property-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
}

.favorite-btn {
  transition: all 0.2s ease;
  min-width: 38px;
}

.favorite-btn.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.favorite-btn.btn-danger:hover {
  background-color: #bb2d3b;
  border-color: #bb2d3b;
}

.favorite-btn.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.favorite-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.favorite-btn i {
  font-size: 1rem;
}
</style>