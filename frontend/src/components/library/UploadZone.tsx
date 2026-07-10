import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  onFiles: (files: File[]) => void
}

const ACCEPTED = ['.pdf', '.docx']

export default function UploadZone({ onFiles }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [dropped, setDropped] = useState(false)

  const handleFiles = (list: FileList | null) => {
    if (!list) return
    const files = Array.from(list).filter((f) =>
      ACCEPTED.some((ext) => f.name.toLowerCase().endsWith(ext)),
    )
    if (files.length) {
      setDropped(true)
      setTimeout(() => setDropped(false), 600)
      onFiles(files)
    }
  }

  return (
    <motion.div
      animate={dropped ? { scale: [1, 1.04, 0.98, 1] } : {}}
      transition={{ duration: 0.5, type: 'spring', stiffness: 300 }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={`mx-auto flex h-[200px] w-full max-w-[600px] cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed transition-all duration-300 ${
        dropped
          ? 'border-mint bg-mint/20'
          : dragOver
            ? 'border-solid border-lavender bg-lavender/10'
            : 'animate-pulseBorder border-lavender bg-lavender/5 hover:border-solid hover:bg-lavender/10'
      }`}
    >
      <img src="/assets/loading_books.svg" alt="" className="h-20" draggable={false} />
      <p className="font-heading text-base font-semibold text-dark">Drag &amp; drop PDFs or Word docs</p>
      <p className="font-body text-sm text-dark/50">or click to browse</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </motion.div>
  )
}
