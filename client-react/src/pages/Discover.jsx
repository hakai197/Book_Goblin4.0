import { useState, useMemo } from 'react'
import AppLayout from '../components/AppLayout'
import StarRating from '../components/StarRating'
import Notification from '../components/Notification'
import { discoverBooks, trendingBooksData, carouselBooks } from '../data/books'

const GENRE_BADGE = { fantasy: 'bg-purple', 'sci-fi': 'bg-info', mystery: 'bg-dark', horror: 'bg-danger', romance: 'bg-pink', 'non-fiction': 'bg-success' }
const QUICK_GENRES = ['', 'fantasy', 'sci-fi', 'mystery', 'horror', 'romance', 'non-fiction']
const GENRE_LABELS = { '': 'All', fantasy: 'Fantasy', 'sci-fi': 'Sci-Fi', mystery: 'Mystery', horror: 'Horror', romance: 'Romance', 'non-fiction': 'Non-Fiction' }

const EMPTY_REC = { title: '', author: '', genre: '', email: '', description: '', notify: true }

export default function Discover() {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('relevance')
  const [tbrList, setTbrList] = useState(() => JSON.parse(localStorage.getItem('tbrList') || '[]'))
  const [selectedBook, setSelectedBook] = useState(null)
  const [rec, setRec] = useState(EMPTY_REC)
  const [recErrors, setRecErrors] = useState({})
  const [recSuccess, setRecSuccess] = useState(false)
  const [notification, setNotification] = useState(null)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [visibleCount, setVisibleCount] = useState(8)

  function notify(msg, type = 'success') { setNotification({ message: msg, type }) }

  const filtered = useMemo(() => {
    let list = discoverBooks.filter(b => {
      if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.author.toLowerCase().includes(search.toLowerCase())) return false
      if (genre && b.genre !== genre) return false
      if (minRating > 0 && b.rating < minRating) return false
      return true
    })
    return [...list].sort((a, b) => {
      if (sortBy === 'rating-desc') return b.rating - a.rating
      if (sortBy === 'rating-asc') return a.rating - b.rating
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'author') return a.author.localeCompare(b.author)
      return 0
    })
  }, [search, genre, minRating, sortBy])

  function addToTbr(book) {
    if (tbrList.some(b => b.id === book.id)) { notify('Already in your TBR!', 'warning'); return }
    const updated = [...tbrList, { id: book.id, title: book.title, author: book.author, genre: book.genre, added: new Date().toISOString() }]
    setTbrList(updated)
    localStorage.setItem('tbrList', JSON.stringify(updated))
    notify(`"${book.title}" added to TBR!`)
  }

  function inTbr(id) { return tbrList.some(b => b.id === id) }

  function validateRec() {
    const e = {}
    if (rec.title.trim().length < 2) e.title = 'Title required.'
    if (!rec.genre) e.genre = 'Genre required.'
    if (rec.description.trim().length < 10) e.description = 'Please provide more detail (min 10 chars).'
    setRecErrors(e)
    return Object.keys(e).length === 0
  }

  function submitRec(e) {
    e.preventDefault()
    if (!validateRec()) return
    const recs = JSON.parse(localStorage.getItem('recommendations') || '[]')
    recs.push({ ...rec, id: Date.now(), timestamp: new Date().toISOString() })
    localStorage.setItem('recommendations', JSON.stringify(recs))
    setRecSuccess(true)
    setRec(EMPTY_REC)
    setRecErrors({})
    notify('Recommendation request submitted!')
    setTimeout(() => setRecSuccess(false), 4000)
  }

  const carouselBook = carouselBooks[carouselIdx]

  return (
    <AppLayout>
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      {/* Search & Filters */}
      <section className="mb-5">
        <div className="card-glass p-4">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-dark border-glass"><i className="bi bi-search"></i></span>
                <input type="text" className="form-control bg-dark border-glass text-light"
                  placeholder="Search books, authors, or genres..." value={search}
                  onChange={e => setSearch(e.target.value)} />
                <button className="btn btn-primary" onClick={() => notify('Search updated!', 'info')}>Search</button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-dark border-glass">Sort by</span>
                <select className="form-select bg-dark border-glass text-light" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="relevance">Relevance</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="rating-asc">Lowest Rated</option>
                  <option value="title">Title A-Z</option>
                  <option value="author">Author A-Z</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Genre</label>
              <select className="form-select bg-dark border-glass text-light" value={genre} onChange={e => setGenre(e.target.value)}>
                <option value="">All Genres</option>
                {['fantasy', 'sci-fi', 'mystery', 'horror', 'romance', 'non-fiction'].map(g => (
                  <option key={g} value={g}>{GENRE_LABELS[g]}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Min Rating</label>
              <div className="d-flex gap-1 align-items-center">
                {[1, 2, 3, 4, 5].map(n => (
                  <i key={n} className={`bi ${n <= minRating ? 'bi-star-fill text-warning' : 'bi-star'}`}
                    style={{ cursor: 'pointer', fontSize: '1.3rem' }}
                    onClick={() => setMinRating(minRating === n ? 0 : n)} />
                ))}
                <span className="ms-2 small text-muted">{minRating > 0 ? `${minRating}+ stars` : 'Any'}</span>
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-sm btn-outline-danger" onClick={() => { setSearch(''); setGenre(''); setMinRating(0); setSortBy('relevance') }}>
                <i className="bi bi-x-circle me-1"></i>Reset Filters
              </button>
            </div>
          </div>
          <div className="mt-2 text-muted small">Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} results</div>
        </div>
      </section>

      {/* Hero + Carousel */}
      <div className="row align-items-center g-5 mb-5">
        <div className="col-lg-5 d-none d-lg-block">
          <img src="/Img/Searching Goblin.png" alt="Searching Goblin" className="img-fluid" style={{ maxWidth: 400 }} />
        </div>
        <div className="col-lg-7">
          <div className="text-center mb-3">
            <h3 className="text-gradient mb-1">Recommended for You</h3>
            <p className="text-muted">Based on your reading</p>
          </div>
          <div className="position-relative rounded-4 overflow-hidden" style={{ background: 'var(--glass)' }}>
            <div className="d-flex p-3 gap-3 align-items-center">
              <img src={carouselBook.image} alt={carouselBook.title} style={{ height: 180, width: 120, objectFit: 'cover', borderRadius: 8 }} />
              <div>
                <h5>{carouselBook.title}</h5>
                <p className="text-muted small">{carouselBook.author} • {carouselBook.genre} • {carouselBook.rating}★</p>
                <p className="small">{carouselBook.description}</p>
                <button className="btn btn-sm btn-gradient" onClick={() => addToTbr(carouselBook)}>
                  {inTbr(carouselBook.id) ? <><i className="bi bi-check me-1"></i>In TBR</> : <><i className="bi bi-plus me-1"></i>Add to TBR</>}
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-between p-2">
              <button className="btn btn-sm btn-outline-light" onClick={() => setCarouselIdx(i => (i - 1 + carouselBooks.length) % carouselBooks.length)}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <div className="d-flex gap-1 align-items-center">
                {carouselBooks.map((_, i) => (
                  <span key={i} onClick={() => setCarouselIdx(i)}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: i === carouselIdx ? '#9b4dff' : 'rgba(255,255,255,0.3)', cursor: 'pointer' }} />
                ))}
              </div>
              <button className="btn btn-sm btn-outline-light" onClick={() => setCarouselIdx(i => (i + 1) % carouselBooks.length)}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Genre Filters */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {QUICK_GENRES.map(g => (
          <button key={g} className={`btn btn-sm btn-outline-light genre-filter ${genre === g ? 'active' : ''}`}
            onClick={() => setGenre(g)}>
            {GENRE_LABELS[g]}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <section className="mb-5">
        <h2 className="text-gradient mb-4">More Books to Explore</h2>
        {filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-search fs-1 d-block mb-3"></i>No books match your filters.
          </div>
        ) : (
          <div className="row g-4">
            {filtered.slice(0, visibleCount).map(book => (
              <div key={book.id} className="col-md-6 col-lg-3 fade-in-up">
                <div className="card card-glass h-100 border-0 book-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedBook(book)}>
                  <div className="d-flex justify-content-center p-3 pb-0">
                    <img src={book.image} alt={book.title} style={{ width: 150, height: 225, objectFit: 'cover' }} />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fs-6 mb-1">{book.title}</h5>
                    <p className="card-text text-muted small mb-2">{book.author}</p>
                    <div className="mt-auto d-flex gap-1 flex-wrap">
                      <span className={`badge ${GENRE_BADGE[book.genre] || 'bg-secondary'}`}>{book.genre}</span>
                      <span className="badge bg-secondary">{book.rating}★</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {visibleCount < filtered.length && (
          <div className="text-center mt-5">
            <button className="btn btn-primary" onClick={() => setVisibleCount(v => v + 8)}>
              <i className="bi bi-plus-circle me-2"></i>Load More Books
            </button>
          </div>
        )}
      </section>

      {/* Trending */}
      <section className="mb-5">
        <h3 className="text-gradient mb-4">Trending Now</h3>
        <div className="row">
          {trendingBooksData.map(book => (
            <div key={book.id} className="col-12 mb-3">
              <div className="card-glass p-3">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img src={book.image} alt={book.title} className="img-fluid rounded-3" style={{ height: 100, width: 70, objectFit: 'cover' }} />
                  </div>
                  <div className="col-md-7">
                    <h5 className="mb-1">{book.title}</h5>
                    <p className="text-muted small mb-2">{book.author}</p>
                    <p className="small mb-0">{book.description}</p>
                  </div>
                  <div className="col-md-3 text-md-end mt-3 mt-md-0">
                    <StarRating rating={book.rating} />
                    <button className={`btn btn-sm mt-2 ${inTbr(book.id) ? 'btn-success' : 'btn-gradient'}`}
                      onClick={() => addToTbr(book)} disabled={inTbr(book.id)}>
                      {inTbr(book.id) ? <><i className="bi bi-check me-1"></i>Added</> : <><i className="bi bi-plus me-1"></i>Add to TBR</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendation Form */}
      <section>
        <div className="card-glass p-4">
          <h3 className="text-gradient mb-2">Can&apos;t Find a Book?</h3>
          <p className="text-muted mb-4">Request a recommendation and our Book Goblin will find it for you!</p>
          {recSuccess && <div className="alert alert-success">Request submitted! We&apos;ll notify you when we find matching books.</div>}
          <form onSubmit={submitRec} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Book Title *</label>
                <input className={`form-control ${recErrors.title ? 'is-invalid' : ''}`} value={rec.title}
                  onChange={e => setRec({ ...rec, title: e.target.value })} placeholder="Enter book title" />
                {recErrors.title && <div className="invalid-feedback">{recErrors.title}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Author (Optional)</label>
                <input className="form-control" value={rec.author} onChange={e => setRec({ ...rec, author: e.target.value })} placeholder="Author name if known" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Preferred Genre *</label>
                <select className={`form-select ${recErrors.genre ? 'is-invalid' : ''}`} value={rec.genre} onChange={e => setRec({ ...rec, genre: e.target.value })}>
                  <option value="">Select genre</option>
                  {['fantasy', 'sci-fi', 'mystery', 'horror', 'romance', 'any'].map(g => <option key={g} value={g}>{GENRE_LABELS[g] || g}</option>)}
                </select>
                {recErrors.genre && <div className="invalid-feedback">{recErrors.genre}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Email for Updates (Optional)</label>
                <input type="email" className="form-control" value={rec.email} onChange={e => setRec({ ...rec, email: e.target.value })} placeholder="your@email.com" />
              </div>
              <div className="col-12">
                <label className="form-label">What are you looking for? *</label>
                <textarea className={`form-control ${recErrors.description ? 'is-invalid' : ''}`} rows="3" maxLength={500}
                  value={rec.description} onChange={e => setRec({ ...rec, description: e.target.value })}
                  placeholder="Describe what you're looking for..." />
                <div className="form-text">{rec.description.length}/500 characters</div>
                {recErrors.description && <div className="invalid-feedback d-block">{recErrors.description}</div>}
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="recNotify" checked={rec.notify}
                    onChange={e => setRec({ ...rec, notify: e.target.checked })} />
                  <label className="form-check-label" htmlFor="recNotify">Notify me when similar books are added</label>
                </div>
              </div>
            </div>
            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary">Request Recommendation</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setRec(EMPTY_REC); setRecErrors({}) }}>Reset</button>
            </div>
          </form>
        </div>
      </section>

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="modal show d-block" style={{ backdropFilter: 'blur(5px)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border border-light">
              <div className="modal-header">
                <h5 className="modal-title text-gradient">Book Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedBook(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4">
                    <img src={selectedBook.image} className="img-fluid rounded-3" alt={selectedBook.title} />
                  </div>
                  <div className="col-md-8">
                    <h4>{selectedBook.title}</h4>
                    <h5 className="text-muted">{selectedBook.author}</h5>
                    <div className="mb-3">
                      <span className={`badge ${GENRE_BADGE[selectedBook.genre] || 'bg-secondary'} me-2`}>{selectedBook.genre}</span>
                      <span className="badge bg-secondary">Published: {selectedBook.year}</span>
                    </div>
                    <div className="mb-3"><StarRating rating={selectedBook.rating} /> <span className="ms-1">({selectedBook.rating}/5)</span></div>
                    <p>{selectedBook.description}</p>
                    <ul className="list-unstyled small text-muted">
                      <li><strong>Pages:</strong> {selectedBook.pages}</li>
                      <li><strong>Publisher:</strong> {selectedBook.publisher}</li>
                      <li><strong>ISBN:</strong> {selectedBook.isbn}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedBook(null)}>Close</button>
                <button className={`btn ${inTbr(selectedBook.id) ? 'btn-success' : 'btn-primary'}`}
                  onClick={() => { addToTbr(selectedBook); setSelectedBook(null) }} disabled={inTbr(selectedBook.id)}>
                  {inTbr(selectedBook.id) ? 'Already in TBR' : 'Add to TBR'}
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={() => setSelectedBook(null)} style={{ zIndex: -1 }}></div>
        </div>
      )}
    </AppLayout>
  )
}
