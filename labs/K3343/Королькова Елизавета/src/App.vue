<template>
  <div id="app">
    <TheHeader />
    <router-view />
    <TheFooter />
    <Notification /> 
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'
import Notification from './components/ui/Notification.vue'
import { usePropertiesStore } from './stores/properties'

const propertiesStore = usePropertiesStore()

onMounted(() => {
  propertiesStore.initFavorites()
  propertiesStore.fetchProperties().catch(err => {
    console.error('Не удалось загрузить объекты при старте:', err)
  })
})
</script>
