<template>
  <div class="container my-5">
    <h1 class="display-5 fw-normal text-center mb-4">
      MyHome — сервис аренды недвижимости
    </h1>

    <!-- Категории -->
    <div class="d-flex gap-3 flex-wrap mb-5 justify-content-center">
      <span class="badge-soft">Квартиры</span>
      <span class="badge-soft">Дома</span>
      <span class="badge-soft">Студии</span>
      <span class="badge-soft">Коммерческие</span>
      <span class="badge-soft">У озера</span>
    </div>

    <!-- Популярные предложения -->
    <h2 class="mb-4">Популярные предложения</h2>
    
    <!-- Индикатор загрузки -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    
    <!-- Ошибка -->
    <div v-else-if="error" class="text-center py-5 text-danger">
      {{ error }}
    </div>
    
    <!-- Нет данных -->
    <div v-else-if="!properties || properties.length === 0" class="text-center py-5 text-muted">
      Нет доступных объектов
    </div>
    
    <!-- Карточки -->
    <div v-else class="row g-4">
      <div class="col-md-6 col-lg-4" v-for="property in properties" :key="property.id">
        <PropertyCard :property="property" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePropertiesStore } from '@/stores/properties'
import PropertyCard from '@/components/PropertyCard.vue'

const propertiesStore = usePropertiesStore()
const loading = ref(false)
const error = ref(null)

// Берем только первые 3 объекта для популярных
const properties = computed(() => propertiesStore.properties.slice(0, 3))

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    // Если данные еще не загружены - загружаем
    if (propertiesStore.properties.length === 0) {
      await propertiesStore.fetchProperties()
    }
  } catch (err) {
    console.error('Ошибка загрузки:', err)
    error.value = 'Ошибка загрузки данных. Убедитесь, что JSON Server запущен.'
  } finally {
    loading.value = false
  }
})
</script>