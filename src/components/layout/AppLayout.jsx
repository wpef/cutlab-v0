import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import TopNav from './TopNav'
import BottomNav from './BottomNav'
import Toast from '../ui/Toast'

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

// Pages that fill viewport and manage their own internal scroll
const FILL_PAGES = ['/messaging/', '/editor', '/pipeline']

// Track visual viewport height (keyboard-aware) via CSS custom property
function useViewportHeight() {
  const ref = useRef(null)
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv || !ref.current) return
    function update() {
      ref.current.style.height = `${vv.height}px`
    }
    update()
    vv.addEventListener('resize', update)
    return () => vv.removeEventListener('resize', update)
  }, [])
  return ref
}

export default function AppLayout() {
  const location = useLocation()
  const isFill = FILL_PAGES.some((p) => location.pathname.startsWith(p))
  const layoutRef = useViewportHeight()

  return (
    <div className="app-layout" ref={layoutRef}>
      <TopNav />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className={`app-layout-content${isFill ? ' app-layout-content--fill' : ''}`}
          {...pageTransition}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <BottomNav />
      <Toast />
    </div>
  )
}
