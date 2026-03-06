import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
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
  const [assignedLevel, setAssignedLevel] = useState(2)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false) // true once initial session check is done
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pendingEditor, setPendingEditor] = useState(null) // { id, name } — set when non-logged creator clicks "Contacter"

  // Demo mode: null | 'editor' | 'creator' | 'onboarding'
  const [demoMode, setDemoMode] = useState(null)

  // React Router navigation bridge
  const navigateRef = useRef(null)

  function nav(path) {
    if (navigateRef.current) navigateRef.current(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Sync auth state on mount and across tab changes.
  // When a session already exists (page refresh), load the user's role from DB
  // so route guards work correctly before any user interaction.
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single()
        if (data?.role) setFormData((prev) => ({ ...prev, role: data.role }))
      }
      setAuthReady(true)
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
    nav(`/onboarding/${n}`)
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
    const wasDemoOnboarding = demoMode === 'onboarding'
    const userId = user?.id

    // Sign out from Supabase (clears auth tokens)
    await supabase.auth.signOut()

    // If onboarding demo, delete the temporary profile + auth user
    // Profile deletion relies on Supabase RLS / cascade; auth user
    // deletion requires a server-side function or service-role call.
    // We delete the profile row; the orphaned auth user is harmless.
    if (wasDemoOnboarding && userId) {
      try {
        await supabase.from('profiles').delete().eq('id', userId)
      } catch (_) { /* best-effort cleanup */ }
    }

    // Clear ALL local/session storage to avoid data leaks between accounts
    localStorage.clear()
    sessionStorage.clear()

    // Reset in-memory state
    setUser(null)
    setFormData(INITIAL_FORM)
    setAssignedLevel(2)
    setCurrentStep(1)
    setDemoMode(null)

    nav('/')
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
    const { data } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single()
    const role = data?.role || 'editor'
    setFormData((prev) => ({ ...prev, role }))
    if (role === 'creator') {
      nav('/catalog')
    } else {
      await loadProfile()
      nav('/projects')
    }
    return true
  }

  /** Login to a demo editor account and redirect to /projects */
  async function loginDemoEditor(email, password) {
    setDemoMode('editor')
    const ok = await signInUser(email, password)
    if (!ok) { setDemoMode(null); return false }
    const { data } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id).single()
    setFormData((prev) => ({ ...prev, role: data?.role || 'editor' }))
    await loadProfile()
    nav('/projects')
    return true
  }

  /** Login to a demo creator account and redirect to /catalog */
  async function loginDemoCreator(email, password) {
    setDemoMode('creator')
    const ok = await signInUser(email, password)
    if (!ok) { setDemoMode(null); return false }
    setFormData((prev) => ({ ...prev, role: 'creator' }))
    nav('/catalog')
    return true
  }

  /** Start onboarding demo: create anonymous Supabase account, go to onboarding step 2 */
  async function startDemoOnboarding() {
    setDemoMode('onboarding')
    setAuthLoading(true)
    setAuthError(null)

    // Generate a unique throwaway email for this demo session
    const ts = Date.now()
    const rand = Math.random().toString(36).slice(2, 8)
    const demoEmail = `demo-onboarding-${ts}-${rand}@cutlab.io`
    const demoPassword = `demo-onboarding-${ts}!`

    const { data, error } = await supabase.auth.signUp({ email: demoEmail, password: demoPassword })
    setAuthLoading(false)
    if (error) {
      setAuthError(error.message)
      setDemoMode(null)
      return false
    }
    setUser(data.user)
    updateFormData({ email: demoEmail })
    goToStep(2)
    return true
  }

  async function goToEditor() {
    await loadProfile()
    nav('/editor')
  }

  function goToProjects() { nav('/projects') }
  function goToLanding() { nav('/') }

  function goToOnboarding() {
    setCurrentStep(1)
    nav('/onboarding/1')
  }

  function goToCatalog() { nav('/catalog') }

  function goToCreatorSignup(editorId = null, editorName = '') {
    if (editorId) setPendingEditor({ id: editorId, name: editorName })
    else setPendingEditor(null)
    nav('/creator-signup')
  }

  function clearPendingEditor() { setPendingEditor(null) }

  function goToMessaging() { nav('/messaging') }

  function goToChat(requestId) { nav(`/messaging/${requestId}`) }

  function goToPipeline() { nav('/pipeline') }
  function goToOfferForm() { nav('/offer/new') }
  function goToOfferPreview() { nav('/offer/preview') }

  /** Navigate to the role-appropriate home: Monteur -> projects, Createur -> catalog */
  function goToHome() {
    if (formData.role === 'creator') goToCatalog()
    else goToProjects()
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep, goToStep, maxStepReached,
        navigateRef,
        goToLanding, goToOnboarding, goToCatalog, goToEditor, goToProjects, goToHome,
        goToCreatorSignup, goToMessaging, goToChat, goToPipeline, goToOfferForm, goToOfferPreview,
        assignedLevel, setAssignedLevel,
        formData, updateFormData,
        userRole: formData.role,
        pendingEditor, clearPendingEditor,
        user, authReady, authLoading, authError,
        demoMode,
        signUpUser, signInUser, signInWithGoogle, signOut, loginAndRedirect,
        loginDemoEditor, loginDemoCreator, startDemoOnboarding,
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
