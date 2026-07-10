import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DocumentInfo } from '../../types'

interface Props {
  documents: DocumentInfo[]
  selected: Set<string>
  onToggle: (id: string) => void
}

export default function MultiDocSelect({ documents, selected, onToggle }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const selectedDocs = documents.filter((d) => selected.has(d.id))

  return (
    <div ref={ref} className="relative min-w-[260px]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full flex-wrap items-center gap-1.5 rounded-2xl border-2 border-lavender/40 bg-page px-4 py-2.5 text-left transition-all duration-300 hover:border-lavender focus:shadow-focus"
      >
        {selectedDocs.length === 0 ? (
          <span className="font-body text-sm text-dark/40">Select documents...</span>
        ) : (
          selectedDocs.map((d) => (
            <span
              key={d.id}
              className="max-w-[140px] truncate rounded-pill bg-lavender/40 px-2.5 py-0.5 font-body text-xs font-medium text-dark"
            >
              {d.name}
            </span>
          ))
        )}
        <span className="ml-auto text-xs text-dark/40">{open ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass absolute left-0 top-full z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl p-2 shadow-panel"
          >
            {documents.length === 0 && (
              <p className="px-3 py-2 font-body text-sm text-dark/40">No documents uploaded.</p>
            )}
            {documents.map((doc) => {
              const checked = selected.has(doc.id)
              return (
                <button
                  key={doc.id}
                  onClick={() => onToggle(doc.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors duration-200 ${
                    checked ? 'bg-skyblue/25' : 'hover:bg-lavender/15'
                  }`}
                >
                  <span
                    className={`flex h-4.5 w-4.5 h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                      checked ? 'border-skyblue bg-skyblue' : 'border-lavender/50 bg-white'
                    }`}
                  >
                    {checked && (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6.5L5 9l4.5-6" stroke="#2D2640" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="min-w-0 truncate font-body text-sm text-dark">{doc.name}</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
