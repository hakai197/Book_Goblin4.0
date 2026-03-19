import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <AppRoutes />
    </ErrorBoundary>
  )
}
