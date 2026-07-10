import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { DocumentInfo } from '../../types'

interface Props {
  doc: DocumentInfo
  onDelete: (id: string) => void
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function DocumentCard({ doc, onDelete }: Props) {
  const navigate = useNavigate()
  const isPdf = doc.file_type === 'pdf'

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      className="group rounded-card border border-transparent bg-white p-6 shadow-card transition-shadow duration-300 hover:border-lavender/30 hover:shadow-card-hover"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl font-heading text-xs font-bold ${
          isPdf ? 'bg-rose text-white' : 'bg-skyblue text-dark'
        }`}
      >
        {isPdf ? 'PDF' : 'DOCX'}
      </div>

      <h3 className="mt-4 truncate font-heading text-lg font-semibold text-dark" title={doc.name}>
        {doc.name}
      </h3>
      <p className="mt-1 font-body text-sm text-dark/50">
        {doc.page_count} page{doc.page_count === 1 ? '' : 's'} · {formatSize(doc.size_bytes)} ·{' '}
        {formatDate(doc.uploaded_at)}
      </p>

      <div className="my-4 h-px bg-lavender/20" />

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/ask', { state: { docId: doc.id } })}
          className="rounded-pill bg-skyblue px-3 py-1.5 font-body text-xs font-semibold text-dark transition-all duration-300 hover:scale-105 hover:shadow-card"
        >
          💬 Ask
        </button>
        <button
          onClick={() => navigate('/notes', { state: { docId: doc.id } })}
          className="rounded-pill bg-mint px-3 py-1.5 font-body text-xs font-semibold text-dark transition-all duration-300 hover:scale-105 hover:shadow-card"
        >
          📝 Notes
        </button>
        <button
          onClick={() => navigate('/flashcards', { state: { docId: doc.id } })}
          className="rounded-pill bg-cream px-3 py-1.5 font-body text-xs font-semibold text-dark transition-all duration-300 hover:scale-105 hover:shadow-card"
        >
          🎴 Cards
        </button>
        <button
          onClick={() => onDelete(doc.id)}
          className="ml-auto rounded-pill bg-rose px-3 py-1.5 font-body text-xs font-semibold text-white opacity-0 transition-all duration-300 hover:scale-105 group-hover:opacity-100"
          title="Delete document"
        >
          🗑️
        </button>
      </div>
    </motion.div>
  )
}
