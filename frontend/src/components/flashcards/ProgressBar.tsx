import { motion } from 'framer-motion'
import type { CardStatus, FlashCardData } from '../../types'

interface Props {
  cards: FlashCardData[]
  statuses: Record<string, CardStatus>
  currentIndex: number
}

const STATUS_COLOR: Record<CardStatus, string> = {
  unseen: 'rgba(232,192,252,0.2)',
  'got-it': '#D0F4E0',
  review: '#FF99C8',
}

export default function ProgressBar({ cards, statuses, currentIndex }: Props) {
  return (
    <div className="flex w-full gap-1">
      {cards.map((card, i) => (
        <motion.div
          key={card.id}
          className="h-2 flex-1 rounded-full"
          animate={{
            backgroundColor: i === currentIndex ? '#A8DEFA' : STATUS_COLOR[statuses[card.id] ?? 'unseen'],
            scaleY: i === currentIndex ? 1.4 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}
