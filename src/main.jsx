import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { OnboardingProvider } from './context/OnboardingContext'
import { MessagingProvider } from './context/MessagingContext'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OnboardingProvider>
      <MessagingProvider>
        <App />
      </MessagingProvider>
    </OnboardingProvider>
  </React.StrictMode>,
)
