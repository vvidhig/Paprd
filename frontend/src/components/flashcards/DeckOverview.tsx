import { motion } from 'framer-motion'
import type { CardStatus, FlashCardData } from '../../types'

interface Props {
  cards: FlashCardData[]
  statuses: Record<string, CardStatus>
  onSelect: (index: number) => void
}

const DIFF_TINT: Record<string, string> = {
  easy: 'rgba(208,244,224,0.6)',
  medium: 'rgba(252,245,191,0.7)',
  hard: 'rgba(255,153,200,0.45)',
}

export default function DeckOverview({ cards, statuses, onSelect }: Props) {
  return (
    <motion.div
      className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.03 } } }}
    >
      {cards.map((card, i) => (
        <motion.button
          key={card.id}
          variants={{
            hidden: { opacity: 0, rotateY: 90 },
            show: { opacity: 1, rotateY: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
          }}
          whileHover={{ scale: 1.1, zIndex: 5 }}
          onClick={() => onSelect(i)}
          className="relative h-[70px] w-full overflow-hidden rounded-xl border border-lavender/30 p-2 text-left shadow-card"
          style={{ backgroundColor: DIFF_TINT[card.difficulty] ?? DIFF_TINT.medium }}
          title={card.front}
        >
          <span className="line-clamp-3 font-body text-[10px] font-medium leading-tight text-dark">
            {card.front}
          </span>
          {statuses[card.id] === 'got-it' && (
            <span className="absolute bottom-1 right-1.5 text-[10px]">✅</span>
          )}
          {statuses[card.id] === 'review' && (
            <span className="absolute bottom-1 right-1.5 text-[10px]">🔄</span>
          )}
        </motion.button>
      ))}
    </motion.div>
  )
}
