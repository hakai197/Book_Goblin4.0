import Header from './Header'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  return (
    <>
      <Header />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 content-area" style={{ marginLeft: 'var(--sidebar-width)' }}>
          <div className="container-fluid py-4 px-3 px-lg-4">
            {children}
          </div>
        </main>
      </div>
      <footer className="py-4 bg-dark-glass border-top border-glass">
        <div className="text-center">
          <p className="mb-0">&copy; U197 Designs 2025 | Book Goblin - Your Personal Library Assistant</p>
        </div>
      </footer>
    </>
  )
}
