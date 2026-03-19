import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: 'bi-house', label: 'Home' },
  { to: '/books', icon: 'bi-book', label: 'My Books' },
  { to: '/discover', icon: 'bi-compass', label: 'Discover' },
]

export default function Sidebar() {
  return (
    <nav className="nav-sidebar d-none d-lg-block">
      <div className="d-flex flex-column gap-3 px-3 py-3">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-btn${isActive ? ' active-link' : ' secondary'} text-decoration-none`}
          >
            <i className={`bi ${icon} fs-5`}></i>
            <span className="fs-5">{label}</span>
          </NavLink>
        ))}

        <a
          href="https://www.hpb.com/"
          className="nav-btn secondary text-decoration-none"
          target="_blank"
          rel="noreferrer"
        >
          <i className="bi bi-cart-plus fs-5"></i>
          <span className="fs-5">Buy Books</span>
        </a>

        <div className="dropdown">
          <button
            className="nav-btn secondary dropdown-toggle w-100"
            type="button"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-list fs-5"></i>
            <span className="fs-5">Menu</span>
          </button>
          <ul className="dropdown-menu bg-dark border border-light">
            {['Settings', 'Wishlist', 'Reading Goals', 'Favorites', 'Help & Support'].map(item => (
              <li key={item}>
                <a className="dropdown-item text-light p-3" href="#">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
