import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import MultiDocSelect from '../components/shared/MultiDocSelect'
import FlashCardDeck from '../components/flashcards/FlashCardDeck'
import SavedDeckCard from '../components/flashcards/SavedDeckCard'
import { useDocuments } from '../hooks/useDocuments'
import { useSavedDecks } from '../hooks/useFlashcards'
import { useToast } from '../components/shared/Toast'
import { api } from '../services/api'
import type { CardStatus, FlashCardData, SavedDeck } from '../types'

const COUNTS = [10, 15, 20]

export default function FlashcardsPage() {
  const { documents } = useDocuments()
  const { decks, saveDeck, updateProgress, removeDeck } = useSavedDecks()
  const toast = useToast()
  const location = useLocation()
  const navState = location.state as { docId?: string; topic?: string } | null
  const preselect = navState?.docId

  const [selected, setSelected] = useState<Set<string>>(new Set(preselect ? [preselect] : []))
  const [topic, setTopic] = useState(navState?.topic ?? '')
  const [count, setCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<FlashCardData[]>([])
  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({})
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null)

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const generate = async (append = false) => {
    if (selected.size === 0) {
      toast('Select at least one document', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await api.generateFlashcards(Array.from(selected), topic || null, count)
      const fresh = res.cards.map((c, i) => ({ ...c, id: append ? `a${Date.now()}-${i}` : `c${i}-${c.id}` }))
      if (append) {
        setCards((prev) => [...prev, ...fresh])
        toast(`Added ${fresh.length} more cards`, 'success')
      } else {
        setCards(fresh)
        setStatuses({})
        setActiveDeckId(null)
      }
    } catch (err) {
      toast((err as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (next: Record<string, CardStatus>) => {
    setStatuses(next)
    if (activeDeckId) updateProgress(activeDeckId, next)
    const mastered = Object.values(next).filter((s) => s === 'got-it').length
    if (cards.length > 0 && mastered === cards.length) {
      toast('🎉 Deck mastered! Amazing work!', 'success')
    }
  }

  const handleSaveDeck = () => {
    if (!cards.length) return
    const name = topic || `Deck · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    const deck = saveDeck(name, cards, statuses)
    setActiveDeckId(deck.id)
    toast('Deck saved!', 'success')
  }

  const resumeDeck = (deck: SavedDeck) => {
    setCards(deck.cards)
    setStatuses(deck.progress)
    setActiveDeckId(deck.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="font-heading text-[32px] font-bold text-dark">Generate Flashcards</h1>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <MultiDocSelect documents={documents} selected={selected} onToggle={toggle} />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic (optional)"
          className="min-w-[200px] flex-1 rounded-2xl border-2 border-lavender/40 bg-page px-4 py-2.5 font-body text-sm text-dark outline-none transition-all duration-300 placeholder:text-dark/35 hover:border-lavender focus:border-skyblue focus:shadow-focus"
        />
        <div className="flex gap-1.5">
          {COUNTS.map((c) => (
            <button
              key={c}
              onClick={() => setCount(c)}
              className={`rounded-pill px-4 py-2 font-body text-sm font-semibold transition-all duration-300 ${
                count === c ? 'bg-rose text-white shadow-cta' : 'bg-lavender/25 text-dark hover:bg-lavender/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => generate(false)}
          disabled={loading}
          className="rounded-pill px-6 py-3 font-heading text-sm font-semibold text-white shadow-cta transition-shadow duration-300 hover:shadow-card-hover disabled:opacity-60"
          style={{ background: 'linear-gradient(90deg, #FF99C8 0%, #E8C0FC 100%)' }}
        >
          {loading ? '✨ Generating...' : '✨ Generate Flashcards'}
        </motion.button>
      </div>

      {/* Deck */}
      <div className="mt-10">
        {loading && cards.length === 0 && (
          <div className="perspective-1200 mx-auto h-[320px] w-[480px] max-w-full">
            <div className="skeleton-line h-full w-full !rounded-3xl" />
          </div>
        )}
        {!loading && cards.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-8 text-center"
          >
            <img src="/assets/hero_illustration.svg" alt="" className="max-h-[200px] opacity-80" />
            <p className="mt-4 font-body text-dark/50">
              Pick your documents and generate a deck to start studying.
            </p>
          </motion.div>
        )}
        {cards.length > 0 && (
          <>
            <FlashCardDeck
              cards={cards}
              statuses={statuses}
              onStatusChange={handleStatusChange}
              onMoreCards={() => generate(true)}
              onReorder={setCards}
            />
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSaveDeck}
                className="rounded-pill bg-mint px-6 py-2.5 font-body text-sm font-semibold text-dark transition-all duration-300 hover:scale-105 hover:shadow-card"
              >
                💾 Save deck
              </button>
            </div>
          </>
        )}
      </div>

      {/* Saved decks */}
      {decks.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-dark">Saved Decks</h2>
          <div className="flex gap-4 overflow-x-auto pb-3">
            <AnimatePresence>
              {decks.map((d) => (
                <SavedDeckCard key={d.id} deck={d} onResume={resumeDeck} onDelete={removeDeck} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
