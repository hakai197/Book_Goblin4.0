import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <i className="bi bi-exclamation-triangle fs-1 text-warning d-block mb-3"></i>
            <h2 className="text-gradient">Something went wrong</h2>
            <p className="text-muted">{this.state.error?.message}</p>
            <button className="btn btn-gradient" onClick={() => window.location.reload()}>Reload Page</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
