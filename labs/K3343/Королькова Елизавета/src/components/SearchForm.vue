<template>
  <form @submit.prevent="handleSubmit" class="filter-form">
    <div class="filter-row">
      <div class="filter-group">
        <label for="filterType" class="filter-label">Тип</label>
        <select class="filter-select" id="filterType" v-model="filters.type">
          <option value="all">Все типы</option>
          <option value="apartment">Квартира</option>
          <option value="house">Дом</option>
          <option value="studio">Студия</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="priceFrom" class="filter-label">Цена от</label>
        <input type="number" class="filter-input" id="priceFrom" 
               v-model.number="filters.priceFrom" placeholder="0 ₽">
      </div>
      
      <div class="filter-group">
        <label for="priceTo" class="filter-label">Цена до</label>
        <input type="number" class="filter-input" id="priceTo" 
               v-model.number="filters.priceTo" placeholder="1 000 000 ₽">
      </div>
      
      <div class="filter-group">
        <label for="rooms" class="filter-label">Комнат</label>
        <select class="filter-select" id="rooms" v-model="filters.rooms">
          <option value="all">Любое</option>
          <option value="1">1 комната</option>
          <option value="2">2 комнаты</option>
          <option value="3">3 комнаты</option>
          <option value="4">4+ комнат</option>
        </select>
      </div>
      
      <div class="filter-button">
        <button type="submit" class="btn-search">
          <i class="bi bi-search me-2"></i>
          Найти
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['search'])

const filters = reactive({
  type: 'all',
  priceFrom: 0,
  priceTo: 1000000,
  rooms: 'all'
})

const handleSubmit = () => {
  emit('search', { ...filters })
}
</script>

<style scoped>
.filter-form {
  background-color: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.filter-group {
  flex: 1 1 200px;
}

.filter-label {
  display: block;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: 0.75rem 1.25rem;
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  border-radius: 40px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.filter-input:focus,
.filter-select:focus {
  border-color: var(--link-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0,86,179,0.1);
}

.btn-search {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-text);
  border: none;
  border-radius: 40px;
  padding: 0.75rem 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.btn-search:hover {
  background-color: var(--btn-primary-hover);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-button {
    width: 100%;
  }
  
  .btn-search {
    width: 100%;
  }
}
</style>