interface Props {
  onPrev: () => void
  onFlip: () => void
  onNext: () => void
  onShuffle: () => void
  onOverview: () => void
  onMore: () => void
  overviewOpen: boolean
}

export default function CardControls({ onPrev, onFlip, onNext, onShuffle, onOverview, onMore, overviewOpen }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="rounded-pill bg-skyblue px-6 py-2.5 font-body text-sm font-semibold text-dark transition-transform duration-300 hover:scale-105"
        >
          ← Prev
        </button>
        <button
          onClick={onFlip}
          className="rounded-pill bg-skyblue px-6 py-2.5 font-body text-sm font-semibold text-dark transition-transform duration-300 hover:scale-105"
        >
          Flip ↻
        </button>
        <button
          onClick={onNext}
          className="rounded-pill bg-skyblue px-6 py-2.5 font-body text-sm font-semibold text-dark transition-transform duration-300 hover:scale-105"
        >
          Next →
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onShuffle}
          className="rounded-pill bg-lavender px-4 py-1.5 font-body text-xs font-semibold text-dark transition-transform duration-300 hover:scale-105"
        >
          🔀 Shuffle
        </button>
        <button
          onClick={onOverview}
          className={`rounded-pill px-4 py-1.5 font-body text-xs font-semibold text-dark transition-all duration-300 hover:scale-105 ${
            overviewOpen ? 'bg-dark text-white' : 'bg-lavender'
          }`}
        >
          📊 {overviewOpen ? 'Single view' : 'Overview'}
        </button>
        <button
          onClick={onMore}
          className="rounded-pill bg-lavender px-4 py-1.5 font-body text-xs font-semibold text-dark transition-transform duration-300 hover:scale-105"
        >
          ➕ More cards
        </button>
      </div>
      <p className="font-body text-[11px] text-dark/35">
        Space = flip · ← prev · → next · 1 = Got it · 2 = Review again
      </p>
    </div>
  )
}
