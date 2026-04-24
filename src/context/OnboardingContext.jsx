import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { computeScoreDetails } from '../lib/computeLevel'
import { LEVELS } from '../constants/levels'
import { toast } from '../components/ui/Toast'
import { emptyPricingAdjustments } from '../lib/pricing'

const OnboardingContext = createContext(null)

const INITIAL_FORM = {
  // Step 1 (auth — not stored in DB directly)
  email: '',
  // Step 2
  firstName: '', lastName: '', avatarUrl: '',
  languages: ['fr'], availability: 'Disponible',
  // Step 3
  skills: ['video'], formats: ['youtube'], niches: ['Gaming'],
  experience: '1-3y', software: ['Premiere Pro', 'DaVinci Resolve'],
  // Step 4
  portfolioLinks: ['', ''], creditedChannels: '',
  // Step 5
  revisions: '2', capacity: '2-3',
  pricing: { baselineLevel: null, adjustments: emptyPricingAdjustments() },
  // Step 6
  bio: '', missionTypes: ['ponctuelle', 'long-terme'], responseTime: '<4h', socialLinks: {},
  // Step 7
  certificationStatus: 'draft', // 'draft' | 'pending'
  // Computed level index (0-6), persisted after first save
  assignedLevel: null,
  // Role
  role: 'editor',
}

