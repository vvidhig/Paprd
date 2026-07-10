import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FlashCard from './FlashCard'
import CardControls from './CardControls'
import ProgressBar from './ProgressBar'
import DeckOverview from './DeckOverview'
import type { CardStatus, FlashCardData } from '../../types'

interface Props {
  cards: FlashCardData[]
  statuses: Record<string, CardStatus>
  onStatusChange: (statuses: Record<string, CardStatus>) => void
  onMoreCards: () => void
  onReorder: (cards: FlashCardData[]) => void
}

type ExitMode = 'next' | 'prev' | 'gotit'

const GHOST_COLORS = ['#FCF5BF', '#D0F4E0', '#E8C0FC', '#A8DEFA', '#FF99C8']

export default function FlashCardDeck({ cards, statuses, onStatusChange, onMoreCards, onReorder }: Props) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [overview, setOverview] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [scattering, setScattering] = useState(false)
  const exitMode = useRef<ExitMode>('next')

  const card = cards[Math.min(index, cards.length - 1)]

  const scatterOffsets = useMemo(
    () =>
      GHOST_COLORS.map(() => ({
        x: Math.random() * 100 - 50,
        y: Math.random() * 60 - 30,
        rotate: Math.random() * 30 - 15,
      })),
    // regenerate offsets each scatter
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scattering],
  )

  const goNext = useCallback(() => {
    exitMode.current = 'next'
    setFlipped(false)
    setIndex((i) => (i + 1) % cards.length)
  }, [cards.length])

  const goPrev = useCallback(() => {
    exitMode.current = 'prev'
    setFlipped(false)
    setIndex((i) => (i - 1 + cards.length) % cards.length)
  }, [cards.length])

  const gotIt = useCallback(() => {
    if (!card) return
    onStatusChange({ ...statuses, [card.id]: 'got-it' })
    exitMode.current = 'gotit'
    setFlipped(false)
    setIndex((i) => (i + 1) % cards.length)
  }, [card, cards.length, onStatusChange, statuses])

  const reviewAgain = useCallback(() => {
    if (!card) return
    onStatusChange({ ...statuses, [card.id]: 'review' })
    setShaking(true)
  }, [card, onStatusChange, statuses])

  const shuffle = useCallback(() => {
    setScattering(true)
    setFlipped(false)
    setTimeout(() => {
      const next = [...cards]
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[next[i], next[j]] = [next[j], next[i]]
      }
      onReorder(next)
      setIndex(0)
      setScattering(false)
    }, 800)
  }, [cards, onReorder])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA')
        return
      if (e.code === 'Space') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
      else if (e.key === '1') gotIt()
      else if (e.key === '2') reviewAgain()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev, gotIt, reviewAgain])

  if (!card) return null

  const variants = {
    enter: (mode: ExitMode) => ({
      x: mode === 'prev' ? -420 : 420,
      y: 40,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 26 },
    },
    exit: (mode: ExitMode) =>
      mode === 'gotit'
        ? {
            y: -200,
            opacity: 0,
            scale: 0.8,
            filter: 'drop-shadow(0 0 30px rgba(208,244,224,0.9))',
            transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const },
          }
        : {
            x: mode === 'prev' ? 420 : -420,
            opacity: 0,
            transition: { duration: 0.3 },
          },
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {overview ? (
        <div className="w-full max-w-3xl">
          <DeckOverview
            cards={cards}
            statuses={statuses}
            onSelect={(i) => {
              setIndex(i)
              setFlipped(false)
              setOverview(false)
            }}
          />
        </div>
      ) : (
        <div className="relative flex h-[340px] w-full items-center justify-center">
          {/* Scatter ghosts during shuffle */}
          <AnimatePresence>
            {scattering &&
              GHOST_COLORS.map((color, i) => (
                <motion.div
                  key={`ghost-${i}`}
                  className="absolute h-[320px] w-[480px] max-w-full rounded-3xl border-2 border-white/60 shadow-card"
                  style={{ backgroundColor: color, zIndex: 5 - i }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
                  animate={{
                    x: [0, scatterOffsets[i].x * 4, 0],
                    y: [0, scatterOffsets[i].y * 4, 0],
                    rotate: [0, scatterOffsets[i].rotate, 0],
                    opacity: [0, 0.9, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, times: [0, 0.5, 1], type: 'tween', ease: 'easeInOut' }}
                />
              ))}
          </AnimatePresence>

          {!scattering && (
            <AnimatePresence mode="wait" custom={exitMode.current}>
              <motion.div
                key={card.id}
                custom={exitMode.current}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                {/* Shake wrapper for "review again" */}
                <motion.div
                  animate={
                    shaking
                      ? {
                          x: [0, -10, 10, -5, 5, 0],
                          filter: [
                            'drop-shadow(0 0 0px rgba(255,153,200,0))',
                            'drop-shadow(0 0 24px rgba(255,153,200,0.8))',
                            'drop-shadow(0 0 0px rgba(255,153,200,0))',
                          ],
                        }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.4 }}
                  onAnimationComplete={() => setShaking(false)}
                >
                  <FlashCard
                    card={card}
                    flipped={flipped}
                    onFlip={() => setFlipped((f) => !f)}
                    index={index}
                    total={cards.length}
                    onGotIt={gotIt}
                    onReview={reviewAgain}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      <CardControls
        onPrev={goPrev}
        onFlip={() => setFlipped((f) => !f)}
        onNext={goNext}
        onShuffle={shuffle}
        onOverview={() => setOverview((o) => !o)}
        onMore={onMoreCards}
        overviewOpen={overview}
      />

      <div className="w-full max-w-2xl">
        <ProgressBar cards={cards} statuses={statuses} currentIndex={index} />
      </div>
    </div>
  )
}
