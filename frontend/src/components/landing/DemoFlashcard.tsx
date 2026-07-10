import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/** Miniature auto-flipping flashcard for the landing hero. */
export default function DemoFlashcard() {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setFlipped((f) => !f), 3200)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="perspective-1200 h-[190px] w-[290px]">
      <motion.div
        className="preserve-3d relative h-full w-full cursor-pointer"
        onClick={() => setFlipped((f) => !f)}
        animate={{ rotateY: flipped ? 180 : 0, z: [0, 24, 0] }}
        transition={{
          rotateY: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] },
          z: { duration: 0.6, times: [0, 0.5, 1] },
        }}
        style={{ borderRadius: 20 }}
      >
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-[20px] border-2 border-lavender/40 bg-cream p-5 shadow-card-hover">
          <span className="absolute right-3.5 top-3.5 h-2.5 w-2.5 rounded-full bg-rose ring-2 ring-white" />
          <p className="text-center font-heading text-lg font-semibold text-dark">
            What is spaced repetition?
          </p>
          <p className="font-body text-[11px] text-dark/40">tap to flip</p>
        </div>
        <div
          className="backface-hidden absolute inset-0 flex flex-col justify-center gap-1.5 rounded-[20px] border-2 border-lavender/40 bg-mint p-5 shadow-card-hover"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <p className="font-heading text-[10px] font-bold uppercase tracking-wide text-dark/50">
            Key Points:
          </p>
          <p className="border-l-[3px] border-skyblue pl-2.5 font-body text-xs leading-snug text-dark">
            Reviewing material at increasing intervals
          </p>
          <p className="border-l-[3px] border-skyblue pl-2.5 font-body text-xs leading-snug text-dark">
            Moves knowledge into long-term memory
          </p>
          <p className="border-l-[3px] border-skyblue pl-2.5 font-body text-xs leading-snug text-dark">
            Exactly what Paprd's decks do for you
          </p>
        </div>
      </motion.div>
    </div>
  )
}
