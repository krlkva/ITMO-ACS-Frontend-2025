<template>
  <Transition name="notification">
    <div v-if="notification" class="notification">
      <div class="notification-content">
        <span>{{ notification.message }}</span>
      </div>
      <button class="notification-close" @click="hide">×</button>
    </div>
  </Transition>
</template>

<script setup>
import { useNotification } from '@/composables/useNotification'

const { notification, hide } = useNotification()
</script>

<style scoped>
.notification {
  position: fixed;
  top: 100px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background-color: white;
  color: #333;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.notification-close {
  background: none;
  border: none;
  color: #999;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
  line-height: 1;
}

.notification-close:hover {
  color: #333;
}

/* Анимация */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Темная тема  */
[data-theme="dark"] .notification {
  background-color: #2d2d2d;
  color: #f0f0f0;
  border-color: #404040;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

[data-theme="dark"] .notification-close {
  color: #a0a0a0;
}

[data-theme="dark"] .notification-close:hover {
  color: #f0f0f0;
}
</style>