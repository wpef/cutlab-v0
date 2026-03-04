import { useRef, useState, useEffect } from 'react'

/**
 * UploadZone — drag-and-drop / click-to-browse upload area with upload state feedback.
 *
 * @param {string}   icon             emoji displayed prominently
 * @param {string}   title            primary label
 * @param {string}   hint             secondary muted text
 * @param {string}   [accept]         MIME types / extensions
 * @param {boolean}  [multiple]       allow multiple file selection
 * @param {number}   [maxSizeMB]      max file size in MB
 * @param {Function} [onFilesChange]  called with File[] when selection changes
 * @param {boolean}  [uploading]      show loading spinner state (controlled by parent)
 * @param {string}   [uploadError]    error message from upload (controlled by parent)
 * @param {boolean}  [uploadSuccess]  flash success state (controlled by parent)
 * @param {Function} [onReady]        receives a trigger function to open file dialog programmatically
 * @param {React.ReactNode} [children]
 * @param {React.CSSProperties} [style]
 */
export default function UploadZone({
  icon, title, hint, accept, multiple, maxSizeMB,
  onFilesChange, uploading, uploadError, uploadSuccess,
  children, style, onReady,
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    onReady?.(() => inputRef.current?.click())
  }, [onReady])

  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewType, setPreviewType] = useState(null) // 'image' | 'video'

  const error = uploadError || localError

  function handleFiles(fileList) {
    const arr = Array.from(fileList)
    if (!arr.length) return

    if (maxSizeMB) {
      const oversized = arr.filter((f) => f.size > maxSizeMB * 1024 * 1024)
      if (oversized.length) {
        setLocalError(
          `${oversized.map((f) => f.name).join(', ')} dépasse${oversized.length > 1 ? 'nt' : ''} ${maxSizeMB} Mo`
        )
        return
      }
    }

    setLocalError(null)
    setFiles(arr)
    onFilesChange?.(arr)

    // Auto preview for single-file uploads
    if (!multiple && arr[0]) {
      const file = arr[0]
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => { setPreviewUrl(e.target.result); setPreviewType('image') }
        reader.readAsDataURL(file)
      } else if (file.type.startsWith('video/')) {
        setPreviewUrl(URL.createObjectURL(file))
        setPreviewType('video')
      } else {
        setPreviewUrl(null)
        setPreviewType(null)
      }
    } else {
      setPreviewUrl(null)
      setPreviewType(null)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  function handleClick(e) {
    if (e.target.closest('button, a') || uploading) return
    inputRef.current?.click()
  }

  // Determine visual state
  const isUploading = uploading
  const isSuccess = uploadSuccess && !isUploading
  const hasPreview = previewUrl && !isUploading && !isSuccess

  return (
    <div
      className={`upload-zone${dragging ? ' dragging' : ''}${files.length ? ' has-files' : ''}${error ? ' has-error' : ''}${isUploading ? ' uploading' : ''}${isSuccess ? ' upload-success' : ''}`}
      style={style}
      onClick={handleClick}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false) }}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
        onClick={(e) => e.stopPropagation()}
      />

      {isUploading ? (
        <>
          <div className="upload-spinner" />
          <div className="upload-title">Upload en cours...</div>
          <div className="upload-hint">Ne ferme pas cette page</div>
        </>
      ) : isSuccess ? (
        <>
          <div className="upload-icon" style={{ color: '#00c850' }}>✓</div>
          <div className="upload-title" style={{ color: '#00c850' }}>Upload réussi</div>
          <div className="upload-hint">Clique pour remplacer</div>
        </>
      ) : hasPreview && previewType === 'image' ? (
        <>
          <img src={previewUrl} alt="Aperçu" className="upload-image-preview" />
          <div className="upload-hint" style={{ marginTop: 8 }}>Clique pour changer</div>
        </>
      ) : hasPreview && previewType === 'video' ? (
        <>
          <video
            src={previewUrl}
            className="upload-video-preview"
            autoPlay muted loop playsInline
          />
          <div className="upload-hint" style={{ marginTop: 8 }}>Clique pour changer</div>
        </>
      ) : files.length > 0 && !isSuccess ? (
        <>
          <div className="upload-icon">✅</div>
          <div className="upload-file-list">
            {files.map((f, i) => (
              <div key={i} className="upload-file-item">
                <span className="upload-file-name">{f.name}</span>
                <span className="upload-file-size">{(f.size / (1024 * 1024)).toFixed(1)} Mo</span>
              </div>
            ))}
          </div>
          <div className="upload-hint" style={{ marginTop: 8 }}>Clique pour changer</div>
        </>
      ) : (
        <>
          <div className="upload-icon">{icon}</div>
          <div className="upload-title">{title}</div>
          <div className="upload-hint">{hint}</div>
        </>
      )}

      {error && <div className="upload-error">{error}</div>}

      {children}
    </div>
  )
}
