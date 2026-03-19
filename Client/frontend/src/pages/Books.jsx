import { useState, useMemo, useEffect, useCallback } from 'react'
import AppLayout from '../components/layout/AppLayout'
import StarRating from '../components/common/StarRating'
import Notification from '../components/common/Notification'
import bookService from '../services/bookService'
import { readingStats } from '../data/books'

const STATUS_BADGE = { Reading: 'bg-info', TBR: 'bg-purple', Completed: 'bg-success', DNF: 'bg-warning' }
const PROGRESS_COLOR = p => p >= 100 ? 'bg-success' : p >= 75 ? 'bg-primary' : p >= 50 ? 'bg-info' : p >= 25 ? 'bg-warning' : 'bg-danger'
const EMPTY_BOOK = { title: '', author: '', genre: '', status: '', rating: 0, notes: '' }

export default function Books() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('title')
  const [goal, setGoal] = useState(50)
  const [showModal, setShowModal] = useState(false)
  const [newBook, setNewBook] = useState(EMPTY_BOOK)
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)

  const notify = useCallback((msg, type = 'success') => { setNotification({ message: msg, type }) }, [])

  useEffect(() => {
    async function load() {
      try {
        const data = await bookService.getAll()
        setBooks(data)
      } catch {
        notify('Failed to load books.', 'danger')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [notify])

  const filtered = useMemo(() => {
    let list = books.filter(b => {
      const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'all' || b.status.toLowerCase() === filter
      return matchSearch && matchFilter
    })
    return [...list].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'title-desc') return b.title.localeCompare(a.title)
      if (sort === 'author') return a.author.localeCompare(b.author)
      if (sort === 'rating') return (b.rating || 0) - (a.rating || 0)
      return 0
    })
  }, [books, search, filter, sort])

  const totalBooks = books.filter(b => b.status === 'Completed').length
  const goalPct = Math.min((totalBooks / goal) * 100, 100)
  const circumference = 2 * Math.PI * 65
  const strokeOffset = circumference - (goalPct / 100) * circumference

  function validate() {
    const e = {}
    if (newBook.title.trim().length < 2) e.title = 'Title required (min 2 chars).'
    if (newBook.author.trim().length < 2) e.author = 'Author required (min 2 chars).'
    if (!newBook.status) e.status = 'Status required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function saveBook() {
    if (!validate()) return
    try {
      const created = await bookService.create({
        title: newBook.title, author: newBook.author, genre: newBook.genre,
        status: newBook.status, rating: newBook.rating, notes: newBook.notes,
        progress: newBook.status === 'Completed' ? 100 : newBook.status === 'Reading' ? 50 : 0,
      })
      setBooks(prev => [created, ...prev])
      setNewBook(EMPTY_BOOK)
      setErrors({})
      setShowModal(false)
      notify(`"${created.title}" added!`)
    } catch {
      notify('Failed to add book.', 'danger')
    }
  }

  async function deleteBook(id, title) {
    if (confirm(`Remove "${title}" from your collection?`)) {
      try {
        await bookService.remove(id)
        setBooks(prev => prev.filter(b => b.id !== id))
        notify('Book removed.', 'warning')
      } catch {
        notify('Failed to remove book.', 'danger')
      }
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">Loading your books...</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      {/* Reading Progress + Goals */}
      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="card-glass p-4">
            <h3 className="text-gradient mb-4">Reading Progress</h3>
            <div className="table-responsive">
              <table className="reading-table w-100">
                <thead>
                  <tr>
                    <th className="text-start pb-2">Month</th>
                    <th className="text-end pb-2">Books</th>
                    <th className="text-end pb-2">Pages</th>
                  </tr>
                </thead>
                <tbody>
                  {readingStats.map(row => (
                    <tr key={row.month}>
                      <td className="py-2">{row.month}</td>
                      <td className="text-end py-2">{row.books}</td>
                      <td className="text-end py-2">{row.pages.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-top">
                    <td className="fw-bold pt-2">Total</td>
                    <td className="text-end fw-bold pt-2">{readingStats.reduce((s, r) => s + r.books, 0)}</td>
                    <td className="text-end fw-bold pt-2" style={{ color: '#9b4dff' }}>{readingStats.reduce((s, r) => s + r.pages, 0).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card-glass p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-gradient mb-0">Reading Goals</h3>
              <button className="btn btn-sm btn-outline-primary" onClick={() => {
                const v = prompt('Set your yearly reading goal:', goal)
                if (v && !isNaN(v) && +v >= 1) { setGoal(+v); notify(`Goal set to ${v} books!`) }
              }}>
                <i className="bi bi-plus"></i> Set Goal
              </button>
            </div>
            <div className="text-center mb-4">
              <svg className="progress-ring" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="65" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="transparent" />
                <circle className="progress-ring-circle" cx="75" cy="75" r="65" stroke="#9b4dff" strokeWidth="10" fill="transparent"
                  strokeDasharray={circumference} strokeDashoffset={strokeOffset} />
              </svg>
              <div className="mt-2">
                <h4>{Math.round(goalPct)}%</h4>
                <p className="text-muted">{totalBooks} of {goal} books read</p>
              </div>
            </div>
            <label className="form-label">Adjust Goal: {goal} books</label>
            <input type="range" className="form-range" min="10" max="100" step="5" value={goal}
              onChange={e => setGoal(+e.target.value)} />
          </div>
        </div>
      </div>

      {/* Search + Sort */}
      <section className="mb-4">
        <div className="card-glass p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-dark border-glass"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control bg-dark border-glass text-light"
                  placeholder="Search books by title or author..." value={search}
                  onChange={e => setSearch(e.target.value)} />
                {search && (
                  <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-dark border-glass">Sort by</span>
                <select className="form-select bg-dark border-glass text-light" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="title">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="author">Author A-Z</option>
                  <option value="rating">Rating High-Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h2 className="text-gradient mb-0">
            My Books <span className="badge bg-purple">{filtered.length}</span>
          </h2>
          <div className="d-flex gap-2 flex-wrap">
            {['all', 'reading', 'completed', 'tbr'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setFilter(f)}>
                {f === 'tbr' ? 'TBR' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-book fs-1 d-block mb-3"></i>
            No books found. Try adjusting your search or filters.
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(book => (
              <div key={book.id} className="col-md-6 col-lg-3 fade-in-up">
                <div className="card card-glass h-100 border-0">
                  <div className="card-body d-flex flex-column p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0 fs-6">{book.title}</h5>
                      <div className="book-actions d-flex gap-1">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteBook(book.id, book.title)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p className="card-text text-muted small mb-1">{book.author}</p>
                    <p className="card-text small mb-3">{book.genre || 'Not specified'}</p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <StarRating rating={book.rating || 0} />
                      <span className={`badge ${STATUS_BADGE[book.status] || 'bg-secondary'}`}>{book.status}</span>
                    </div>
                    <div className="mt-auto">
                      <div className="progress mb-1" style={{ height: 5 }}>
                        <div className={`progress-bar ${PROGRESS_COLOR(book.progress || 0)}`}
                          style={{ width: `${book.progress || 0}%` }} role="progressbar"
                          aria-valuenow={book.progress || 0} aria-valuemin="0" aria-valuemax="100" />
                      </div>
                      <small className="text-muted">{book.progress || 0}% complete</small>
                    </div>
                    {book.notes && <p className="card-text small mt-2 text-truncate text-muted">{book.notes}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FAB */}
      <button className="btn btn-primary rounded-circle position-fixed"
        style={{ bottom: '2rem', right: '2rem', width: 60, height: 60, zIndex: 1000 }}
        onClick={() => setShowModal(true)}>
        <i className="bi bi-plus fs-4"></i>
      </button>

      {/* Add Book Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backdropFilter: 'blur(5px)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border border-light">
              <div className="modal-header">
                <h5 className="modal-title text-gradient">Add New Book</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowModal(false); setErrors({}) }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Book Title *</label>
                  <input className={`form-control ${errors.title ? 'is-invalid' : ''}`} value={newBook.title}
                    onChange={e => setNewBook({ ...newBook, title: e.target.value })} />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Author *</label>
                  <input className={`form-control ${errors.author ? 'is-invalid' : ''}`} value={newBook.author}
                    onChange={e => setNewBook({ ...newBook, author: e.target.value })} />
                  {errors.author && <div className="invalid-feedback">{errors.author}</div>}
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Genre</label>
                    <select className="form-select" value={newBook.genre} onChange={e => setNewBook({ ...newBook, genre: e.target.value })}>
                      <option value="">Select genre</option>
                      {['Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Horror'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status *</label>
                    <select className={`form-select ${errors.status ? 'is-invalid' : ''}`} value={newBook.status}
                      onChange={e => setNewBook({ ...newBook, status: e.target.value })}>
                      <option value="">Select status</option>
                      {['Reading', 'TBR', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Rating: {newBook.rating}</label>
                  <input type="range" className="form-range" min="0" max="5" step="0.5" value={newBook.rating}
                    onChange={e => setNewBook({ ...newBook, rating: parseFloat(e.target.value) })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows="3" maxLength={200} value={newBook.notes}
                    onChange={e => setNewBook({ ...newBook, notes: e.target.value })} />
                  <div className="form-text text-end">{newBook.notes.length}/200</div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowModal(false); setErrors({}) }}>Cancel</button>
                <button className="btn btn-primary" onClick={saveBook}>Add Book</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={() => setShowModal(false)} style={{ zIndex: -1 }}></div>
        </div>
      )}
    </AppLayout>
  )
}
