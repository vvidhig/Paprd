import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import type { SavedNote } from '../types'

function load(key: string): SavedNote[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

export function useSavedNotes() {
  const { user } = useAuth()
  // Saved notes are per-account
  const key = `paprd_saved_notes_${user?.id ?? 'anon'}`
  const [notes, setNotes] = useState<SavedNote[]>(() => load(key))

  useEffect(() => {
    setNotes(load(key))
  }, [key])

  const persist = useCallback(
    (next: SavedNote[]) => {
      setNotes(next)
      localStorage.setItem(key, JSON.stringify(next))
    },
    [key],
  )

  const save = useCallback(
    (note: Omit<SavedNote, 'id' | 'created_at'>) => {
      const item: SavedNote = {
        ...note,
        id: `note-${Date.now()}`,
        created_at: new Date().toISOString(),
      }
      persist([item, ...load(key)])
      return item
    },
    [key, persist],
  )

  const remove = useCallback(
    (id: string) => {
      persist(load(key).filter((n) => n.id !== id))
    },
    [key, persist],
  )

  return { notes, save, remove }
}
