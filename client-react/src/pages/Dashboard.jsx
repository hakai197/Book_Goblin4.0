import { useState } from 'react'
import AppLayout from '../components/AppLayout'
import StarRating from '../components/StarRating'
import Notification from '../components/Notification'
import { carouselBooks } from '../data/books'

const INITIAL_ACTIVITY = [
  { id: 1, title: "The Only Good Indians", author: "Stephen Graham Jones", rating: 3, status: "TBR", image: "https://m.media-amazon.com/images/I/710FffsUloL._SY466_.jpg" },
  { id: 2, title: "Dune", author: "Frank Herbert", rating: 5, status: "Completed", image: "https://m.media-amazon.com/images/I/81DMp7F91LL._SL1500_.jpg" },
  { id: 3, title: "The Will Of The Many", author: "James Islington", rating: 4, status: "Reading", image: "https://m.media-amazon.com/images/I/71p5luifDjL._SL1500_.jpg" },
  { id: 4, title: "Shadow of the Gods", author: "John Gwynne", rating: 4, status: "Completed", image: "https://m.media-amazon.com/images/I/815EJibD9DL._SY466_.jpg" },
]

const STATUS_BADGE = { Reading: 'bg-info', TBR: 'bg-purple', Completed: 'bg-success', DNF: 'bg-warning' }

const EMPTY_FORM = { title: '', author: '', genre: '', status: '', rating: 0, notes: '' }

export default function Dashboard() {
  const [activity, setActivity] = useState(INITIAL_ACTIVITY)
  const [stats, setStats] = useState({ read: 37, tbr: 50, recommended: 400 })
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState(null)
  const [carouselIdx, setCarouselIdx] = useState(0)

  function notify(message, type = 'success') {
    setNotification({ message, type })
  }

  function validate() {
    const e = {}
    if (form.title.trim().length < 2) e.title = 'Title must be at least 2 characters.'
    if (form.author.trim().length < 2) e.author = 'Author must be at least 2 characters.'
    if (!form.genre) e.genre = 'Please select a genre.'
    if (!form.status) e.status = 'Please select a status.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    const newBook = { id: Date.now(), ...form, image: '' }
    setActivity(prev => [newBook, ...prev])
    setStats(prev => ({ ...prev, read: prev.read + 1 }))
    setForm(EMPTY_FORM)
    setErrors({})
    notify(`"${form.title}" added to your library!`)
  }

  function handleReset() {
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function removeBook(id) {
    setActivity(prev => prev.filter(b => b.id !== id))
    notify('Book removed.', 'warning')
  }

  const prev = () => setCarouselIdx(i => (i - 1 + carouselBooks.length) % carouselBooks.length)
  const next = () => setCarouselIdx(i => (i + 1) % carouselBooks.length)
  const book = carouselBooks[carouselIdx]

  return (
    <AppLayout>
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      {/* Hero + Carousel */}
      <div className="row align-items-center g-5 mb-5">
        <div className="col-lg-6 d-none d-lg-block">
          <img src="/Img/BookGoblinMess.png" alt="Book Goblin" className="img-fluid rounded-4" />
        </div>
        <div className="col-lg-6">
          <div className="text-center mb-3">
            <h3 className="text-gradient mb-1">Recommended for You</h3>
            <p className="text-muted">Based on your reading</p>
          </div>
          <div className="position-relative rounded-4 overflow-hidden" style={{ background: 'var(--glass)' }}>
            <div className="d-flex p-3 gap-3 align-items-center">
              <img src={book.image} alt={book.title} style={{ height: 200, width: 133, objectFit: 'cover', borderRadius: 8 }} />
              <div>
                <h5>{book.title}</h5>
                <p className="text-muted small">{book.author} • {book.genre} • {book.rating}★</p>
                <p className="small">{book.description}</p>
              </div>
            </div>
            <div className="d-flex justify-content-between p-2">
              <button className="btn btn-sm btn-outline-light" onClick={prev}><i className="bi bi-chevron-left"></i></button>
              <div className="d-flex gap-1 align-items-center">
                {carouselBooks.map((_, i) => (
                  <span key={i} onClick={() => setCarouselIdx(i)}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: i === carouselIdx ? '#9b4dff' : 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                  />
                ))}
              </div>
              <button className="btn btn-sm btn-outline-light" onClick={next}><i className="bi bi-chevron-right"></i></button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="mb-5">
        <div className="d-inline-block px-4 py-2 mb-4 rounded-4 bg-gradient-primary">
          <h4 className="mb-0">Your Reading Snapshot</h4>
        </div>
        <div className="row g-4">
          {[
            { label: 'Books Read', value: stats.read },
            { label: 'To Be Read', value: stats.tbr },
            { label: 'Recommended', value: stats.recommended },
          ].map(({ label, value }) => (
            <div key={label} className="col-md-4">
              <div className="stat-card p-4 rounded-4">
                <h2 className="display-6 fw-bold text-gradient mb-2">{value}</h2>
                <p className="mb-0">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Book Form */}
      <section className="mb-5">
        <h2 className="text-gradient mb-4">Add a New Book</h2>
        <div className="card card-glass border-0 p-4">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Book Title *</label>
                <input className={`form-control ${errors.title ? 'is-invalid' : ''}`} value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Enter book title" />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Author *</label>
                <input className={`form-control ${errors.author ? 'is-invalid' : ''}`} value={form.author}
                  onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Enter author name" />
                {errors.author && <div className="invalid-feedback">{errors.author}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Genre *</label>
                <select className={`form-select ${errors.genre ? 'is-invalid' : ''}`} value={form.genre}
                  onChange={e => setForm({ ...form, genre: e.target.value })}>
                  <option value="">Select genre</option>
                  {['Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Horror', 'Non-Fiction', 'Biography'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                {errors.genre && <div className="invalid-feedback">{errors.genre}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Reading Status *</label>
                <select className={`form-select ${errors.status ? 'is-invalid' : ''}`} value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="">Select status</option>
                  {['Reading', 'TBR', 'Completed', 'DNF'].map(s => (
                    <option key={s} value={s}>{s === 'TBR' ? 'To Be Read' : s === 'DNF' ? 'Did Not Finish' : s === 'Reading' ? 'Currently Reading' : s}</option>
                  ))}
                </select>
                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
              </div>
              <div className="col-12">
                <label className="form-label">Rating: {form.rating} stars</label>
                <input type="range" className="form-range" min="0" max="5" step="0.5" value={form.rating}
                  onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) })} />
              </div>
              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea className="form-control" rows="3" maxLength={500} value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Add your notes (max 500 characters)" />
                <div className="form-text text-end">{form.notes.length}/500</div>
              </div>
            </div>
            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary">Add Book</button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
            </div>
          </form>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-gradient mb-4">Recent Activity</h2>
        <div className="row g-4">
          {activity.map(book => (
            <div key={book.id} className="col-md-6 col-lg-3 fade-in-up">
              <div className="card card-glass h-100 border-0">
                {book.image && (
                  <img src={book.image} className="card-img-top" alt={book.title} style={{ height: 250, objectFit: 'cover' }} />
                )}
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text text-muted small">{book.author}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <StarRating rating={book.rating} />
                    <span className={`badge ${STATUS_BADGE[book.status] || 'bg-secondary'}`}>{book.status}</span>
                  </div>
                  <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => removeBook(book.id)}>
                    <i className="bi bi-trash me-1"></i>Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  )
}
