import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { OnboardingProvider } from './context/OnboardingContext'
import { MessagingProvider } from './context/MessagingContext'
import { ProjectProvider } from './context/ProjectContext'
import { CollabProvider } from './context/CollabContext'
import NavigationBridge from './NavigationBridge'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <OnboardingProvider>
        <NavigationBridge />
        <MessagingProvider>
          <ProjectProvider>
            <CollabProvider>
              <App />
            </CollabProvider>
          </ProjectProvider>
        </MessagingProvider>
      </OnboardingProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
