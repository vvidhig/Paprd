import { useState } from 'react'
import { motion } from 'framer-motion'
import type { QuizQuestion } from '../../types'

interface Props {
  question: QuizQuestion
  index: number
  total: number
  onSubmit: (answer: string) => void
  disabled: boolean
}

export default function QuizCard({ question, index, total, onSubmit, disabled }: Props) {
  const [answer, setAnswer] = useState('')

  return (
    <motion.div
      initial={{ y: -100, opacity: 0, rotate: -2 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="w-full max-w-xl rounded-card p-6 shadow-card"
      style={{ background: 'linear-gradient(120deg, #E8C0FC 0%, #A8DEFA 100%)' }}
    >
      <p className="font-heading text-xs font-bold uppercase tracking-wider text-dark/50">
        Question {index + 1} of {total}
      </p>
      <p className="mt-2 font-heading text-lg font-semibold leading-snug text-dark">{question.question}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (answer.trim()) {
            onSubmit(answer.trim())
            setAnswer('')
          }
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={disabled}
          placeholder="Type your answer..."
          className="flex-1 rounded-pill border-2 border-white/60 bg-white/80 px-4 py-2.5 font-body text-sm text-dark outline-none transition-all duration-300 focus:border-white focus:bg-white"
        />
        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          className="rounded-pill bg-rose px-5 py-2.5 font-body text-sm font-semibold text-white shadow-cta transition-transform duration-300 hover:scale-105 disabled:opacity-50"
        >
          Submit
        </button>
      </form>
    </motion.div>
  )
}
