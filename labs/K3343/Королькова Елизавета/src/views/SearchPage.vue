<template>
  <div class="container my-5">
    <h1 class="mb-5">Поиск недвижимости</h1>

    <!-- Форма поиска -->
    <SearchForm @search="handleSearch" />

    <!-- Результаты -->
    <div class="result-count mb-4">
      Найдено {{ filteredProperties.length }} объектов
    </div>
    
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    
    <div v-else class="row g-4">
      <div class="col-md-6 col-lg-4" 
           v-for="property in filteredProperties" 
           :key="property.id">
        <PropertyCard :property="property" />
      </div>
    </div>
    
    <div v-if="filteredProperties.length === 0 && !loading" 
         class="text-center py-5">
      Ничего не найдено
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePropertiesStore } from '@/stores/properties'
import SearchForm from '@/components/SearchForm.vue'
import PropertyCard from '@/components/PropertyCard.vue'

const propertiesStore = usePropertiesStore()
const loading = ref(false)

const filters = ref({
  type: 'all',
  priceFrom: 0,
  priceTo: 1000000,
  rooms: 'all'
})

const filteredProperties = computed(() => {
  return propertiesStore.properties.filter(property => {
    if (filters.value.type !== 'all' && property.type !== filters.value.type) return false
    if (property.price < filters.value.priceFrom) return false
    if (property.price > filters.value.priceTo) return false
    
    if (filters.value.rooms !== 'all') {
      const roomCount = Number(filters.value.rooms)
      if (filters.value.rooms === '4') {
        if (property.rooms < 4) return false
      } else {
        if (property.rooms !== roomCount) return false
      }
    }
    return true
  })
})

const handleSearch = (newFilters) => {
  filters.value = newFilters
}

onMounted(async () => {
  loading.value = true
  await propertiesStore.fetchProperties()
  loading.value = false
})
</script>