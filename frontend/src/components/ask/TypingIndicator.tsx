import { motion } from 'framer-motion'

const DOT_COLORS = ['#E8C0FC', '#A8DEFA', '#FF99C8']

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex w-fit items-center gap-1.5 rounded-[20px_20px_20px_4px] border border-lavender/20 bg-white px-5 py-4 shadow-card"
    >
      {DOT_COLORS.map((color, i) => (
        <motion.span
          key={i}
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  )
}
