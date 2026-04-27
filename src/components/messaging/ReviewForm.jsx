import { useState } from 'react'

/**
 * ReviewForm — end-of-collaboration feedback form.
 * Creator→editor : star rating (required) + comment (required).
 * Editor→creator : comment only (optional).
 */
export default function ReviewForm({ type, onSubmit, loading }) {
  const isCreator = type === 'creator_to_editor'

  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    setError('')
    if (isCreator && rating === 0) { setError('Veuillez attribuer une note.'); return }
    if (isCreator && !comment.trim()) { setError('Veuillez laisser un commentaire.'); return }
    onSubmit({ rating: isCreator ? rating : null, comment: comment.trim() || null })
  }

  return (
    <div className="review-form">
      {isCreator && (
        <div className="review-stars-row">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`review-star${star <= (hovered || rating) ? ' review-star--active' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              type="button"
              aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
          {rating > 0 && (
            <span className="review-star-label">{rating} / 5</span>
          )}
        </div>
      )}

      <textarea
        className="review-textarea"
        placeholder={
          isCreator
            ? 'Partagez votre expérience avec ce monteur…'
            : 'Laissez un commentaire (optionnel)…'
        }
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />

      {error && <div className="tracker-error">{error}</div>}

      <button
        className="btn btn-primary tracker-action-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Envoi…' : 'Soumettre l\'avis'}
      </button>
    </div>
  )
}
