import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function healthCheck() {
  const { data } = await api.get('/api/health')
  return data
}

export async function listTasks(params = {}) {
  const { data } = await api.get('/api/tasks', { params })
  return data
}

export async function getTask(id) {
  const { data } = await api.get(`/api/tasks/${id}`)
  return data
}

export async function createTask(payload) {
  const { data } = await api.post('/api/tasks', payload)
  return data
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/api/tasks/${id}`, payload)
  return data
}

export async function deleteTask(id) {
  const { data } = await api.delete(`/api/tasks/${id}`)
  return data
}

export async function completeTask(id) {
  const { data } = await api.post(`/api/tasks/${id}/complete`)
  return data
}

export async function logTaskVisit(id, action = 'view') {
  const { data } = await api.post(`/api/tasks/${id}/visit`, { action })
  return data
}

export async function analyticsSummary() {
  const { data } = await api.get('/api/analytics/summary')
  return data
}

export async function analyticsCompletion(range = 'week') {
  const { data } = await api.get('/api/analytics/completion', { params: { range } })
  return data
}
