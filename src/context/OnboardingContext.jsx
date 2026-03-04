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
  presentationVideoUrl: '',
  // Step 7
  certificationStatus: 'draft', // 'draft' | 'pending'
  // Role
  role: 'editor',
}

export function OnboardingProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [maxStepReached, setMaxStepReached] = useState(1)
  const [currentView, setCurrentView] = useState('landing') // 'landing' | 'onboarding' | 'editor' | 'catalog' | 'creator-signup' | 'messaging' | 'chat' | 'offer-form' | 'offer-preview' | 'projects' | 'pipeline'
  const [assignedLevel, setAssignedLevel] = useState(2)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pendingEditor, setPendingEditor] = useState(null) // { id, name } — set when non-logged creator clicks "Contacter"

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
    setMaxStepReached((prev) => Math.max(prev, n))
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

  async function signInUser(email, password) {
    setAuthLoading(true)
    setAuthError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setAuthLoading(false)
    if (error) { setAuthError(error.message); return false }
    setUser(data.user)
    updateFormData({ email })
    return true
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setFormData(INITIAL_FORM)
    setAssignedLevel(2)
    setCurrentStep(1)
    setCurrentView('landing')
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
      portfolio_links: formData.portfolioLinks.filter(link => link.trim()),
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
      role: formData.role,
      certification_status: formData.certificationStatus ?? 'draft',
      presentation_video_url: formData.presentationVideoUrl || null,
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
      socialLinks:             data.social_links            ?? prev.socialLinks,
      presentationVideoUrl:    data.presentation_video_url  ?? prev.presentationVideoUrl,
      certificationStatus:     data.certification_status    ?? prev.certificationStatus,
      role:                    data.role                    ?? prev.role,
    }))
  }

  async function loginAndRedirect(email, password) {
    const ok = await signInUser(email, password)
    if (!ok) return false
    // Load profile to get the role from DB
    const { data } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single()
    const role = data?.role || 'editor'
    setFormData((prev) => ({ ...prev, role }))
    if (role === 'creator') {
      setCurrentView('catalog')
    } else {
      await loadProfile()
      setCurrentView('projects')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return true
  }

  async function goToEditor() {
    await loadProfile()
    setCurrentView('editor')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToProjects() {
    setCurrentView('projects')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToLanding() {
    setCurrentView('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToOnboarding() {
    setCurrentStep(1)
    setCurrentView('onboarding')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToCatalog() {
    setCurrentView('catalog')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToCreatorSignup(editorId = null, editorName = '') {
    if (editorId) setPendingEditor({ id: editorId, name: editorName })
    else setPendingEditor(null)
    setCurrentView('creator-signup')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearPendingEditor() {
    setPendingEditor(null)
  }

  function goToMessaging() {
    setCurrentView('messaging')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToChat(requestId) {
    setCurrentView('chat')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToPipeline() {
    setCurrentView('pipeline')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToOfferForm() {
    setCurrentView('offer-form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goToOfferPreview() {
    setCurrentView('offer-preview')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /** Navigate to the role-appropriate home: Monteur -> projects, Créateur -> catalog */
  function goToHome() {
    if (formData.role === 'creator') goToCatalog()
    else goToProjects()
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep, goToStep, maxStepReached,
        currentView, goToLanding, goToOnboarding, goToCatalog, goToEditor, goToProjects, goToHome,
        goToCreatorSignup, goToMessaging, goToChat, goToPipeline, goToOfferForm, goToOfferPreview,
        assignedLevel, setAssignedLevel,
        formData, updateFormData,
        userRole: formData.role,
        pendingEditor, clearPendingEditor,
        user, authLoading, authError,
        signUpUser, signInUser, signInWithGoogle, signOut, loginAndRedirect,
        clearAuthError: () => setAuthError(null),
        saveProfile, publishProfile, loadProfile,
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
