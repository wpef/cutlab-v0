import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getConsent, setConsent } from '../../lib/analytics'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!getConsent()) setVisible(true)
    const onChange = () => setVisible(!getConsent())
    window.addEventListener('cutlab-consent-reset', onChange)
    return () => window.removeEventListener('cutlab-consent-reset', onChange)
  }, [])

  function accept() {
    setConsent('granted')
    setVisible(false)
  }

  function refuse() {
    setConsent('denied')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cookie-banner"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <p>
            Nous utilisons des cookies de mesure d'audience (Google Analytics) pour comprendre comment vous utilisez le service et l'améliorer.
            Aucune donnée n'est partagée à des fins publicitaires.{' '}
            <Link to="/legal/privacy" className="cookie-link">En savoir plus</Link>
          </p>
          <div className="cookie-actions">
            <button className="cookie-btn cookie-btn--ghost" onClick={refuse}>Refuser</button>
            <button className="cookie-btn" onClick={accept}>Accepter</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