export function OnboardingProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [maxStepReached, setMaxStepReached] = useState(1)
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

      // Handle OAuth callback: if oauthFlow is set, this is a return from Google/Apple
      const oauthFlow = sessionStorage.getItem('oauthFlow')
      if (u && oauthFlow) {
        sessionStorage.removeItem('oauthFlow')
        const savedEditor = sessionStorage.getItem('oauthPendingEditor')
        sessionStorage.removeItem('oauthPendingEditor')

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', u.id).single()

        if (profile?.role) {
          // Existing user — redirect to role home
          setFormData((prev) => ({ ...prev, role: profile.role }))
          if (profile.role === 'creator') nav('/catalog')
          else nav('/projects')
          setAuthReady(true)
          return
        }

        // New user — create minimal profile based on flow
        const fullName = u.user_metadata?.full_name || u.user_metadata?.name || ''
        const firstName = fullName.split(' ')[0] || ''
        const role = oauthFlow === 'creator' ? 'creator' : 'editor'

        await supabase.from('profiles').upsert({
          id: u.id,
          first_name: firstName,
          role,
          avatar_url: u.user_metadata?.avatar_url || '',
          updated_at: new Date().toISOString(),
        })
        setFormData((prev) => ({ ...prev, firstName, role, avatarUrl: u.user_metadata?.avatar_url || '' }))

        if (role === 'creator') {
          if (savedEditor) {
            setPendingEditor(JSON.parse(savedEditor))
            nav('/creator-signup')
          } else {
            nav('/catalog')
          }
        } else {
          // Editor — continue onboarding at step 2
          setCurrentStep(2)
          setMaxStepReached(2)
          nav('/onboarding/2')
        }
        setAuthReady(true)
        return
      }

      // Normal session restore (no OAuth)
      if (u) {
        const { data } = await supabase.from('profiles').select('role').eq('id', u.id).single()
        if (data?.role) setFormData((prev) => ({ ...prev, role: data.role }))
      }
      setAuthReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null
      // TOKEN_REFRESHED / SIGNED_IN au focus d'onglet renvoient un nouvel objet user
      // pour la même identité — on garde la référence précédente pour ne pas
      // re-déclencher les useEffect([user]) qui écrasent formData (ex: vidéo de présentation).
      setUser((prev) => (prev?.id === newUser?.id ? prev : newUser))
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
    if (error) { setAuthLoading(false); setAuthError(error.message); return false }

    // No session after signUp = account already exists (unconfirmed), try signIn
    if (!data.session) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      setAuthLoading(false)
      if (signInError) {
        setAuthError('Ce compte existe déjà. Essaie de te connecter avec ton mot de passe.')
        return false
      }
      setUser(signInData.user)
      updateFormData({ email })
      return true
    }

    setAuthLoading(false)
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
    setCurrentStep(1)
    setDemoMode(null)

    nav('/')
  }

  async function signInWithGoogle(flow = 'editor') {
    setAuthError(null)
    sessionStorage.setItem('oauthFlow', flow)
    if (pendingEditor) sessionStorage.setItem('oauthPendingEditor', JSON.stringify(pendingEditor))
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) setAuthError(error.message)
  }

  async function signInWithApple(flow = 'editor') {
    setAuthError(null)
    sessionStorage.setItem('oauthFlow', flow)
    if (pendingEditor) sessionStorage.setItem('oauthPendingEditor', JSON.stringify(pendingEditor))
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: window.location.origin },
    })
    if (error) setAuthError(error.message)
  }

  async function saveProfile(status = 'draft') {
    if (!user) return false
    setSaving(true)

    const { levelIndex } = computeScoreDetails(formData)

    // Capture the level before save so we can detect a post-onboarding level-up.
    // We only toast when the profile is already published to avoid firing during onboarding itself.
    const prevLevelIndex = formData.assignedLevel ?? null

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
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
      pricing: {
        baseline_level: formData.pricing?.baselineLevel ?? null,
        adjustments: formData.pricing?.adjustments ?? {},
      },
      bio: formData.bio,
      mission_types: formData.missionTypes,
      response_time: formData.responseTime,
      social_links: (() => {
        // Normalize: if legacy string (pre-migration), send empty object
        if (typeof formData.socialLinks !== 'object' || formData.socialLinks === null) return {}
        // Filter out empty-string values before writing to DB
        return Object.fromEntries(
          Object.entries(formData.socialLinks).filter(([, v]) => v && v.trim())
        )
      })(),
      assigned_level: levelIndex,
      role: formData.role,
      certification_status: formData.certificationStatus ?? 'draft',
      status,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    if (error) { console.error('[Supabase] saveProfile:', error.message); return false }

    // Update in-memory assignedLevel so subsequent saves use the latest saved value as baseline
    setFormData((prev) => ({ ...prev, assignedLevel: levelIndex }))

    // Post-onboarding level-up toast: only fires when the profile is already published
    // and the newly computed level is strictly higher than the previous one.
    if (
      status === 'published' &&
      prevLevelIndex !== null &&
      levelIndex > prevLevelIndex
    ) {
      const lvl = LEVELS[levelIndex]
      toast.success(`Niveau débloqué : ${lvl.emoji} ${lvl.name}`)
    }

    return true
  }

  async function publishProfile() {
    const ok = await saveProfile('published')
    if (ok) {
      goToStep(9)
    }
    return ok
  }

  async function loadProfile() {
    if (!user) return
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (error || !data) return

    // Legacy value migration (T006)
    let experience = data.experience
    if (experience === '5y+') experience = '7y+'

    let responseTime = data.response_time
    if (responseTime === '<1h') responseTime = '<4h'

    const loadedFormData = {
      firstName:       data.first_name        ?? INITIAL_FORM.firstName,
      lastName:        data.last_name         ?? INITIAL_FORM.lastName,
      avatarUrl:       data.avatar_url        ?? INITIAL_FORM.avatarUrl,
      languages:       data.languages         ?? INITIAL_FORM.languages,
      availability:    data.availability      ?? INITIAL_FORM.availability,
      skills:          data.skills            ?? INITIAL_FORM.skills,
      formats:         data.formats           ?? INITIAL_FORM.formats,
      niches:          data.niches            ?? INITIAL_FORM.niches,
      experience:      experience             ?? INITIAL_FORM.experience,
      software:        data.software          ?? INITIAL_FORM.software,
      portfolioLinks:  data.portfolio_links   ?? INITIAL_FORM.portfolioLinks,
      creditedChannels: data.credited_channels ?? INITIAL_FORM.creditedChannels,
      revisions:       data.revisions         ?? INITIAL_FORM.revisions,
      capacity:        data.capacity          ?? INITIAL_FORM.capacity,
      pricing: (() => {
        const raw = data.pricing
        if (!raw || typeof raw !== 'object') return INITIAL_FORM.pricing
        return {
          baselineLevel: raw.baseline_level ?? null,
          adjustments: raw.adjustments ?? emptyPricingAdjustments(),
        }
      })(),
      bio:             data.bio               ?? INITIAL_FORM.bio,
      missionTypes:    data.mission_types     ?? INITIAL_FORM.missionTypes,
      responseTime:    responseTime            ?? INITIAL_FORM.responseTime,
      socialLinks:             (() => {
        const raw = data.social_links
        // Coerce legacy string values to empty object (migration may not have run yet)
        if (!raw || typeof raw !== 'object') return INITIAL_FORM.socialLinks
        return raw
      })(),
      certificationStatus:     data.certification_status    ?? INITIAL_FORM.certificationStatus,
      role:                    data.role                    ?? INITIAL_FORM.role,
      // Store the persisted level so saveProfile can detect post-onboarding level-ups
      assignedLevel:           data.assigned_level          ?? null,
    }

    // If legacy assigned_level exceeds new 7-level range (0-6), recalculate
    if (data.assigned_level != null && data.assigned_level > 6) {
      const { levelIndex } = computeScoreDetails(loadedFormData)
      // Persist the recalculated level back to DB (best-effort)
      supabase.from('profiles').update({ assigned_level: levelIndex, experience, response_time: responseTime }).eq('id', user.id).then(() => {})
    }

    setFormData((prev) => ({ ...prev, ...loadedFormData }))
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
    if (error || !data.session) {
      setAuthError(error?.message ?? 'Impossible de créer le compte démo. Désactive la confirmation email dans Supabase.')
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
  function goToMyProjects() { nav('/my-projects') }
  function goToProjectForm(id) { nav(id ? `/project/new?edit=${id}` : '/project/new') }
  function goToProjectDetail(id) { nav(`/project/${id}`) }

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
        goToMyProjects, goToProjectForm, goToProjectDetail,
        formData, updateFormData,
        userRole: formData.role,
        pendingEditor, clearPendingEditor,
        user, authReady, authLoading, authError,
        demoMode,
        signUpUser, signInUser, signInWithGoogle, signInWithApple, signOut, loginAndRedirect,
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
