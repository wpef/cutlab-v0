import { useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { useMessaging } from '../../context/MessagingContext'

export default function OfferPreview() {
  const { goToOfferForm, goToChat, formData } = useOnboarding()
  const { activeRequestId, requests, offerFormData, sendOffer } = useMessaging()

  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const request = requests.find((r) => r.id === activeRequestId)
  const offer = offerFormData

  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  async function handleConfirm() {
    if (!offer) return
    setSending(true)
    setError('')
    const result = await sendOffer(activeRequestId, offer)
    setSending(false)
    if (!result) {
      setError("Erreur lors de l'envoi. Réessaie.")
      return
    }
    goToChat(activeRequestId)
  }

  if (!offer) {
    return (
      <div className="offer-preview-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>Aucune offre à afficher.</p>
          <button className="catalog-header-btn" style={{ marginTop: 16 }} onClick={goToOfferForm}>
            ← Créer une offre
          </button>
        </div>
      </div>
    )
  }

  const creatorName = request?.creator_name || formData.firstName || 'Créateur'
  const editorName  = request?.editor_name || 'Monteur'

  return (
    <div className="offer-preview-page">

      {/* Action bar — hidden on print */}
      <div className="offer-preview-actions no-print">
        <button className="chat-back-btn" onClick={goToOfferForm}>← Modifier</button>
        <button className="btn btn-ghost" style={{ padding: '9px 18px', fontSize: 13 }} onClick={() => window.print()}>
          🖨️ Imprimer / PDF
        </button>
        <div style={{ flex: 1 }} />
        {error && <span style={{ fontSize: 13, color: '#ff4d4d' }}>{error}</span>}
        <button
          className="btn btn-primary"
          style={{ padding: '10px 24px', fontSize: 14 }}
          onClick={handleConfirm}
          disabled={sending}
        >
          {sending ? 'Envoi...' : 'Confirmer l\'envoi →'}
        </button>
      </div>

      {/* Document */}
      <div className="offer-doc">

        {/* Document header */}
        <div className="offer-doc-header">
          <div>
            <div className="offer-doc-logo">CUT<span>LAB</span></div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Plateforme de montage vidéo</div>
          </div>
          <div className="offer-doc-meta">
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Offre de projet</div>
            <div>Date : {today}</div>
          </div>
        </div>

        {/* Title */}
        <div className="offer-doc-title">{offer.title}</div>

        {/* Parties */}
        <div className="offer-doc-parties">
          <div>
            <div className="offer-doc-party-label">Créateur</div>
            <div className="offer-doc-party-name">{creatorName}</div>
          </div>
          <div>
            <div className="offer-doc-party-label">Monteur</div>
            <div className="offer-doc-party-name">{editorName}</div>
          </div>
        </div>

        <hr className="offer-doc-divider" />

        {/* Description */}
        {offer.description && (
          <div className="offer-doc-section">
            <div className="offer-doc-section-label">Description du projet</div>
            <div className="offer-doc-section-value" style={{ whiteSpace: 'pre-wrap' }}>{offer.description}</div>
          </div>
        )}

        {/* Deliverables */}
        {offer.deliverables && (
          <div className="offer-doc-section">
            <div className="offer-doc-section-label">Livrables attendus</div>
            <div className="offer-doc-section-value" style={{ whiteSpace: 'pre-wrap' }}>{offer.deliverables}</div>
          </div>
        )}

        {/* Details row */}
        <div className="offer-doc-details">
          {offer.format && (
            <div className="offer-doc-section" style={{ marginBottom: 0 }}>
              <div className="offer-doc-section-label">Format</div>
              <div className="offer-doc-section-value">{offer.format}</div>
            </div>
          )}
          {offer.deadline && (
            <div className="offer-doc-section" style={{ marginBottom: 0 }}>
              <div className="offer-doc-section-label">Deadline</div>
              <div className="offer-doc-section-value">{offer.deadline}</div>
            </div>
          )}
          {offer.revisions && (
            <div className="offer-doc-section" style={{ marginBottom: 0 }}>
              <div className="offer-doc-section-label">Retours inclus</div>
              <div className="offer-doc-section-value">{offer.revisions}</div>
            </div>
          )}
        </div>

        <hr className="offer-doc-divider" />

        {/* Budget */}
        <div className="offer-doc-section">
          <div className="offer-doc-section-label">Budget total</div>
          <div className="offer-doc-budget">
            {Number(offer.budget).toLocaleString('fr-FR')} €
          </div>
        </div>

        <hr className="offer-doc-divider" />

        {/* Signatures */}
        <div className="offer-doc-signatures">
          <div>
            <div className="offer-doc-sig-label">Signature du créateur</div>
            <div className="offer-doc-sig-line">{creatorName}</div>
          </div>
          <div>
            <div className="offer-doc-sig-label">Signature du monteur</div>
            <div className="offer-doc-sig-line">{editorName}</div>
          </div>
        </div>

        <div style={{ marginTop: 40, fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
          Document généré via CUTLAB · Non contractuel sans signatures des deux parties
        </div>

      </div>
    </div>
  )
}
