import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from './context/OnboardingContext'

/** Injects React Router's navigate function into the OnboardingContext navigateRef */
export default function NavigationBridge() {
  const navigate = useNavigate()
  const { navigateRef } = useOnboarding()

  useEffect(() => {
    navigateRef.current = navigate
  }, [navigate, navigateRef])

  return null
}
