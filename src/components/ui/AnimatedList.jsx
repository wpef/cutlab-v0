import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
}

export function AnimatedList({ children, className, style }) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({ children, className, style, onClick }) {
  return (
    <motion.div
      className={className}
      style={style}
      onClick={onClick}
      variants={itemVariants}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
    >
      {children}
    </motion.div>
  )
}
