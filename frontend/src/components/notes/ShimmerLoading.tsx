import { motion } from 'framer-motion'

const WIDTHS = ['92%', '78%', '85%', '64%', '88%']

export default function ShimmerLoading() {
  return (
    <div className="rounded-card bg-white p-8 shadow-card">
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="mb-6 font-heading text-sm font-medium text-dark/60"
      >
        Analyzing your documents...
      </motion.p>
      <div className="flex flex-col gap-4">
        {WIDTHS.map((w, i) => (
          <div key={i} className="skeleton-line h-5" style={{ width: w, animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
    </div>
  )
}
