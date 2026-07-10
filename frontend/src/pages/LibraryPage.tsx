import { AnimatePresence, motion } from 'framer-motion'
import UploadZone from '../components/library/UploadZone'
import ProcessingCard from '../components/library/ProcessingCard'
import DocumentCard from '../components/library/DocumentCard'
import { useDocuments } from '../hooks/useDocuments'
import { useToast } from '../components/shared/Toast'

export default function LibraryPage() {
  const { documents, processing, loading, upload, remove } = useDocuments()
  const toast = useToast()

  const handleDelete = async (id: string) => {
    try {
      await remove(id)
      toast('Document deleted', 'info')
    } catch {
      toast('Failed to delete document', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold text-dark">Your Library</h1>
          <p className="mt-1 font-body text-dark/60">Upload documents and start learning</p>
        </div>
        <span className="rounded-pill bg-skyblue px-4 py-2 font-body text-sm font-semibold text-dark">
          {documents.length} doc{documents.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Upload zone */}
      <UploadZone onFiles={upload} />

      {/* Processing cards */}
      <div className="mt-6 flex flex-col gap-3">
        <AnimatePresence>
          {processing.map((f) => (
            <ProcessingCard key={f.tempId} file={f} />
          ))}
        </AnimatePresence>
      </div>

      {/* Document grid */}
      {documents.length > 0 ? (
        <motion.div
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <AnimatePresence>
            {documents.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        !loading &&
        processing.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-14 flex flex-col items-center text-center"
          >
            <img src="/assets/empty_library.svg" alt="Empty library" className="max-h-[200px]" />
            <h2 className="mt-6 font-heading text-2xl font-semibold text-dark">No documents yet</h2>
            <p className="mt-1 font-body text-dark/50">Upload your first PDF or Word doc</p>
            <button
              onClick={() => (document.querySelector('input[type=file]') as HTMLInputElement)?.click()}
              className="mt-6 rounded-pill px-7 py-3 font-heading font-semibold text-white shadow-cta transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(90deg, #FF99C8 0%, #E8C0FC 100%)' }}
            >
              Upload Document
            </button>
          </motion.div>
        )
      )}
    </div>
  )
}
