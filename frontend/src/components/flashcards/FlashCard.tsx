import { motion } from 'framer-motion'
import type { FlashCardData } from '../../types'

interface Props {
  card: FlashCardData
  flipped: boolean
  onFlip: () => void
  index: number
  total: number
  onGotIt: () => void
  onReview: () => void
}

const DIFFICULTY_DOT: Record<string, string> = {
  easy: '#D0F4E0',
  medium: '#FCF5BF',
  hard: '#FF99C8',
}

/**
 * The premium 3D flip card.
 * rotateY 0→180 with overshoot easing, translateZ lift arc,
 * shadow morphs during rotation. Front: cream + grain. Back: mint.
 */
export default function FlashCard({ card, flipped, onFlip, index, total, onGotIt, onReview }: Props) {
  return (
    <div className="perspective-1200 mx-auto h-[320px] w-[480px] max-w-full">
      <motion.div
        className="preserve-3d relative h-full w-full cursor-pointer"
        onClick={onFlip}
        animate={{
          rotateY: flipped ? 180 : 0,
          z: [0, 30, 0],
          boxShadow: [
            '0 8px 30px rgba(232,192,252,0.2)',
            '0 24px 50px rgba(168,222,250,0.35)',
            '0 8px 30px rgba(232,192,252,0.2)',
          ],
        }}
        transition={{
          rotateY: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] },
          z: { duration: 0.6, times: [0, 0.5, 1] },
          boxShadow: { duration: 0.6, times: [0, 0.5, 1] },
        }}
        style={{ borderRadius: 24 }}
      >
        {/* FRONT — cream */}
        <div
          className="backface-hidden grain absolute inset-0 flex flex-col rounded-3xl border-2 border-lavender/30 bg-cream p-8"
          style={{
            backgroundImage: 'url(/assets/flashcard_bg_pattern.svg)',
            backgroundColor: '#FCF5BF',
          }}
        >
          {/* Difficulty dot */}
          <span
            className="absolute right-5 top-5 h-3 w-3 rounded-full ring-2 ring-white"
            style={{ backgroundColor: DIFFICULTY_DOT[card.difficulty] ?? '#FCF5BF' }}
            title={card.difficulty}
          />
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <h3 className="font-heading text-[28px] font-semibold leading-snug text-dark">{card.front}</h3>
            <p className="font-body text-sm text-dark/40">tap to flip</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-medium text-dark/50">
              Card {index + 1} of {total}
            </span>
            <span className="max-w-[200px] truncate rounded-pill bg-white/60 px-3 py-1 font-body text-xs text-dark/50">
              {card.source_doc}
            </span>
          </div>
        </div>

        {/* BACK — mint (pre-rotated 180) */}
        <div
          className="backface-hidden absolute inset-0 flex flex-col rounded-3xl border-2 border-lavender/30 bg-mint p-8"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <p className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-dark/60">Key Points:</p>
          <ol className="flex flex-1 flex-col justify-center gap-2.5 overflow-y-auto">
            {card.back.map((point, i) => (
              <li
                key={i}
                className="border-l-[3px] border-skyblue pl-3 font-body text-base leading-snug text-dark"
              >
                <span className="mr-1.5 font-heading text-sm font-bold text-dark/40">{i + 1}.</span>
                {point}
              </li>
            ))}
          </ol>
          <div className="mt-4 flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onGotIt()
              }}
              className="flex-1 rounded-pill border-2 border-white bg-white/40 py-2.5 font-body text-sm font-semibold text-dark transition-all duration-300 hover:bg-white"
            >
              ✅ Got it
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onReview()
              }}
              className="flex-1 rounded-pill border-2 border-rose bg-transparent py-2.5 font-body text-sm font-semibold text-dark transition-all duration-300 hover:bg-rose hover:text-white"
            >
              🔄 Review again
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
