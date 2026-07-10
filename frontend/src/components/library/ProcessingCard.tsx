import { motion } from 'framer-motion'
import type { ProcessingFile } from '../../types'

const STEP_LABELS: Record<string, string> = {
  parsing: 'Parsing...',
  chunking: 'Chunking...',
  embedding: 'Embedding...',
  ready: '✓ Ready',
  error: '✕ Failed',
}

const STEP_PROGRESS: Record<string, string> = {
  parsing: '30%',
  chunking: '60%',
  embedding: '85%',
  ready: '100%',
  error: '100%',
}

export default function ProcessingCard({ file }: { file: ProcessingFile }) {
  const done = file.step === 'ready'
  const failed = file.step === 'error'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`mx-auto flex w-full max-w-[600px] items-center gap-4 rounded-card border-2 bg-white p-4 shadow-card transition-colors duration-500 ${
        done ? 'border-mint' : failed ? 'border-rose' : 'border-transparent'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-heading text-[10px] font-bold ${
          file.name.toLowerCase().endsWith('.pdf') ? 'bg-rose text-white' : 'bg-skyblue text-dark'
        }`}
      >
        {file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-medium text-dark">{file.name}</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-lavender/20">
          <motion.div
            className={failed ? 'h-full rounded-full bg-rose' : done ? 'h-full rounded-full bg-mint' : 'shimmer-bar h-full rounded-full'}
            animate={{ width: STEP_PROGRESS[file.step] }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
      <span
        className={`shrink-0 font-body text-xs font-semibold ${
          done ? 'text-dark' : failed ? 'text-rose' : 'text-dark/60'
        }`}
      >
        {failed && file.error ? file.error : STEP_LABELS[file.step]}
      </span>
    </motion.div>
  )
}
