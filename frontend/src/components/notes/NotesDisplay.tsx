import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MarkdownRenderer from '../shared/MarkdownRenderer'

interface Props {
  markdown: string
  onEdit: (next: string) => void
  onRegenerate: () => void
  onSave: () => void
}

/** Split markdown into accordion sections on `## ` headings. */
function splitSections(md: string): { title: string; body: string }[] {
  const lines = md.split('\n')
  const sections: { title: string; body: string }[] = []
  let current: { title: string; body: string } | null = null
  const preamble: string[] = []
  for (const line of lines) {
    const m = line.match(/^##\s+(.+)/)
    if (m) {
      if (current) sections.push(current)
      current = { title: m[1].trim(), body: '' }
    } else if (current) {
      current.body += line + '\n'
    } else {
      preamble.push(line)
    }
  }
  if (current) sections.push(current)
  if (sections.length === 0) return [{ title: 'Notes', body: md }]
  const pre = preamble.join('\n').trim()
  if (pre) sections.unshift({ title: 'Overview', body: pre })
  return sections
}

export default function NotesDisplay({ markdown, onEdit, onRegenerate, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(markdown)
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set())

  const sections = splitSections(markdown)

  const copy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const toggleSection = (i: number) =>
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Toolbar */}
      <div className="sticky top-4 z-20 mb-4 flex w-fit gap-2 rounded-pill glass p-2 shadow-card">
        <button
          onClick={() => {
            if (editing) onEdit(draft)
            else setDraft(markdown)
            setEditing(!editing)
          }}
          className="rounded-pill bg-skyblue px-4 py-2 font-body text-xs font-semibold text-dark transition-all duration-300 hover:scale-105"
        >
          {editing ? '✓ Done' : '✏️ Edit'}
        </button>
        <button
          onClick={copy}
          className={`rounded-pill px-4 py-2 font-body text-xs font-semibold text-dark transition-all duration-300 hover:scale-105 ${
            copied ? 'bg-mint ring-2 ring-mint' : 'bg-mint'
          }`}
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
        <button
          onClick={onRegenerate}
          className="rounded-pill bg-lavender px-4 py-2 font-body text-xs font-semibold text-dark transition-all duration-300 hover:scale-105"
        >
          🔄 Regenerate
        </button>
        <button
          onClick={onSave}
          className="rounded-pill bg-rose px-4 py-2 font-body text-xs font-semibold text-white transition-all duration-300 hover:scale-105"
        >
          💾 Save
        </button>
      </div>

      <div className="rounded-card bg-white p-8 shadow-card">
        {editing ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[400px] w-full resize-y rounded-2xl border-2 border-lavender/30 bg-page p-4 font-mono text-sm text-dark outline-none focus:border-skyblue"
          />
        ) : (
          <div className="flex flex-col gap-2">
            {sections.map((section, i) => {
              const isCollapsed = collapsed.has(i)
              return (
                <div key={i} className="overflow-hidden">
                  <button
                    onClick={() => toggleSection(i)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border-l-4 border-lavender bg-lavender/5 px-4 py-3 text-left transition-colors duration-300 hover:bg-lavender/15"
                  >
                    <span className="font-heading text-xl font-semibold text-dark">{section.title}</span>
                    <motion.span animate={{ rotate: isCollapsed ? 0 : 180 }} className="text-sm text-dark/40">
                      ▼
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-3">
                          <MarkdownRenderer content={section.body} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}
