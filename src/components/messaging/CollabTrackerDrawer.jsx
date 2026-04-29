import { AnimatePresence, motion } from 'framer-motion'
import CollabTracker from './CollabTracker'

/**
 * CollabTrackerDrawer — mobile bottom drawer that wraps CollabTracker.
 * Triggered by the "Suivi" button in the ChatView header on mobile.
 */
export default function CollabTrackerDrawer({ open, onClose, request, offer, userRole, onRequestUpdated, onAcceptOffer, onRefuseOffer, onAcceptRequest, onRefuseRequest, onCancelOffer, onCloseProject }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="tracker-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            className="tracker-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="tracker-drawer-handle" />
            <div className="tracker-drawer-close-row">
              <button className="tracker-drawer-close" onClick={onClose}>✕ Fermer</button>
            </div>
            <div className="tracker-drawer-body">
              <CollabTracker
                request={request}
                offer={offer}
                userRole={userRole}
                onRequestUpdated={() => { onRequestUpdated?.(); onClose() }}
                onAcceptOffer={onAcceptOffer}
                onRefuseOffer={onRefuseOffer}
                onAcceptRequest={onAcceptRequest}
                onRefuseRequest={onRefuseRequest}
                onCancelOffer={onCancelOffer}
                onCloseProject={onCloseProject}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
