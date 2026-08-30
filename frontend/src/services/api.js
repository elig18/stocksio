import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'
})

// Ajoute automatiquement le token JWT à chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirige vers login si token expiré
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// AUTH
export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')
export const updateAccount = (data) => API.put('/auth/update', data)
export const deleteAccount = () => API.delete('/auth/delete')

// PRODUITS
export const getProducts = (params) => API.get('/products/', { params })
export const getProduct = (id) => API.get(`/products/${id}`)
export const createProduct = (data) => API.post('/products/', data)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data)
export const deleteProduct = (id) => API.delete(`/products/${id}`)
export const exportCSV = () => API.get('/products/export', { responseType: 'blob' })

// ENTREPOTS
export const getWarehouses = () => API.get('/warehouses/')
export const createWarehouse = (data) => API.post('/warehouses/', data)
export const updateWarehouse = (id, data) => API.put(`/warehouses/${id}`, data)
export const deleteWarehouse = (id) => API.delete(`/warehouses/${id}`)

// DASHBOARD
export const getDashboardStats = () => API.get('/dashboard/stats')
export const getAlerts = () => API.get('/dashboard/alerts')

// MOUVEMENTS
export const getMovements = (product_id) => API.get('/movements/', { params: { product_id } })
export const addMovement = (data) => API.post('/movements/', data)

export default API
