import { createContext, useContext, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useOnboarding } from './OnboardingContext'

const MessagingContext = createContext(null)

export function MessagingProvider({ children }) {
  const { user, updateFormData } = useOnboarding()

  const [requests, setRequests] = useState([])
  const [messages, setMessages] = useState([])
  const [offers, setOffers] = useState([])
  const [pipelineOffers, setPipelineOffers] = useState([])
  const [activeRequestId, setActiveRequestId] = useState(null)
  const [messagingLoading, setMessagingLoading] = useState(false)
  const [offerFormData, setOfferFormData] = useState(null)
  const [signupError, setSignupError] = useState(null)
  const [signupLoading, setSignupLoading] = useState(false)

  async function signUpCreator(firstName, email, password) {
    setSignupLoading(true)
    setSignupError(null)

    // Try sign in first (existing account)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (!signInError && signInData.user) {
      updateFormData({ firstName, email, role: 'creator' })
      setSignupLoading(false)
      return { user: signInData.user }
    }

    // New account
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setSignupError(error.message)
      setSignupLoading(false)
      return { error: error.message }
    }

    const userId = data.user?.id
    if (!userId) {
      const msg = 'Compte créé — vérifie ta boîte mail pour confirmer.'
      setSignupError(msg)
      setSignupLoading(false)
      return { error: msg }
    }

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      first_name: firstName,
      role: 'creator',
      updated_at: new Date().toISOString(),
    })
    if (profileError) {
      setSignupError(profileError.message)
      setSignupLoading(false)
      return { error: profileError.message }
    }

    updateFormData({ firstName, email, role: 'creator' })
    setSignupLoading(false)
    return { user: data.user }
  }

  async function loadRequests() {
    if (!user) return
    setMessagingLoading(true)
    const { data } = await supabase
      .from('contact_requests')
      .select('*')
      .or(`creator_id.eq.${user.id},editor_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
    setRequests(data ?? [])
    setMessagingLoading(false)
  }

  async function sendContactRequest(editorId, initialMessage, creatorName, editorName) {
    if (!user) return false
    const { error } = await supabase.from('contact_requests').insert({
      creator_id: user.id,
      editor_id: editorId,
      initial_message: initialMessage,
      creator_name: creatorName,
      editor_name: editorName,
    })
    return !error
  }

  async function acceptRequest(requestId) {
    const { error } = await supabase
      .from('contact_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId)
    if (!error) {
      setRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status: 'accepted' } : r))
    }
    return !error
  }

  async function refuseRequest(requestId) {
    const { error } = await supabase
      .from('contact_requests')
      .update({ status: 'refused' })
      .eq('id', requestId)
    if (!error) {
      setRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status: 'refused' } : r))
    }
    return !error
  }

  async function fetchMessages(requestId) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
    return data ?? []
  }

  async function sendMessage(requestId, content) {
    if (!user) return false
    const { error } = await supabase.from('messages').insert({
      request_id: requestId,
      sender_id: user.id,
      content,
    })
    return !error
  }

  async function loadOffers(requestId) {
    const { data } = await supabase
      .from('offers')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false })
    if (data) setOffers(data)
  }

  async function sendOffer(requestId, offerData) {
    if (!user) return null
    const request = requests.find((r) => r.id === requestId)
    if (!request) return null
    const { data, error } = await supabase
      .from('offers')
      .insert({
        request_id: requestId,
        creator_id: user.id,
        editor_id: request.editor_id,
        title: offerData.title,
        description: offerData.description,
        deliverables: offerData.deliverables,
        format: offerData.format,
        deadline: offerData.deadline,
        budget: offerData.budget ? Number(offerData.budget) : null,
        revisions: offerData.revisions ? Number(offerData.revisions) : 2,
        status: 'pending',
        creator_name: request.creator_name,
        editor_name: request.editor_name,
      })
      .select()
      .single()
    if (error) return null
    return data
  }

  async function acceptOffer(offerId) {
    const { error } = await supabase
      .from('offers')
      .update({ status: 'accepted' })
      .eq('id', offerId)
    if (!error) {
      setOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, status: 'accepted' } : o))
    }
    return !error
  }

  async function loadPipelineData() {
    if (!user) return { requests: [], allOffers: [] }
    setMessagingLoading(true)

    const { data: reqs } = await supabase
      .from('contact_requests')
      .select('*')
      .eq('editor_id', user.id)
      .order('created_at', { ascending: false })

    const requestList = reqs ?? []
    let offerList = []
    const requestIds = requestList.map((r) => r.id)
    if (requestIds.length > 0) {
      const { data: offs } = await supabase
        .from('offers')
        .select('*')
        .in('request_id', requestIds)
        .order('created_at', { ascending: false })
      offerList = offs ?? []
    }

    setRequests(requestList)
    setPipelineOffers(offerList)
    setMessagingLoading(false)
    return { requests: requestList, allOffers: offerList }
  }

  async function validateMission(offerId) {
    const { error } = await supabase
      .from('offers')
      .update({ validated_by_editor: true })
      .eq('id', offerId)
    if (!error) {
      setPipelineOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, validated_by_editor: true } : o))
    }
    return !error
  }

  async function refuseOffer(offerId) {
    const { error } = await supabase
      .from('offers')
      .update({ status: 'refused' })
      .eq('id', offerId)
    if (!error) {
      setOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, status: 'refused' } : o))
    }
    return !error
  }

  return (
    <MessagingContext.Provider value={{
      requests, messages, offers, pipelineOffers,
      activeRequestId, setActiveRequestId,
      messagingLoading,
      offerFormData, setOfferFormData,
      signupError, signupLoading,
      signUpCreator,
      loadRequests, loadPipelineData,
      sendContactRequest,
      acceptRequest, refuseRequest,
      fetchMessages, sendMessage,
      loadOffers, sendOffer,
      acceptOffer, refuseOffer,
      validateMission,
    }}>
      {children}
    </MessagingContext.Provider>
  )
}

export function useMessaging() {
  const ctx = useContext(MessagingContext)
  if (!ctx) throw new Error('useMessaging must be used inside MessagingProvider')
  return ctx
}
