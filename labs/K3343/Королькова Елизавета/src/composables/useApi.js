import { ref } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  
  const request = async (method, url, data = null, config = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api({
        method,
        url,
        data,
        ...config
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    get: (url, config) => request('get', url, null, config),
    post: (url, data, config) => request('post', url, data, config),
    put: (url, data, config) => request('put', url, data, config),
    delete: (url, config) => request('delete', url, null, config)
  }
}