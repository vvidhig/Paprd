import { motion } from 'framer-motion'
import type { ChatMsg, Source } from '../../types'
import MarkdownRenderer from '../shared/MarkdownRenderer'
import CitationPill from './CitationPill'
import SuggestedQuestions from './SuggestedQuestions'

interface Props {
  message: ChatMsg
  onCitationClick: (source: Source) => void
  onSuggestedSelect: (q: string) => void
}

export default function ChatMessage({ message, onCitationClick, onSuggestedSelect }: Props) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="flex justify-end"
      >
        <div
          className="max-w-[70%] rounded-[20px_20px_4px_20px] px-5 py-3.5 font-body text-[15px] leading-relaxed text-white shadow-cta"
          style={{ background: 'linear-gradient(90deg, #FF99C8 0%, #E8C0FC 100%)' }}
        >
          {message.content}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="flex flex-col items-start"
    >
      <div className="max-w-[78%] rounded-[20px_20px_20px_4px] border border-lavender/20 bg-white px-5 py-4 shadow-card">
        <MarkdownRenderer content={message.content} />
        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.sources.map((s, i) => (
              <CitationPill key={`${s.doc_id}-${s.page_number}-${i}`} source={s} index={i} onClick={onCitationClick} />
            ))}
          </div>
        )}
      </div>
      {message.suggested_questions && (
        <SuggestedQuestions questions={message.suggested_questions} onSelect={onSuggestedSelect} />
      )}
    </motion.div>
  )
}
