import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TutorChat from '../components/tutor/TutorChat'
import QuickActions from '../components/tutor/QuickActions'
import QuizCard from '../components/tutor/QuizCard'
import ScoreCard from '../components/tutor/ScoreCard'
import TypingIndicator from '../components/ask/TypingIndicator'
import MultiDocSelect from '../components/shared/MultiDocSelect'
import { useDocuments } from '../hooks/useDocuments'
import { useToast } from '../components/shared/Toast'
import { api } from '../services/api'
import type { ChatMsg, QuizQuestion, QuizResult } from '../types'

let tmsgId = 1

interface QuizState {
  questions: QuizQuestion[]
  current: number
  results: QuizResult[]
  done: boolean
}

export default function TutorPage() {
  const { documents } = useDocuments()
  const toast = useToast()

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 't0',
      role: 'ai',
      content:
        "Hi, I'm your study tutor! 🦉 Pick your documents above, then ask me anything — or use the quick actions to get started. I love a good analogy.",
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [quiz, setQuiz] = useState<QuizState | null>(null)
  const [evaluating, setEvaluating] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (documents.length > 0) {
      setSelected((prev) => (prev.size === 0 ? new Set(documents.map((d) => d.id)) : prev))
    }
  }, [documents])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking, quiz])

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const send = async (text: string, mode?: string) => {
    const message = text.trim()
    if (!message || thinking) return
    if (selected.size === 0) {
      toast('Select at least one document first', 'error')
      return
    }
    setInput('')
    setMessages((prev) => [...prev, { id: `t${tmsgId++}`, role: 'user', content: message }])
    setThinking(true)
    try {
      const history = messages.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))
      const res = await api.tutorChat(message, Array.from(selected), history, mode)
      setMessages((prev) => [...prev, { id: `t${tmsgId++}`, role: 'ai', content: res.response }])
      if (res.quiz_data?.questions?.length) {
        setQuiz({ questions: res.quiz_data.questions, current: 0, results: [], done: false })
      }
    } catch (err) {
      toast((err as Error).message, 'error')
    } finally {
      setThinking(false)
    }
  }

  const submitAnswer = async (answer: string) => {
    if (!quiz) return
    const q = quiz.questions[quiz.current]
    setEvaluating(true)
    try {
      const result = await api.tutorEvaluate(q.question, answer, q.context)
      const results = [...quiz.results, result]
      const nextIdx = quiz.current + 1
      setQuiz({
        questions: quiz.questions,
        current: nextIdx,
        results,
        done: nextIdx >= quiz.questions.length,
      })
    } catch (err) {
      toast((err as Error).message, 'error')
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 pb-2 pt-6">
        <div className="flex items-center gap-4">
          <motion.img
            src="/assets/tutor_avatar.svg"
            alt="AI Tutor"
            className="h-14 w-14 rounded-full shadow-card"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div>
            <h1 className="font-heading text-2xl font-bold text-dark">AI Tutor</h1>
            <p className="font-body text-sm text-dark/50">Your patient study companion</p>
          </div>
        </div>
        <MultiDocSelect documents={documents} selected={selected} onToggle={toggle} />
      </div>

      {/* Quick actions */}
      <QuickActions onAction={(label, mode) => send(label, mode)} disabled={thinking} />

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {messages.map((m) => (
            <TutorChat key={m.id} message={m} />
          ))}
          <AnimatePresence>{thinking && <TypingIndicator />}</AnimatePresence>

          {quiz && !quiz.done && quiz.current < quiz.questions.length && (
            <div className="flex justify-center">
              <QuizCard
                key={quiz.current}
                question={quiz.questions[quiz.current]}
                index={quiz.current}
                total={quiz.questions.length}
                onSubmit={submitAnswer}
                disabled={evaluating}
              />
            </div>
          )}
          {quiz?.done && (
            <div className="flex justify-center">
              <ScoreCard results={quiz.results} />
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-page/80 px-8 pb-6 pt-2 backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="mx-auto flex max-w-3xl items-center gap-3 rounded-pill border-2 border-lavender/30 bg-white py-2 pl-6 pr-2 transition-all duration-300 focus-within:border-skyblue focus-within:shadow-[0_0_0_4px_rgba(168,222,250,0.2)]"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your tutor anything..."
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
        <p className="mx-auto mt-1.5 max-w-3xl px-4 font-body text-[11px] text-dark/35">
          Try: "Explain quantum mechanics using everyday objects"
        </p>
      </div>
    </div>
  )
}
