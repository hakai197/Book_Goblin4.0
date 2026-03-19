import api from './api'

const bookService = {
  async getAll() {
    const { data } = await api.get('/books')
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/books/${id}`)
    return data
  },

  async create(book) {
    const { data } = await api.post('/books', book)
    return data
  },

  async update(id, book) {
    const { data } = await api.put(`/books/${id}`, book)
    return data
  },

  async remove(id) {
    await api.delete(`/books/${id}`)
  },

  async getByStatus(status) {
    const { data } = await api.get(`/books/status/${status}`)
    return data
  },

  async search(query) {
    const { data } = await api.get('/books/search', { params: { q: query } })
    return data
  },

  async getStats() {
    const { data } = await api.get('/books/stats')
    return data
  },

  async seed() {
    await api.post('/books/seed')
  },
}

export default bookService
