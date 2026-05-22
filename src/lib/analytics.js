// Google Analytics 4 — chargement conditionné au consentement RGPD.
// Aucun script tiers n'est injecté tant que getConsent() !== 'granted'.

const MEASUREMENT_ID = 'G-QXWB0VNXDK'
const STORAGE_KEY = 'cutlab_consent'

let scriptLoaded = false

function gtag() {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(arguments)
}

function injectScript() {
  if (scriptLoaded || typeof document === 'undefined') return
  scriptLoaded = true
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(s)
  window.dataLayer = window.dataLayer || []
  // eslint-disable-next-line no-inner-declarations
  function gt() { window.dataLayer.push(arguments) }
  window.gtag = window.gtag || gt
  window.gtag('js', new Date())
  // anonymize_ip + désactivation pubs Google = configuration RGPD friendly
  window.gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    send_page_view: false, // on gère manuellement via trackPageView
  })
}

export function getConsent() {
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}

export function setConsent(value) {
  // value: 'granted' | 'denied'
  try { localStorage.setItem(STORAGE_KEY, value) } catch {}
  if (value === 'granted') injectScript()
}

export function clearConsent() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

export function initFromStorage() {
  if (getConsent() === 'granted') injectScript()
}

export function trackPageView(path, title) {
  if (getConsent() !== 'granted' || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  })
}

export function trackEvent(name, params = {}) {
  if (getConsent() !== 'granted' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
