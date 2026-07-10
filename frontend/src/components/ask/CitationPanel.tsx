import { motion } from 'framer-motion'
import type { Source } from '../../types'

interface Props {
  source: Source
  onClose: () => void
}

export default function CitationPanel({ source, onClose }: Props) {
  return (
    <motion.aside
      initial={{ x: 420 }}
      animate={{ x: 0 }}
      exit={{ x: 420 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      className="fixed right-0 top-0 z-50 flex h-screen w-[400px] flex-col border-l-[3px] border-skyblue bg-white shadow-panel"
    >
      <div className="flex items-start justify-between p-6 pb-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-dark">📄 {source.doc_name}</h3>
          <p className="mt-1 font-body text-sm text-dark/50">Page {source.page_number}</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-lavender/20 text-dark transition-all duration-300 hover:scale-110 hover:bg-lavender/40"
        >
          ✕
        </button>
      </div>
      <div className="mx-6 h-px bg-lavender/20" />
      <div className="flex-1 overflow-y-auto p-6">
        <p className="rounded-2xl bg-cream/70 p-4 font-body text-sm leading-relaxed text-dark">
          {source.chunk_text}
        </p>
      </div>
    </motion.aside>
  )
}
