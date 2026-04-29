import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/syne/400.css'
import '@fontsource/syne/600.css'
import '@fontsource/syne/700.css'
import '@fontsource/syne/800.css'
import { OnboardingProvider } from './context/OnboardingContext'
import { MessagingProvider } from './context/MessagingContext'
import { ProjectProvider } from './context/ProjectContext'
import { CollabProvider } from './context/CollabContext'
import NavigationBridge from './NavigationBridge'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
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
    </ErrorBoundary>
  </React.StrictMode>,
)
