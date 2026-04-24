import { useState, useCallback } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { uploadFile } from '../../lib/uploadFile'
import StepHeader from '../ui/StepHeader'
import FormGroup from '../ui/FormGroup'
import HintBox from '../ui/HintBox'
import UploadZone from '../ui/UploadZone'
import SectionDivider from '../ui/SectionDivider'
import Button from '../ui/Button'
import StepNav from '../ui/StepNav'

export default function Step4Portfolio() {
  const { goToStep, formData, updateFormData, user } = useOnboarding()
  const [browseTrigger, setBrowseTrigger] = useState(null)
  const [clipUploading, setClipUploading] = useState(false)
  const [clipUploadError, setClipUploadError] = useState(null)
  const [clipUploadSuccess, setClipUploadSuccess] = useState(false)

  // Ensure portfolioLinks always has at least one field
  const links = formData.portfolioLinks.length > 0 ? formData.portfolioLinks : ['']

  function setLink(i, val) {
    const next = [...links]
    next[i] = val
    updateFormData({ portfolioLinks: next })
  }

  function addLink() {
    updateFormData({ portfolioLinks: [...links, ''] })
  }

  function removeLink(i) {
    if (links.length <= 1) return
    const next = links.filter((_, idx) => idx !== i)
    updateFormData({ portfolioLinks: next })
  }

  async function handleClipUpload(files) {
    if (!files.length || !user) return
    setClipUploading(true)
    setClipUploadError(null)
    setClipUploadSuccess(false)

    const uploadedUrls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const url = await uploadFile('portfolio', `${user.id}/${name}`, file)
      if (url) uploadedUrls.push(url)
    }

    setClipUploading(false)

    if (uploadedUrls.length > 0) {
      // Add uploaded URLs to portfolio links (filter out empty strings first)
      const existing = formData.portfolioLinks.filter((l) => l.trim())
      updateFormData({ portfolioLinks: [...existing, ...uploadedUrls] })
      setClipUploadSuccess(true)
      setTimeout(() => setClipUploadSuccess(false), 3000)
    } else {
      setClipUploadError('Erreur lors de l\'upload. Vérifie ta connexion et réessaie.')
    }
  }

  const handleReady = useCallback((trigger) => {
    setBrowseTrigger(() => trigger)
  }, [])

  // Separate uploaded clips (URLs) from empty/manual links
  const uploadedClips = formData.portfolioLinks.filter((l) => l.trim() && (l.startsWith('http://') || l.startsWith('https://')))

  return (
    <div className="step-screen">
      <StepHeader
        tag="Étape 4 sur 7"
        title="Ton portfolio"
        desc="Des clips de 15 à 45 secondes suffisent. Les clients veulent voir ta patte, pas un film."
      />

      {/* Existing uploaded clips */}
      {uploadedClips.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {uploadedClips.length} clip{uploadedClips.length > 1 ? 's' : ''} soumis
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {uploadedClips.map((url, i) => (
              <div key={i} style={{ position: 'relative', width: 120, height: 68, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
                {url.match(/\.(mp4|mov|webm)(\?|$)/i) ? (
                  <video src={url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--text-muted)', padding: 4, textAlign: 'center', wordBreak: 'break-all' }}>
                    {new URL(url).hostname}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const next = formData.portfolioLinks.filter((l) => l !== url)
                    updateFormData({ portfolioLinks: next.length > 0 ? next : [''] })
                  }}
                  style={{ position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,77,77,0.9)', border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Supprimer"
                >×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <UploadZone
        icon="🎬"
        title="Glisse tes clips ici"
        hint="MP4 · Max 500 Mo par clip"
        accept="video/mp4,video/quicktime,video/webm"
        multiple
        maxSizeMB={500}
        onFilesChange={handleClipUpload}
        uploading={clipUploading}
        uploadError={clipUploadError}
        uploadSuccess={clipUploadSuccess}
        onReady={handleReady}
        style={{ marginBottom: 24 }}
      >
        {!clipUploading && (
          <Button
            variant="ghost"
            style={{ marginTop: 8 }}
            onClick={(e) => {
              e.stopPropagation()
              browseTrigger?.()
            }}
          >
            Parcourir les fichiers
          </Button>
        )}
      </UploadZone>

      <SectionDivider>Ou ajoute des liens externes</SectionDivider>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
        {links.map((link, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔗 Lien YouTube, Vimeo, Google Drive..."
              value={link}
              onChange={(e) => setLink(i, e.target.value)}
              style={{ flex: 1 }}
            />
            {links.length > 1 && (
              <button
                type="button"
                onClick={() => removeLink(i)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)',
                  width: 36, height: 36, cursor: 'pointer', fontSize: 16, flexShrink: 0,
                }}
                title="Supprimer ce lien"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLink}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, background: 'transparent',
          border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)',
          color: 'var(--text-muted)', fontSize: 13, padding: '9px 14px',
          cursor: 'pointer', width: '100%', marginBottom: 24, fontFamily: 'inherit',
        }}
      >
        + Ajouter un lien
      </button>

      <FormGroup label="Chaînes / comptes sur lesquels tu as été crédité" optional="optionnel">
        <input
          type="text"
          placeholder="ex: @nomdelachain, youtube.com/c/..."
          value={formData.creditedChannels}
          onChange={(e) => updateFormData({ creditedChannels: e.target.value })}
        />
      </FormGroup>

      <HintBox>
        Un seul clip suffit pour publier ton profil. Tu pourras en ajouter d'autres plus tard.
      </HintBox>

      <StepNav
        onBack={() => goToStep(3)}
        onNext={() => goToStep(5)}
        onSkip={() => goToStep(5)}
      />
    </div>
  )
}
