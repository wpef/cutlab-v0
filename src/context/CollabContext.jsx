import { createContext, useContext, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useOnboarding } from './OnboardingContext'

const CollabContext = createContext(null)

export function CollabProvider({ children }) {
  const { user } = useOnboarding()

  const [rounds, setRounds] = useState([])
  const [reviews, setReviews] = useState([])
  const [collabLoading, setCollabLoading] = useState(false)

  // ─── Step derivation ──────────────────────────────────────────
  // Pure function: derives the current collaboration step from data.
  // Called by CollabTracker with live data.
  function deriveCollabStep(request, offer, roundsList, reviewsList) {
    if (!request) return null

    // Project fully closed
    if (request.payment_received_at) {
      return (reviewsList ?? []).find((r) => r.type === 'creator_to_editor')
        ? 'closed'
        : 'feedback'
    }

    // Waiting for editor to confirm receipt
    if (request.payment_sent_at) return 'payment_confirmation'

    // Derive from latest delivery round
    const latest = (roundsList ?? []).at(-1)
    if (latest?.status === 'validated')          return 'payment'
    if (latest?.status === 'revision_requested') return 'revision'
    if (latest?.status === 'pending_review')     return 'under_review'

    // No delivery round yet — derive from offer
    if (offer?.status === 'accepted') return 'production'
    if (offer?.status === 'pending')  return 'offer_sent'

    // No offer yet — project-based vs direct contact
    if (request.project_id) {
      if (request.status === 'accepted') return 'candidature_accepted'
      return 'candidature_sent'
    }

    // direct contact — derive from request status
    if (request.status === 'pending') return 'contact_pending'
    if (request.status === 'accepted') return 'contact_accepted'
    return 'offer_sent' // fallback
  }

  // ─── Data loading ─────────────────────────────────────────────

  const loadCollabData = useCallback(async (requestId) => {
    if (!requestId) return
    setCollabLoading(true)

    const [{ data: roundsData }, { data: reviewsData }] = await Promise.all([
      supabase
        .from('deliverable_rounds')
        .select('*')
        .eq('request_id', requestId)
        .order('round_number', { ascending: true }),
      supabase
        .from('project_reviews')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: true }),
    ])

    setRounds(roundsData ?? [])
    setReviews(reviewsData ?? [])
    setCollabLoading(false)
  }, [])

  // ─── Notification helper ──────────────────────────────────────

  async function notify(params) {
    const { error } = await supabase.from('notifications').insert(params)
    if (error) console.error('[Collab] notify:', error.message)
  }

  // ─── Actions ─────────────────────────────────────────────────

  /** Editor: submits a new delivery round with an external link. */
  const submitDeliverables = useCallback(async (requestId, link, note, request, offer) => {
    if (!user) return null
    const nextRound = rounds.length + 1

    const { data, error } = await supabase
      .from('deliverable_rounds')
      .insert({
        request_id: requestId,
        round_number: nextRound,
        editor_id: user.id,
        delivery_link: link || null,
        editor_note: note || null,
        status: 'pending_review',
      })
      .select()
      .single()

    if (error) { console.error('[Collab] submitDeliverables:', error.message); return null }
    setRounds((prev) => [...prev, data])

    if (request?.creator_id) {
      await notify({
        user_id: request.creator_id,
        type: 'deliverable_shared',
        request_id: requestId,
        project_id: request.project_id ?? null,
        actor_id: user.id,
        actor_name: request.editor_name ?? '',
        project_title: offer?.title ?? '',
        read: false,
      })
    }

    return data
  }, [user, rounds])

  /** Creator: requests a revision on the given round. */
  const requestRevision = useCallback(async (roundId, feedback, request, offer) => {
    if (!user) return false

    const { error } = await supabase
      .from('deliverable_rounds')
      .update({
        status: 'revision_requested',
        creator_feedback: feedback,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', roundId)

    if (error) { console.error('[Collab] requestRevision:', error.message); return false }
    setRounds((prev) => prev.map((r) =>
      r.id === roundId ? { ...r, status: 'revision_requested', creator_feedback: feedback } : r
    ))

    if (request?.editor_id) {
      await notify({
        user_id: request.editor_id,
        type: 'revision_requested',
        request_id: request.id,
        project_id: request.project_id ?? null,
        actor_id: user.id,
        actor_name: request.creator_name ?? '',
        project_title: offer?.title ?? '',
        read: false,
      })
    }

    return true
  }, [user])

  /** Creator: validates the given delivery round. */
  const validateDeliverables = useCallback(async (roundId, feedback, request, offer) => {
    if (!user) return false

    const { error } = await supabase
      .from('deliverable_rounds')
      .update({
        status: 'validated',
        creator_feedback: feedback ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', roundId)

    if (error) { console.error('[Collab] validateDeliverables:', error.message); return false }
    setRounds((prev) => prev.map((r) =>
      r.id === roundId ? { ...r, status: 'validated', creator_feedback: feedback ?? null } : r
    ))

    if (request?.editor_id) {
      await notify({
        user_id: request.editor_id,
        type: 'deliverables_validated',
        request_id: request.id,
        project_id: request.project_id ?? null,
        actor_id: user.id,
        actor_name: request.creator_name ?? '',
        project_title: offer?.title ?? '',
        read: false,
      })
    }

    return true
  }, [user])

  /** Creator: marks payment as sent. */
  const confirmPaymentSent = useCallback(async (request, offer) => {
    if (!user || !request) return false

    const { error } = await supabase
      .from('contact_requests')
      .update({ payment_sent_at: new Date().toISOString() })
      .eq('id', request.id)

    if (error) { console.error('[Collab] confirmPaymentSent:', error.message); return false }

    if (request.editor_id) {
      await notify({
        user_id: request.editor_id,
        type: 'payment_sent',
        request_id: request.id,
        project_id: request.project_id ?? null,
        actor_id: user.id,
        actor_name: request.creator_name ?? '',
        project_title: offer?.title ?? '',
        read: false,
      })
    }

    return true
  }, [user])

  /** Editor: confirms payment received. Closes project + offer pipeline flags. */
  const confirmPaymentReceived = useCallback(async (request, offer) => {
    if (!user || !request) return false

    const now = new Date().toISOString()
    const ops = [
      supabase
        .from('contact_requests')
        .update({ payment_received_at: now })
        .eq('id', request.id),
    ]

    if (request.project_id) {
      ops.push(
        supabase.from('projects')
          .update({ status: 'completed' })
          .eq('id', request.project_id)
      )
    }

    if (offer?.id) {
      ops.push(
        supabase.from('offers')
          .update({ validated_by_editor: true, validated_by_creator: true })
          .eq('id', offer.id)
      )
    }

    const results = await Promise.all(ops)
    if (results.some((r) => r.error)) {
      console.error('[Collab] confirmPaymentReceived error')
      return false
    }

    if (request.creator_id) {
      await notify({
        user_id: request.creator_id,
        type: 'payment_received',
        request_id: request.id,
        project_id: request.project_id ?? null,
        actor_id: user.id,
        actor_name: request.editor_name ?? '',
        project_title: offer?.title ?? '',
        read: false,
      })
    }

    return true
  }, [user])

  /** Creator or editor: submits a review. Auto-closes if creator review exists. */
  const submitReview = useCallback(async (requestId, reviewData, request, offer) => {
    if (!user) return null

    const { data, error } = await supabase
      .from('project_reviews')
      .insert({
        request_id: requestId,
        reviewer_id: user.id,
        reviewee_id: reviewData.revieweeId,
        rating: reviewData.rating ?? null,
        comment: reviewData.comment ?? null,
        type: reviewData.type,
      })
      .select()
      .single()

    if (error) { console.error('[Collab] submitReview:', error.message); return null }
    setReviews((prev) => [...prev, data])

    if (reviewData.revieweeId) {
      await notify({
        user_id: reviewData.revieweeId,
        type: 'review_received',
        request_id: requestId,
        project_id: request?.project_id ?? null,
        actor_id: user.id,
        actor_name: reviewData.type === 'creator_to_editor'
          ? (request?.creator_name ?? '')
          : (request?.editor_name ?? ''),
        project_title: offer?.title ?? '',
        read: false,
      })
    }

    return data
  }, [user])

  return (
    <CollabContext.Provider value={{
      rounds,
      reviews,
      collabLoading,
      loadCollabData,
      deriveCollabStep,
      submitDeliverables,
      requestRevision,
      validateDeliverables,
      confirmPaymentSent,
      confirmPaymentReceived,
      submitReview,
    }}>
      {children}
    </CollabContext.Provider>
  )
}

export function useCollab() {
  const ctx = useContext(CollabContext)
  if (!ctx) throw new Error('useCollab must be used inside CollabProvider')
  return ctx
}
