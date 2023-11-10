import axios from 'axios'
import store from './store'

const apiKey = 'https://api.app-mebel.kz/api/v1'

const instance = axios.create({
  baseURL: apiKey,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  (config) => {
    const activeToken = store.getters.activeToken

    if (activeToken) {
      config.headers.Authorization = `Bearer ${activeToken}`
    }

    config.headers['X-Connection-Id'] = store.getters.currentConnection // Replace with your connection ID

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
