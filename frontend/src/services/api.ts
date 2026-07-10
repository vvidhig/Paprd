import type {
  AskResponse,
  DocumentInfo,
  FlashCardData,
  NotesResponse,
  QuizResult,
  TutorResponse,
} from '../types'

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api'

function authHeader(): Record<string, string> {
  try {
    const raw = localStorage.getItem('paprd_auth')
    if (!raw) return {}
    const { token } = JSON.parse(raw)
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeader(),
    },
    ...options,
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => null)
    throw new Error(detail?.detail ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  // Documents
  listDocuments: () => request<DocumentInfo[]>('/documents'),

  uploadDocument: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return request<DocumentInfo>('/documents/upload', { method: 'POST', body: form })
  },

  deleteDocument: (id: string) => request<{ ok: boolean }>(`/documents/${id}`, { method: 'DELETE' }),

  // Ask
  ask: (question: string, documentIds: string[], chatHistory: { role: string; content: string }[]) =>
    request<AskResponse>('/ask', {
      method: 'POST',
      body: JSON.stringify({ question, document_ids: documentIds, chat_history: chatHistory }),
    }),

  // Notes
  generateNotes: (documentIds: string[], topic?: string) =>
    request<NotesResponse>('/notes/generate', {
      method: 'POST',
      body: JSON.stringify({ document_ids: documentIds, topic: topic || null }),
    }),

  // Flashcards
  generateFlashcards: (documentIds: string[], topic: string | null, count: number) =>
    request<{ cards: FlashCardData[] }>('/flashcards/generate', {
      method: 'POST',
      body: JSON.stringify({ document_ids: documentIds, topic, count }),
    }),

  // Tutor
  tutorChat: (
    message: string,
    documentIds: string[],
    chatHistory: { role: string; content: string }[],
    mode?: string,
  ) =>
    request<TutorResponse>('/tutor/chat', {
      method: 'POST',
      body: JSON.stringify({ message, document_ids: documentIds, chat_history: chatHistory, mode: mode || null }),
    }),

  tutorEvaluate: (question: string, userAnswer: string, correctContext: string) =>
    request<QuizResult>('/tutor/evaluate', {
      method: 'POST',
      body: JSON.stringify({ question, user_answer: userAnswer, correct_context: correctContext }),
    }),
}
