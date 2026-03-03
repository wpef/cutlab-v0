import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const OnboardingContext = createContext(null)

const INITIAL_FORM = {
  // Step 1 (auth — not stored in DB directly)
  email: '',
  // Step 2
  firstName: '', lastName: '', username: '', avatarUrl: '',
  languages: ['fr'], availability: 'Disponible',
  // Step 3
  skills: ['video'], formats: ['youtube'], niches: ['Gaming'],
  experience: '1-3y', software: ['Premiere Pro', 'DaVinci Resolve'],
  // Step 4
  portfolioLinks: ['', ''], creditedChannels: '',
  // Step 5
  revisions: '2', capacity: '2-3', hourlyRate: '', deliveryTime: '',
  // Step 6
  bio: '', missionTypes: ['ponctuelle', 'long-terme'], responseTime: '<4h', socialLinks: '',
}

export function OnboardingProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [currentView, setCurrentView] = useState('onboarding') // 'onboarding' | 'editor'
  const [assignedLevel, setAssignedLevel] = useState(2)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [saving, setSaving] = useState(false)

  // Sync auth state on mount and across tab changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  function updateFormData(patch) {
    setFormData((prev) => ({ ...prev, ...patch }))
  }

  function goToStep(n) {
    setCurrentStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function signUpUser(email, password) {
    setAuthLoading(true)
    setAuthError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setAuthLoading(false)
    if (error) { setAuthError(error.message); return false }
    setUser(data.user)
    updateFormData({ email })
    return true
  }

  async function signInWithGoogle() {
    setAuthError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) setAuthError(error.message)
  }

  async function saveProfile(status = 'draft') {
    if (!user) return false
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      username: formData.username,
      avatar_url: formData.avatarUrl,
      languages: formData.languages,
      availability: formData.availability,
      skills: formData.skills,
      formats: formData.formats,
      niches: formData.niches,
      experience: formData.experience,
      software: formData.software,
      portfolio_links: formData.portfolioLinks,
      credited_channels: formData.creditedChannels,
      revisions: formData.revisions,
      capacity: formData.capacity,
      hourly_rate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
      delivery_time: formData.deliveryTime,
      bio: formData.bio,
      mission_types: formData.missionTypes,
      response_time: formData.responseTime,
      social_links: formData.socialLinks,
      assigned_level: assignedLevel,
      status,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    if (error) { console.error('[Supabase] saveProfile:', error.message); return false }
    return true
  }

  async function publishProfile() {
    const ok = await saveProfile('published')
    if (ok) {
      setCurrentStep(9)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return ok
  }

  async function loadProfile() {
    if (!user) return
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (error || !data) return
    if (data.assigned_level != null) setAssignedLevel(data.assigned_level)
    setFormData((prev) => ({
      ...prev,
      firstName:       data.first_name        ?? prev.firstName,
      lastName:        data.last_name         ?? prev.lastName,
      username:        data.username          ?? prev.username,
      avatarUrl:       data.avatar_url        ?? prev.avatarUrl,
      languages:       data.languages         ?? prev.languages,
      availability:    data.availability      ?? prev.availability,
      skills:          data.skills            ?? prev.skills,
      formats:         data.formats           ?? prev.formats,
      niches:          data.niches            ?? prev.niches,
      experience:      data.experience        ?? prev.experience,
      software:        data.software          ?? prev.software,
      portfolioLinks:  data.portfolio_links   ?? prev.portfolioLinks,
      creditedChannels: data.credited_channels ?? prev.creditedChannels,
      revisions:       data.revisions         ?? prev.revisions,
      capacity:        data.capacity          ?? prev.capacity,
      hourlyRate:      data.hourly_rate != null ? String(data.hourly_rate) : prev.hourlyRate,
      deliveryTime:    data.delivery_time      ?? prev.deliveryTime,
      bio:             data.bio               ?? prev.bio,
      missionTypes:    data.mission_types     ?? prev.missionTypes,
      responseTime:    data.response_time     ?? prev.responseTime,
      socialLinks:     data.social_links      ?? prev.socialLinks,
    }))
  }

  async function goToEditor() {
    await loadProfile()
    setCurrentView('editor')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep, goToStep,
        currentView, goToEditor,
        assignedLevel, setAssignedLevel,
        formData, updateFormData,
        user, authLoading, authError,
        signUpUser, signInWithGoogle,
        saveProfile, publishProfile,
        saving,
      }}
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
