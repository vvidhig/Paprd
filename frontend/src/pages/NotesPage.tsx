import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import MultiDocSelect from '../components/shared/MultiDocSelect'
import ShimmerLoading from '../components/notes/ShimmerLoading'
import NotesDisplay from '../components/notes/NotesDisplay'
import SavedNoteCard from '../components/notes/SavedNoteCard'
import { useDocuments } from '../hooks/useDocuments'
import { useSavedNotes } from '../hooks/useNotes'
import { useToast } from '../components/shared/Toast'
import { api } from '../services/api'
import type { SavedNote } from '../types'

export default function NotesPage() {
  const { documents } = useDocuments()
  const { notes, save, remove } = useSavedNotes()
  const toast = useToast()
  const location = useLocation()
  const preselect = (location.state as { docId?: string } | null)?.docId

  const [selected, setSelected] = useState<Set<string>>(new Set(preselect ? [preselect] : []))
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [markdown, setMarkdown] = useState<string | null>(null)

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const generate = async () => {
    if (selected.size === 0) {
      toast('Select at least one document', 'error')
      return
    }
    setLoading(true)
    setMarkdown(null)
    try {
      const res = await api.generateNotes(Array.from(selected), topic || undefined)
      setMarkdown(res.notes_markdown)
    } catch (err) {
      toast((err as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!markdown) return
    const sourceNames = documents.filter((d) => selected.has(d.id)).map((d) => d.name)
    const firstHeading = markdown.match(/^##?\s+(.+)/m)?.[1]
    save({
      title: topic || firstHeading || 'Study Notes',
      markdown,
      source_docs: sourceNames,
    })
    toast('Notes saved!', 'success')
  }

  const openNote = (note: SavedNote) => {
    setMarkdown(note.markdown)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="font-heading text-[32px] font-bold text-dark">Generate Study Notes</h1>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <MultiDocSelect documents={documents} selected={selected} onToggle={toggle} />
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Focus on a specific topic (optional)"
          className="min-w-[260px] flex-1 rounded-2xl border-2 border-lavender/40 bg-page px-4 py-2.5 font-body text-sm text-dark outline-none transition-all duration-300 placeholder:text-dark/35 hover:border-lavender focus:border-skyblue focus:shadow-focus"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generate}
          disabled={loading}
          className="rounded-pill px-6 py-3 font-heading text-sm font-semibold text-white shadow-cta transition-shadow duration-300 hover:shadow-card-hover disabled:opacity-60"
          style={{ background: 'linear-gradient(90deg, #FF99C8 0%, #E8C0FC 100%)' }}
        >
          ✨ Generate Notes
        </motion.button>
      </div>

      {/* Loading / notes */}
      <div className="mt-8">
        {loading && <ShimmerLoading />}
        {!loading && markdown && (
          <NotesDisplay
            markdown={markdown}
            onEdit={setMarkdown}
            onRegenerate={generate}
            onSave={handleSave}
          />
        )}
      </div>

      {/* Saved notes */}
      {notes.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-heading text-2xl font-semibold text-dark">Saved Notes</h2>
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {notes.map((n) => (
                <SavedNoteCard key={n.id} note={n} onOpen={openNote} onDelete={remove} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
