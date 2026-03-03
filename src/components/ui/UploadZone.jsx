import { useRef, useState } from 'react'

/**
 * UploadZone — functional drag-and-drop / click-to-browse upload area.
 *
 * @param {string}   icon             emoji displayed prominently
 * @param {string}   title            primary label
 * @param {string}   hint             secondary muted text
 * @param {string}   [accept]         MIME types / extensions (e.g. "image/*")
 * @param {boolean}  [multiple]       allow multiple file selection
 * @param {Function} [onFilesChange]  called with File[] when selection changes
 * @param {React.ReactNode} [children]
 * @param {React.CSSProperties} [style]
 */
export default function UploadZone({ icon, title, hint, accept, multiple, onFilesChange, children, style }) {
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)

  function handleFiles(fileList) {
    const arr = Array.from(fileList)
    if (!arr.length) return
    setFiles(arr)
    onFilesChange?.(arr)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  function handleClick(e) {
    if (e.target.closest('button, a')) return
    inputRef.current?.click()
  }

  return (
    <div
      className={`upload-zone${dragging ? ' dragging' : ''}${files.length ? ' has-files' : ''}`}
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

      {files.length === 0 ? (
        <>
          <div className="upload-icon">{icon}</div>
          <div className="upload-title">{title}</div>
          <div className="upload-hint">{hint}</div>
        </>
      ) : (
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
      )}

      {children}
    </div>
  )
}
