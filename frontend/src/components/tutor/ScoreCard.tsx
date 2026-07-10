import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { QuizResult } from '../../types'

interface Props {
  results: QuizResult[]
}

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // ease-out cubic
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

export default function ScoreCard({ results }: Props) {
  const navigate = useNavigate()
  const pct = results.length
    ? Math.round((results.reduce((sum, r) => sum + r.score, 0) / results.length) * 100)
    : 0
  const display = useCountUp(pct)
  const stars = Math.max(1, Math.round((pct / 100) * 5))
  const weakTopics = results.filter((r) => r.score < 0.6).map((r) => r.topic)

  const scoreColor = pct >= 80 ? '#D0F4E0' : pct >= 60 ? '#FCF5BF' : '#FF99C8'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-panel"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl font-bold text-dark">📊 Quiz Results</h3>
        <img src="/assets/success_celebration.svg" alt="" className="h-12" />
      </div>

      <div className="mt-4 flex items-center gap-5">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-3xl font-heading text-3xl font-extrabold text-dark"
          style={{ backgroundColor: scoreColor }}
        >
          {display}%
        </div>
        <div className="flex gap-1 text-2xl">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 400, damping: 15 }}
              style={{ opacity: i < stars ? 1 : 0.25 }}
            >
              ⭐
            </motion.span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {results.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`flex items-start gap-2.5 rounded-2xl px-4 py-2.5 ${
              r.score >= 0.6 ? 'bg-mint/50' : 'bg-rose/20'
            }`}
          >
            <span className="mt-0.5 text-sm">{r.score >= 0.6 ? '✅' : '❌'}</span>
            <div className="min-w-0">
              <p className="font-body text-sm font-medium text-dark">{r.question}</p>
              <p className="mt-0.5 font-body text-xs text-dark/60">{r.feedback}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {weakTopics.length > 0 && (
        <div className="mt-5">
          <p className="font-heading text-sm font-semibold text-dark">Topics to review:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {weakTopics.map((t) => (
              <span key={t} className="rounded-pill bg-cream px-3 py-1 font-body text-xs font-medium text-dark">
                {t}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate('/flashcards', { state: { topic: weakTopics.join(', ') } })}
            className="mt-4 w-full rounded-pill py-3 font-heading text-sm font-semibold text-white shadow-cta transition-transform duration-300 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(90deg, #FF99C8 0%, #E8C0FC 100%)' }}
          >
            🎴 Make flashcards for weak topics
          </button>
        </div>
      )}
    </motion.div>
  )
}
