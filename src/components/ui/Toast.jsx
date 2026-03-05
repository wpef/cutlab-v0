import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

let toastId = 0

function dispatch(type, message) {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { id: ++toastId, type, message } }))
}

export const toast = {
  success: (msg) => dispatch('success', msg),
  error: (msg) => dispatch('error', msg),
}

export default function Toast() {
  const [items, setItems] = useState([])

  const handleToast = useCallback((e) => {
    const item = e.detail
    setItems((prev) => [...prev.slice(-2), item])
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== item.id))
    }, 3000)
  }, [])

  useEffect(() => {
    window.addEventListener('app-toast', handleToast)
    return () => window.removeEventListener('app-toast', handleToast)
  }, [handleToast])

  return (
    <div className="toast-container">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            className={`toast-item toast-item--${item.type}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {item.type === 'success' ? '✓' : '✗'} {item.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
