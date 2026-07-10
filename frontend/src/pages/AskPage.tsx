import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import DocumentSelector from '../components/ask/DocumentSelector'
import ChatMessage from '../components/ask/ChatMessage'
import TypingIndicator from '../components/ask/TypingIndicator'
import CitationPanel from '../components/ask/CitationPanel'
import { useDocuments } from '../hooks/useDocuments'
import { useToast } from '../components/shared/Toast'
import { api } from '../services/api'
import type { ChatMsg, Source } from '../types'

const PLACEHOLDERS = [
  'What is the theory of relativity?',
  'Compare photosynthesis and respiration',
  "Explain Newton's third law",
]

let msgId = 1

export default function AskPage() {
  const { documents } = useDocuments()
  const toast = useToast()
  const location = useLocation()
  const preselect = (location.state as { docId?: string } | null)?.docId

  const [selected, setSelected] = useState<Set<string>>(new Set(preselect ? [preselect] : []))
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [activeSource, setActiveSource] = useState<Source | null>(null)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Default: select all docs once loaded (unless a doc was preselected)
  useEffect(() => {
    if (!preselect && documents.length > 0) {
      setSelected((prev) => (prev.size === 0 ? new Set(documents.map((d) => d.id)) : prev))
    }
  }, [documents, preselect])

  useEffect(() => {
    const t = setInterval(() => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const selectAll = () =>
    setSelected((prev) => (prev.size === documents.length ? new Set() : new Set(documents.map((d) => d.id))))

  const send = async (text: string) => {
    const question = text.trim()
    if (!question || thinking) return
    if (selected.size === 0) {
      toast('Select at least one document first', 'error')
      return
    }
    setInput('')
    const userMsg: ChatMsg = { id: `m${msgId++}`, role: 'user', content: question }
    setMessages((prev) => [...prev, userMsg])
    setThinking(true)
    try {
      const history = messages.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))
      const res = await api.ask(question, Array.from(selected), history)
      setMessages((prev) => [
        ...prev,
        {
          id: `m${msgId++}`,
          role: 'ai',
          content: res.answer,
          sources: res.sources,
          suggested_questions: res.suggested_questions,
        },
      ])
    } catch (err) {
      toast((err as Error).message, 'error')
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="flex h-screen">
      <DocumentSelector documents={documents} selected={selected} onToggle={toggle} onSelectAll={selectAll} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-page/80 px-8 py-5 backdrop-blur-md">
          <h1 className="font-heading text-2xl font-semibold text-dark">Ask anything about your docs</h1>
          <span className="rounded-pill bg-lavender px-4 py-1.5 font-body text-xs font-semibold text-dark">
            {selected.size} doc{selected.size === 1 ? '' : 's'} selected
          </span>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {messages.length === 0 && !thinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 flex flex-col items-center text-center"
            >
              <img src="/assets/hero_illustration.svg" alt="" className="max-h-[220px]" />
              <p className="mt-4 font-heading text-lg font-medium text-dark/60">
                Ask a question and I'll answer with citations from your documents.
              </p>
            </motion.div>
          )}
          <div className="flex flex-col gap-5">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                message={m}
                onCitationClick={setActiveSource}
                onSuggestedSelect={send}
              />
            ))}
            <AnimatePresence>{thinking && <TypingIndicator />}</AnimatePresence>
          </div>
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="sticky bottom-0 bg-page/80 px-8 pb-6 pt-2 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-3 rounded-pill border-2 border-lavender/30 bg-white py-2 pl-6 pr-2 transition-all duration-300 focus-within:border-skyblue focus-within:shadow-[0_0_0_4px_rgba(168,222,250,0.2)]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              className="flex-1 bg-transparent font-body text-[15px] text-dark outline-none placeholder:text-dark/35"
            />
            <button
              type="submit"
              disabled={thinking}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-rose text-white transition-transform duration-300 hover:scale-110 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {activeSource && <CitationPanel source={activeSource} onClose={() => setActiveSource(null)} />}
      </AnimatePresence>
    </div>
  )
}
