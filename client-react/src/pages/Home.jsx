import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="py-4 bg-dark-glass border-bottom border-glass">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h3 mb-0 text-gradient">Book Goblin</h1>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light">Login</Link>
            <Link to="/register" className="btn btn-gradient">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="flex-grow-1 d-flex align-items-center py-5"
        style={{
          background: 'linear-gradient(rgba(5,5,5,0.75), rgba(5,5,5,0.7)), url(/Img/avatar.png) center/20% auto no-repeat',
        }}
      >
        <div className="container text-center py-5">
          <h2 className="display-4 fw-bold text-gradient mb-3">Your Personal Library Assistant</h2>
          <p className="lead text-muted mb-5">Track your reading, discover new books, and manage your personal library with Book Goblin.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register" className="btn btn-gradient btn-lg px-5">Start Reading</Link>
            <Link to="/discover" className="btn btn-outline-light btn-lg px-5">Explore Books</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 bg-dark-glass">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { icon: 'bi-book', title: 'Track Reading', desc: 'Keep track of every book you read, are reading, or want to read.' },
              { icon: 'bi-compass', title: 'Smart Discovery', desc: 'Discover new books tailored to your reading preferences.' },
              { icon: 'bi-graph-up', title: 'Reading Stats', desc: 'Visualize your reading progress with detailed statistics.' },
              { icon: 'bi-flag', title: 'Set Goals', desc: 'Set yearly reading goals and track your progress.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="col-md-3">
                <div className="card-glass p-4 rounded-4 h-100">
                  <i className={`bi ${icon} fs-1 text-gradient d-block mb-3`}></i>
                  <h5>{title}</h5>
                  <p className="text-muted small mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-4 bg-dark-glass border-top border-glass" style={{ marginLeft: 0, width: '100%' }}>
        <div className="text-center">
          <p className="mb-0">&copy; U197 Designs 2025 | Book Goblin</p>
        </div>
      </footer>
    </div>
  )
}
