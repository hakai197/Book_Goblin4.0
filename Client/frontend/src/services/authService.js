import api from './api'

const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  },

  async register(username, email, password) {
    const { data } = await api.post('/auth/register', { username, email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken() {
    return localStorage.getItem('token')
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },
}

export default authService
