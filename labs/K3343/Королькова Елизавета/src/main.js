import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { usePropertiesStore } from './stores/properties'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Инициализируем хранилища
const propertiesStore = usePropertiesStore()
propertiesStore.initFavorites()

// Загружаем объекты при старте
propertiesStore.fetchProperties().catch(err => {
  console.error('Не удалось загрузить объекты при старте:', err)
})

app.mount('#app')