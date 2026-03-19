import { Link } from 'react-router-dom'

const steps = [
  { num: 1, title: 'Create Your Account', desc: 'Sign up and tell us your favorite genres to personalize your experience.', icon: 'bi-person-plus' },
  { num: 2, title: 'Add Your Books', desc: 'Start building your library by adding books you\'ve read, are reading, or want to read.', icon: 'bi-book' },
  { num: 3, title: 'Discover New Reads', desc: 'Explore our curated recommendations based on your reading preferences.', icon: 'bi-compass' },
  { num: 4, title: 'Track Your Progress', desc: 'Set reading goals and watch your stats grow over time.', icon: 'bi-graph-up' },
]

export default function GetStarted() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="py-4 bg-dark-glass border-bottom border-glass">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="text-decoration-none">
            <h1 className="h3 mb-0 text-gradient">Book Goblin</h1>
          </Link>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light">Login</Link>
            <Link to="/register" className="btn btn-gradient">Register</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow-1 py-5">
        <div className="container">
          <div className="text-center mb-5">
            <img src="/Img/Chilling Goblin 3.0.png" alt="Chilling Goblin" className="img-fluid mb-4" style={{ maxHeight: 250 }} />
            <h2 className="display-5 fw-bold text-gradient">Get Started with Book Goblin</h2>
            <p className="lead text-muted">Your personal reading companion in 4 easy steps.</p>
          </div>

          <div className="row g-4 mb-5">
            {steps.map(({ num, title, desc, icon }) => (
              <div key={num} className="col-md-6 col-lg-3">
                <div className="card-glass p-4 rounded-4 h-100 text-center">
                  <div className="rounded-circle bg-gradient-primary d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 60, height: 60 }}>
                    <i className={`bi ${icon} fs-4 text-white`}></i>
                  </div>
                  <div className="badge bg-purple mb-2">Step {num}</div>
                  <h5>{title}</h5>
                  <p className="text-muted small mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/register" className="btn btn-gradient btn-lg px-5 me-3">Create Free Account</Link>
            <Link to="/discover" className="btn btn-outline-light btn-lg px-5">Browse Books First</Link>
          </div>
        </div>
      </main>

      <footer className="py-4 bg-dark-glass border-top border-glass" style={{ marginLeft: 0, width: '100%' }}>
        <div className="text-center"><p className="mb-0">&copy; U197 Designs 2025 | Book Goblin</p></div>
      </footer>
    </div>
  )
}
