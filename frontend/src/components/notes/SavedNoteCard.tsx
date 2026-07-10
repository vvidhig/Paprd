import { motion } from 'framer-motion'
import type { SavedNote } from '../../types'

interface Props {
  note: SavedNote
  onOpen: (note: SavedNote) => void
  onDelete: (id: string) => void
}

export default function SavedNoteCard({ note, onOpen, onDelete }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      onClick={() => onOpen(note)}
      className="group flex cursor-pointer items-center gap-4 rounded-card bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint text-lg">📝</div>
      <div className="min-w-0 flex-1">
        <h4 className="truncate font-heading text-base font-semibold text-dark">{note.title}</h4>
        <p className="mt-0.5 truncate font-body text-xs text-dark/50">
          {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·{' '}
          {note.source_docs.join(', ') || 'All documents'}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(note.id)
        }}
        className="shrink-0 rounded-pill bg-rose px-3 py-1.5 font-body text-xs font-semibold text-white opacity-0 transition-all duration-300 hover:scale-105 group-hover:opacity-100"
      >
        🗑️
      </button>
    </motion.div>
  )
}
