import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import TopNav from './TopNav'
import BottomNav from './BottomNav'

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

export default function AppLayout() {
  const location = useLocation()

  return (
    <div className="app-layout">
      <TopNav />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="app-layout-content"
          {...pageTransition}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <BottomNav />
    </div>
  )
}
