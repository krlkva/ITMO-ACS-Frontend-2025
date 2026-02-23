import { ref } from 'vue'

const notification = ref(null)
const timeout = ref(null)

export function useNotification() {
  const show = (message, type = 'info', duration = 3000) => {
    // Убираем предыдущее уведомление
    if (timeout.value) clearTimeout(timeout.value)
    
    notification.value = { message, type }
    
    // Автоматически скрываем
    timeout.value = setTimeout(() => {
      notification.value = null
    }, duration)
  }
  
  const hide = () => {
    notification.value = null
    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }
  }
  
  return {
    notification,
    show,
    hide
  }
}