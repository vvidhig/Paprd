import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'
import { useAuth } from './useAuth'
import type { DocumentInfo, ProcessingFile } from '../types'

interface DocumentsContextValue {
  documents: DocumentInfo[]
  processing: ProcessingFile[]
  loading: boolean
  refresh: () => Promise<void>
  upload: (files: File[]) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const DocumentsContext = createContext<DocumentsContextValue | null>(null)

export function useDocuments(): DocumentsContextValue {
  const ctx = useContext(DocumentsContext)
  if (!ctx) throw new Error('useDocuments must be used within DocumentsProvider')
  return ctx
}

export function useDocumentsState(): DocumentsContextValue {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<DocumentInfo[]>([])
  const [processing, setProcessing] = useState<ProcessingFile[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const docs = await api.listDocuments()
      setDocuments(docs)
    } catch {
      // backend offline or session invalid — keep current state
    } finally {
      setLoading(false)
    }
  }, [])

  // Documents are per-account: clear on logout, refetch when the user changes.
  useEffect(() => {
    if (!user) {
      setDocuments([])
      setProcessing([])
      setLoading(false)
      return
    }
    setLoading(true)
    refresh()
  }, [refresh, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const upload = useCallback(
    async (files: File[]) => {
      const entries: ProcessingFile[] = files.map((f) => ({
        tempId: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: f.name,
        step: 'parsing',
      }))
      setProcessing((prev) => [...prev, ...entries])

      await Promise.all(
        files.map(async (file, i) => {
          const tempId = entries[i].tempId
          // The backend does parse→chunk→embed in one request; animate the steps
          // optimistically while it runs.
          const stepTimer1 = setTimeout(() => {
            setProcessing((prev) => prev.map((p) => (p.tempId === tempId ? { ...p, step: 'chunking' } : p)))
          }, 1200)
          const stepTimer2 = setTimeout(() => {
            setProcessing((prev) => prev.map((p) => (p.tempId === tempId ? { ...p, step: 'embedding' } : p)))
          }, 2600)
          try {
            await api.uploadDocument(file)
            clearTimeout(stepTimer1)
            clearTimeout(stepTimer2)
            setProcessing((prev) => prev.map((p) => (p.tempId === tempId ? { ...p, step: 'ready' } : p)))
            setTimeout(() => {
              setProcessing((prev) => prev.filter((p) => p.tempId !== tempId))
            }, 1800)
          } catch (err) {
            clearTimeout(stepTimer1)
            clearTimeout(stepTimer2)
            setProcessing((prev) =>
              prev.map((p) =>
                p.tempId === tempId ? { ...p, step: 'error', error: (err as Error).message } : p,
              ),
            )
            setTimeout(() => {
              setProcessing((prev) => prev.filter((p) => p.tempId !== tempId))
            }, 4000)
          }
        }),
      )
      await refresh()
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: string) => {
      setDocuments((prev) => prev.filter((d) => d.id !== id))
      try {
        await api.deleteDocument(id)
      } finally {
        refresh()
      }
    },
    [refresh],
  )

  return { documents, processing, loading, refresh, upload, remove }
}
