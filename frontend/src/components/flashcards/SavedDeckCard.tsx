import { motion } from 'framer-motion'
import type { SavedDeck } from '../../types'

interface Props {
  deck: SavedDeck
  onResume: (deck: SavedDeck) => void
  onDelete: (id: string) => void
}

export default function SavedDeckCard({ deck, onResume, onDelete }: Props) {
  const mastered = Object.values(deck.progress).filter((s) => s === 'got-it').length
  const pct = deck.cards.length ? (mastered / deck.cards.length) * 100 : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      onClick={() => onResume(deck)}
      className="group w-[260px] shrink-0 cursor-pointer rounded-card bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl">🎴</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(deck.id)
          }}
          className="rounded-pill bg-rose px-2.5 py-1 font-body text-[10px] font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          🗑️
        </button>
      </div>
      <h4 className="mt-2 truncate font-heading text-base font-semibold text-dark">{deck.name}</h4>
      <p className="mt-0.5 font-body text-xs text-dark/50">
        {deck.cards.length} cards ·{' '}
        {new Date(deck.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
      <p className="mt-3 font-body text-xs font-semibold text-dark/70">
        {mastered}/{deck.cards.length} mastered
      </p>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-lavender/20">
        <motion.div
          className="h-full rounded-full bg-mint"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </motion.div>
  )
}
