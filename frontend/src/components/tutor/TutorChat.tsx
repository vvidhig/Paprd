import { motion } from 'framer-motion'
import MarkdownRenderer from '../shared/MarkdownRenderer'
import type { ChatMsg } from '../../types'

export default function TutorChat({ message }: { message: ChatMsg }) {
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
          className="max-w-[70%] rounded-[20px_20px_4px_20px] px-5 py-3.5 font-body text-[15px] text-white shadow-cta"
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
      className="flex items-start gap-3"
    >
      <img
        src="/assets/tutor_avatar.svg"
        alt="Tutor"
        className="h-10 w-10 shrink-0 rounded-full bg-lavender/20 shadow-card"
      />
      <div className="max-w-[75%] rounded-[20px_20px_20px_4px] border border-lavender/30 bg-white px-5 py-4 shadow-card">
        <MarkdownRenderer content={message.content} />
      </div>
    </motion.div>
  )
}
