import { motion } from 'framer-motion'
import type { Source } from '../../types'

interface Props {
  source: Source
  index: number
  onClick: (source: Source) => void
}

export default function CitationPill({ source, index, onClick }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22, delay: index * 0.08 }}
      onClick={() => onClick(source)}
      className="rounded-pill bg-skyblue/20 px-3 py-1.5 font-body text-xs font-semibold text-dark transition-colors duration-300 hover:bg-skyblue/40"
    >
      📄 {source.doc_name} · p.{source.page_number}
    </motion.button>
  )
}
