import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="py-4 bg-dark-glass border-bottom border-glass">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="text-decoration-none">
            <h1 className="h3 mb-0 text-gradient">Book Goblin</h1>
          </Link>
          <Link to="/" className="btn btn-outline-light">
            <i className="bi bi-arrow-left me-2"></i>Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="login-container overflow-hidden">
                <div className="row g-0">
                  <div className="col-lg-5 d-none d-lg-flex align-items-center justify-content-center p-5 bg-gradient-primary">
                    <div className="text-center">
                      <img src="/Img/Login Goblin.png" alt="Login Goblin" className="img-fluid mb-4" style={{ maxHeight: 280 }} />
                      <h3 className="text-white">Welcome Back!</h3>
                      <p className="text-white-50">Your reading adventure continues here.</p>
                    </div>
                  </div>

                  <div className="col-lg-7 p-5">
                    <h2 className="text-gradient mb-1">Sign In</h2>
                    <p className="text-muted mb-4">Access your personal library</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control form-control-dark"
                          placeholder="your@email.com"
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control form-control-dark"
                          placeholder="••••••••"
                          value={form.password}
                          onChange={e => setForm({ ...form, password: e.target.value })}
                          required
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="remember"
                            checked={form.remember}
                            onChange={e => setForm({ ...form, remember: e.target.checked })}
                          />
                          <label className="form-check-label" htmlFor="remember">Remember me</label>
                        </div>
                        <a href="#" className="text-purple small">Forgot password?</a>
                      </div>
                      <button type="submit" className="btn btn-gradient w-100 py-2 mb-3" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                      </button>
                      <p className="text-center text-muted small">
                        Don&apos;t have an account? <Link to="/register" className="text-purple">Register here</Link>
                      </p>
                    </form>
                  </div>
                </div>
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
