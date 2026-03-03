import { useRef, useState, useEffect } from 'react'

const MAX_DURATION = 50 // seconds

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/**
 * VideoRecordField — two-mode field for the presentation video.
 * Mode "upload": file input with 50-second duration validation.
 * Mode "record": live camera via MediaRecorder, auto-stops at MAX_DURATION.
 *
 * @param {Function} [onFileReady]  called with a File when a video is ready
 */
export default function VideoRecordField({ onFileReady }) {
  const [mode, setMode] = useState('upload')
  const [recordState, setRecordState] = useState('idle') // 'idle' | 'recording' | 'done'
  const [elapsed, setElapsed] = useState(0)
  const [recordedUrl, setRecordedUrl] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const [error, setError] = useState(null)

  const liveVideoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const streamRef = useRef(null)
  const inputRef = useRef(null)

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current)
    stopStream()
    if (recordedUrl) URL.revokeObjectURL(recordedUrl)
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl)
  }, []) // eslint-disable-line

  function stopStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }

  async function startRecording() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream
        liveVideoRef.current.play()
      }

      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        setRecordedUrl(url)
        setRecordState('done')
        stopStream()
        onFileReady?.(new File([blob], 'presentation.webm', { type: 'video/webm' }))
      }

      mr.start()
      setRecordState('recording')
      setElapsed(0)

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev >= MAX_DURATION - 1) {
            stopRecording()
            return MAX_DURATION
          }
          return prev + 1
        })
      }, 1000)
    } catch {
      setError("Accès caméra refusé. Autorise l'accès dans les paramètres du navigateur.")
    }
  }

  function stopRecording() {
    clearInterval(timerRef.current)
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  function resetRecording() {
    clearInterval(timerRef.current)
    stopStream()
    if (recordedUrl) URL.revokeObjectURL(recordedUrl)
    setRecordState('idle')
    setRecordedUrl(null)
    setElapsed(0)
    setError(null)
  }

  function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setError(null)

    const objectUrl = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = objectUrl

    video.onloadedmetadata = () => {
      if (video.duration > MAX_DURATION) {
        URL.revokeObjectURL(objectUrl)
        setError(`Vidéo trop longue (${Math.round(video.duration)}s). Maximum ${MAX_DURATION} secondes.`)
        e.target.value = ''
        return
      }
      if (uploadedUrl) URL.revokeObjectURL(uploadedUrl)
      setUploadedFile(file)
      setUploadedUrl(objectUrl)
      onFileReady?.(file)
    }
  }

  function resetUpload() {
    if (uploadedUrl) URL.revokeObjectURL(uploadedUrl)
    setUploadedFile(null)
    setUploadedUrl(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function switchMode(next) {
    if (next === mode) return
    if (mode === 'record') resetRecording()
    if (mode === 'upload') resetUpload()
    setError(null)
    setMode(next)
  }

  const remaining = MAX_DURATION - elapsed

  return (
    <div className="video-record-field">
      {/* Tab bar */}
      <div className="vrf-tabs">
        <button className={`vrf-tab${mode === 'upload' ? ' active' : ''}`} onClick={() => switchMode('upload')}>
          Uploader une vidéo
        </button>
        <button className={`vrf-tab${mode === 'record' ? ' active' : ''}`} onClick={() => switchMode('record')}>
          Enregistrer avec la caméra
        </button>
      </div>

      {/* UPLOAD mode */}
      {mode === 'upload' && (
        <div className="vrf-body">
          {!uploadedFile ? (
            <>
              <div className="upload-icon">🎥</div>
              <div className="upload-title">Face caméra · max {MAX_DURATION} secondes</div>
              <div className="upload-hint">Dis bonjour, montre ta personnalité</div>
              <button className="vrf-browse-btn" onClick={() => inputRef.current?.click()}>
                Choisir un fichier
              </button>
            </>
          ) : (
            <>
              <video src={uploadedUrl} controls className="vrf-preview-video" />
              <button className="vrf-reset-btn" onClick={resetUpload}>Changer de vidéo</button>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
        </div>
      )}

      {/* RECORD mode */}
      {mode === 'record' && (
        <div className="vrf-body">
          {recordState === 'idle' && (
            <>
              <div className="upload-icon">🎥</div>
              <div className="upload-title">Prêt à enregistrer</div>
              <div className="upload-hint">Maximum {MAX_DURATION} secondes · caméra + micro</div>
              <button className="vrf-record-btn" onClick={startRecording}>● Démarrer</button>
            </>
          )}

          {recordState === 'recording' && (
            <>
              <video ref={liveVideoRef} muted playsInline className="vrf-live-video" />
              <div className={`vrf-timer${remaining <= 10 ? ' urgent' : ''}`}>
                {fmt(elapsed)} <span className="vrf-timer-sep">/</span> {fmt(MAX_DURATION)}
              </div>
              <button className="vrf-stop-btn" onClick={stopRecording}>■ Arrêter</button>
            </>
          )}

          {recordState === 'done' && (
            <>
              <video src={recordedUrl} controls className="vrf-preview-video" />
              <button className="vrf-reset-btn" onClick={resetRecording}>Recommencer</button>
            </>
          )}
        </div>
      )}

      {error && <div className="vrf-error">{error}</div>}
    </div>
  )
}
