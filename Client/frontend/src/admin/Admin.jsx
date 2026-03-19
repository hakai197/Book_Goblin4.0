import { useState } from 'react'
import { Link } from 'react-router-dom'
import Notification from '../components/common/Notification'

const INITIAL_FLAGS = [
  { id: 1, type: 'Inappropriate Content', book: 'The Dark Tower', user: 'user_123', date: '2024-03-15', status: 'pending' },
  { id: 2, type: 'Incorrect Information', book: 'Dune', user: 'reader_456', date: '2024-03-14', status: 'pending' },
  { id: 3, type: 'Spam Review', book: 'Project Hail Mary', user: 'spammer_789', date: '2024-03-13', status: 'pending' },
]

const RECENT_USERS = [
  { id: 1, username: 'bookworm_42', email: 'user@example.com', joined: '2024-03-15', books: 12 },
  { id: 2, username: 'fantasy_fan', email: 'fan@example.com', joined: '2024-03-14', books: 8 },
  { id: 3, username: 'sci_fi_lover', email: 'scifi@example.com', joined: '2024-03-13', books: 25 },
]

export default function Admin() {
  const [flags, setFlags] = useState(INITIAL_FLAGS)
  const [notification, setNotification] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  function notify(msg, type = 'success') { setNotification({ message: msg, type }) }

  function handleFlag(id, action) {
    setFlags(prev => prev.filter(f => f.id !== id))
    notify(`Flag ${action}d successfully.`, action === 'approve' ? 'success' : action === 'deny' ? 'warning' : 'info')
  }

  const stats = [
    { label: 'Total Users', value: '1,247', icon: 'bi-people', color: 'text-info' },
    { label: 'Pending Flags', value: flags.length, icon: 'bi-flag', color: 'text-warning' },
    { label: 'Book Submissions', value: '89', icon: 'bi-book', color: 'text-success' },
    { label: 'System Uptime', value: '99.9%', icon: 'bi-activity', color: 'text-primary' },
  ]

  return (
    <div className="min-vh-100">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      <nav className="sticky-top py-3 px-4 bg-dark-glass border-bottom border-glass">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <img src="/Img/adminavatar.png" alt="Admin" className="rounded-circle" width="40" height="40" />
            <div>
              <h1 className="h5 mb-0 text-gradient">Book Goblin Admin</h1>
              <small className="text-muted">Administration Panel</small>
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {['overview', 'flags', 'users'].map(tab => (
              <button key={tab} className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <Link to="/dashboard" className="btn btn-sm btn-outline-light">
              <i className="bi bi-arrow-left me-1"></i>Back to App
            </Link>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4 px-4">
        {/* Stats */}
        <div className="row g-4 mb-5">
          {stats.map(({ label, value, icon, color }) => (
            <div key={label} className="col-md-3">
              <div className="card-glass p-4 rounded-4 text-center">
                <i className={`bi ${icon} fs-2 ${color} d-block mb-2`}></i>
                <h3 className="fw-bold text-gradient">{value}</h3>
                <p className="text-muted mb-0">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card-glass p-4 rounded-4">
                <h4 className="text-gradient mb-4">Recent Activity</h4>
                {[
                  { action: 'New user registered', detail: 'bookworm_42 joined', time: '2 min ago', icon: 'bi-person-plus', color: 'text-success' },
                  { action: 'Book flagged', detail: 'Dune - Incorrect info', time: '15 min ago', icon: 'bi-flag', color: 'text-warning' },
                  { action: 'Book submission', detail: 'New book added by admin', time: '1 hr ago', icon: 'bi-book', color: 'text-info' },
                  { action: 'User banned', detail: 'spammer_789 removed', time: '3 hr ago', icon: 'bi-person-x', color: 'text-danger' },
                ].map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-3 py-3 border-bottom border-glass">
                    <i className={`bi ${item.icon} fs-4 ${item.color}`}></i>
                    <div className="flex-grow-1">
                      <p className="mb-0 fw-semibold">{item.action}</p>
                      <small className="text-muted">{item.detail}</small>
                    </div>
                    <small className="text-muted">{item.time}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-glass p-4 rounded-4">
                <h4 className="text-gradient mb-4">Quick Actions</h4>
                <div className="d-flex flex-column gap-2">
                  {['Add New Book', 'Add New User', 'Generate Report', 'Broadcast Announcement', 'Clear Cache'].map(action => (
                    <button key={action} className="btn btn-outline-light text-start" onClick={() => notify(`${action} — coming soon!`, 'info')}>
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flags Tab */}
        {activeTab === 'flags' && (
          <div className="card-glass p-4 rounded-4">
            <h4 className="text-gradient mb-4">Pending Content Flags ({flags.length})</h4>
            {flags.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-check-circle fs-1 d-block mb-3 text-success"></i>
                No pending flags. All clear!
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover">
                  <thead>
                    <tr>
                      <th>Type</th><th>Book</th><th>Reported By</th><th>Date</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flags.map(flag => (
                      <tr key={flag.id}>
                        <td><span className="badge bg-warning text-dark">{flag.type}</span></td>
                        <td>{flag.book}</td>
                        <td className="text-muted">{flag.user}</td>
                        <td className="text-muted">{flag.date}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-success" onClick={() => handleFlag(flag.id, 'approve')}>Approve</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleFlag(flag.id, 'deny')}>Deny</button>
                            <button className="btn btn-sm btn-outline-light" onClick={() => handleFlag(flag.id, 'investigate')}>Investigate</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card-glass p-4 rounded-4">
            <h4 className="text-gradient mb-4">Recent Registrations</h4>
            <div className="table-responsive">
              <table className="table table-dark table-hover">
                <thead>
                  <tr><th>Username</th><th>Email</th><th>Joined</th><th>Books</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {RECENT_USERS.map(user => (
                    <tr key={user.id}>
                      <td>{user.username}</td>
                      <td className="text-muted">{user.email}</td>
                      <td className="text-muted">{user.joined}</td>
                      <td><span className="badge bg-primary">{user.books}</span></td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-light" onClick={() => notify(`Viewing ${user.username}`, 'info')}>View</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => notify(`${user.username} banned.`, 'danger')}>Ban</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <footer className="py-4 bg-dark-glass border-top border-glass" style={{ marginLeft: 0, width: '100%' }}>
        <div className="text-center"><p className="mb-0">&copy; U197 Designs 2025 | Book Goblin Admin</p></div>
      </footer>
    </div>
  )
}
