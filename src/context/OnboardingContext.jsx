import { createContext, useContext, useState } from 'react'

const OnboardingContext = createContext(null)

export function OnboardingProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [assignedLevel, setAssignedLevel] = useState(2) // Prodige par défaut (démo)

  function goToStep(n) {
    setCurrentStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function publishProfile() {
    setCurrentStep(9)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <OnboardingContext.Provider
      value={{ currentStep, goToStep, publishProfile, assignedLevel, setAssignedLevel }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider')
  return ctx
}
