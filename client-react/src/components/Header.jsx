import { useNavigate } from 'react-router-dom'

export default function Header({ subtitle = 'Your Personal Library Assistant' }) {
  const navigate = useNavigate()

  function handleSignOut(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to sign out?')) {
      navigate('/')
    }
  }

  return (
    <header className="header sticky-top py-3 px-4 bg-dark-glass border-bottom border-glass">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h2 mb-1 text-gradient">Book Goblin</h1>
          <p className="mb-0">{subtitle}</p>
        </div>
        <div className="dropdown">
          <button
            className="btn btn-dark dropdown-toggle d-flex align-items-center gap-2"
            type="button"
            data-bs-toggle="dropdown"
          >
            <img src="/Img/avatar.png" alt="User Avatar" className="rounded-circle border border-purple" width="42" height="42" />
            <span>Account</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end bg-dark border border-light">
            <li><a className="dropdown-item text-light" href="/admin"><i className="bi bi-crown me-2"></i>Switch to Admin</a></li>
            <li><a className="dropdown-item text-light" href="#"><i className="bi bi-person me-2"></i>Your Profile</a></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item text-danger" href="#" onClick={handleSignOut}><i className="bi bi-box-arrow-right me-2"></i>Sign Out</a></li>
          </ul>
        </div>
      </div>
    </header>
  )
}
