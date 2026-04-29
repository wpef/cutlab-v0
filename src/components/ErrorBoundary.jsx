import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-inner">
            <h2>Une erreur est survenue</h2>
            <p>Rechargez la page pour continuer.</p>
            <button onClick={() => window.location.reload()}>Recharger</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
