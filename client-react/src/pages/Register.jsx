import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { genres } from '../data/books'

const STRENGTH_LABELS = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
const STRENGTH_COLORS = ['', 'danger', 'warning', 'info', 'primary', 'success']

function getPasswordStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (pw.length >= 12) score++
  return score
}

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', terms: false })
  const [selectedGenres, setSelectedGenres] = useState([])
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const strength = getPasswordStrength(form.password)

  function toggleGenre(g) {
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  function validateStep1() {
    const e = {}
    if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.'
    if (!form.terms) e.terms = 'You must accept the terms.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext(e) {
    e.preventDefault()
    if (validateStep1()) setStep(2)
  }

  function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem('currentUser', JSON.stringify({ username: form.username, email: form.email, genres: selectedGenres }))
    sessionStorage.setItem('userLoggedIn', 'true')
    setSuccess(true)
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  if (success) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center fade-in-up">
          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
          <h2 className="text-gradient mt-3">Welcome to Book Goblin!</h2>
          <p className="text-muted">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="py-4 bg-dark-glass border-bottom border-glass">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="text-decoration-none">
            <h1 className="h3 mb-0 text-gradient">Book Goblin</h1>
          </Link>
          <Link to="/login" className="btn btn-outline-light">Already have an account?</Link>
        </div>
      </header>

      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card-glass p-5 rounded-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="text-gradient mb-0">Create Account</h2>
                  <span className="badge bg-gradient-primary">Step {step} of 2</span>
                </div>

                {step === 1 && (
                  <form onSubmit={handleNext} noValidate>
                    <div className="mb-3">
                      <label className="form-label">Username *</label>
                      <input className={`form-control form-control-dark ${errors.username ? 'is-invalid' : ''}`}
                        value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                        placeholder="Choose a username" minLength={3} maxLength={30} required />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email *</label>
                      <input type="email" className={`form-control form-control-dark ${errors.email ? 'is-invalid' : ''}`}
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com" required />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password *</label>
                      <input type="password" className={`form-control form-control-dark ${errors.password ? 'is-invalid' : ''}`}
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••" minLength={8} required />
                      {form.password && (
                        <div className="mt-2">
                          <div className={`progress`} style={{ height: 5 }}>
                            <div className={`progress-bar bg-${STRENGTH_COLORS[strength]}`} style={{ width: `${(strength / 5) * 100}%` }}></div>
                          </div>
                          <small className={`text-${STRENGTH_COLORS[strength]}`}>{STRENGTH_LABELS[strength]}</small>
                        </div>
                      )}
                      {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm Password *</label>
                      <input type="password" className={`form-control form-control-dark ${errors.confirm ? 'is-invalid' : ''}`}
                        value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                        placeholder="••••••••" required />
                      {errors.confirm && <div className="invalid-feedback">{errors.confirm}</div>}
                    </div>
                    <div className="mb-4">
                      <div className="form-check">
                        <input className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`} type="checkbox" id="terms"
                          checked={form.terms} onChange={e => setForm({ ...form, terms: e.target.checked })} />
                        <label className="form-check-label" htmlFor="terms">
                          I agree to the <a href="#" className="text-purple">Terms of Service</a> and <a href="#" className="text-purple">Privacy Policy</a>
                        </label>
                        {errors.terms && <div className="invalid-feedback">{errors.terms}</div>}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-gradient w-100 py-2">Continue</button>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={handleSubmit}>
                    <p className="text-muted mb-4">Select your favorite genres to personalize your experience.</p>
                    <div className="row g-2 mb-4">
                      {genres.map(g => (
                        <div key={g} className="col-6 col-md-4">
                          <div className={`genre-tag ${selectedGenres.includes(g) ? 'selected' : ''}`} onClick={() => toggleGenre(g)}>
                            {g}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-light" onClick={() => setStep(1)}>Back</button>
                      <button type="submit" className="btn btn-gradient flex-grow-1 py-2">Create Account</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 bg-dark-glass border-top border-glass" style={{ marginLeft: 0, width: '100%' }}>
        <div className="text-center"><p className="mb-0">&copy; U197 Designs 2025 | Book Goblin</p></div>
      </footer>
    </div>
  )
}
