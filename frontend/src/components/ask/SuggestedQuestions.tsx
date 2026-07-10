import { motion } from 'framer-motion'

interface Props {
  questions: string[]
  onSelect: (q: string) => void
}

export default function SuggestedQuestions({ questions, onSelect }: Props) {
  if (!questions.length) return null
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {questions.map((q, i) => (
        <motion.button
          key={q}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(q)}
          className="rounded-pill bg-cream px-4 py-2 text-left font-body text-xs font-medium text-dark transition-colors duration-300 hover:bg-lavender"
        >
          {q}
        </motion.button>
      ))}
    </div>
  )
}
