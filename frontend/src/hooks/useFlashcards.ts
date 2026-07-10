import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import type { CardStatus, FlashCardData, SavedDeck } from '../types'

function load(key: string): SavedDeck[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

export function useSavedDecks() {
  const { user } = useAuth()
  // Saved decks are per-account
  const key = `paprd_saved_decks_${user?.id ?? 'anon'}`
  const [decks, setDecks] = useState<SavedDeck[]>(() => load(key))

  useEffect(() => {
    setDecks(load(key))
  }, [key])

  const persist = useCallback(
    (next: SavedDeck[]) => {
      setDecks(next)
      localStorage.setItem(key, JSON.stringify(next))
    },
    [key],
  )

  const saveDeck = useCallback(
    (name: string, cards: FlashCardData[], progress: Record<string, CardStatus>) => {
      const item: SavedDeck = {
        id: `deck-${Date.now()}`,
        name,
        cards,
        progress,
        created_at: new Date().toISOString(),
      }
      persist([item, ...load(key)])
      return item
    },
    [key, persist],
  )

  const updateProgress = useCallback(
    (deckId: string, progress: Record<string, CardStatus>) => {
      persist(load(key).map((d) => (d.id === deckId ? { ...d, progress } : d)))
    },
    [key, persist],
  )

  const removeDeck = useCallback(
    (id: string) => {
      persist(load(key).filter((d) => d.id !== id))
    },
    [key, persist],
  )

  return { decks, saveDeck, updateProgress, removeDeck }
}
