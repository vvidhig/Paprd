import type { DocumentInfo } from '../../types'

interface Props {
  documents: DocumentInfo[]
  selected: Set<string>
  onToggle: (id: string) => void
  onSelectAll: () => void
}

export default function DocumentSelector({ documents, selected, onToggle, onSelectAll }: Props) {
  const allSelected = documents.length > 0 && selected.size === documents.length

  return (
    <div className="m-4 flex w-[280px] shrink-0 flex-col rounded-card bg-white shadow-card">
      <div className="flex items-center justify-between p-5 pb-3">
        <h2 className="font-heading text-lg font-semibold text-dark">Documents</h2>
        <button
          onClick={onSelectAll}
          className={`rounded-pill px-3 py-1 font-body text-xs font-semibold transition-colors duration-300 ${
            allSelected ? 'bg-skyblue text-dark' : 'bg-lavender/20 text-dark/60 hover:bg-lavender/40'
          }`}
        >
          Select All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {documents.length === 0 && (
          <p className="px-2 py-4 font-body text-sm text-dark/40">No documents uploaded yet.</p>
        )}
        {documents.map((doc) => {
          const checked = selected.has(doc.id)
          return (
            <label
              key={doc.id}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-300 ${
                checked ? 'bg-skyblue/15' : 'hover:bg-lavender/10'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300 ${
                  checked ? 'border-skyblue bg-skyblue' : 'border-lavender/50 bg-white'
                }`}
              >
                {checked && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.5L5 9l4.5-6" stroke="#2D2640" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input type="checkbox" checked={checked} onChange={() => onToggle(doc.id)} className="hidden" />
              <span className="text-sm">{doc.file_type === 'pdf' ? '📕' : '📘'}</span>
              <span className="min-w-0 truncate font-body text-sm text-dark">{doc.name}</span>
            </label>
          )
        })}
      </div>

      <div className="border-t border-lavender/20 p-4">
        <p className="font-body text-xs font-medium text-dark/50">
          {selected.size} of {documents.length} selected
        </p>
      </div>
    </div>
  )
}
