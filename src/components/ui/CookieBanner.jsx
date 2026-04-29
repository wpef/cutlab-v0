import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'cutlab_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
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
            Nous utilisons des cookies techniques strictement nécessaires au fonctionnement du service.{' '}
            <Link to="/legal/privacy" className="cookie-link">En savoir plus</Link>
          </p>
          <button className="cookie-btn" onClick={accept}>Accepter</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
