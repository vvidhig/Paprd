import { motion } from 'framer-motion'

export const QUICK_ACTIONS = [
  { emoji: '', label: "Explain like I'm 5", mode: 'eli5' },
  { emoji: '', label: 'Give me an analogy', mode: 'analogy' },
  { emoji: '', label: 'Test me on this', mode: 'test' },
  { emoji: '', label: 'Summarize this topic', mode: 'summarize' },
  { emoji: '', label: 'Why does this matter?', mode: 'why' },
  { emoji: '', label: 'Connect to other topics', mode: 'connect' },
]

interface Props {
  onAction: (label: string, mode: string) => void
  disabled?: boolean
}

export default function QuickActions({ onAction, disabled }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto px-8 pb-3 pt-1" style={{ scrollbarWidth: 'none' }}>
      {QUICK_ACTIONS.map((action, i) => (
        <motion.button
          key={action.mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ rotate: [0, -3, 3, -2, 0], transition: { duration: 0.3 } }}
          onClick={() => onAction(action.label, action.mode)}
          disabled={disabled}
          className="shrink-0 rounded-pill border-[1.5px] border-lavender/40 bg-white px-4 py-2 font-body text-sm text-dark transition-colors duration-300 hover:bg-lavender disabled:opacity-50"
        >
          {action.emoji} {action.label}
        </motion.button>
      ))}
    </div>
  )
}
