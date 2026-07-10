export interface DocumentInfo {
  id: string
  name: string
  file_type: 'pdf' | 'docx'
  page_count: number
  size_bytes: number
  uploaded_at: string
  chunk_count: number
}

export type ProcessingStep = 'parsing' | 'chunking' | 'embedding' | 'ready' | 'error'

export interface ProcessingFile {
  tempId: string
  name: string
  step: ProcessingStep
  error?: string
}

export interface Source {
  doc_id: string
  doc_name: string
  page_number: number
  chunk_text: string
}

export interface ChatMsg {
  id: string
  role: 'user' | 'ai'
  content: string
  sources?: Source[]
  suggested_questions?: string[]
}

export interface AskResponse {
  answer: string
  sources: Source[]
  suggested_questions: string[]
}

export interface NotesResponse {
  notes_markdown: string
  sections: string[]
}

export interface SavedNote {
  id: string
  title: string
  markdown: string
  source_docs: string[]
  created_at: string
}

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface FlashCardData {
  id: string
  front: string
  back: string[]
  difficulty: Difficulty
  source_doc: string
  source_page: number
}

export type CardStatus = 'unseen' | 'got-it' | 'review'

export interface SavedDeck {
  id: string
  name: string
  cards: FlashCardData[]
  progress: Record<string, CardStatus>
  created_at: string
}

export interface QuizQuestion {
  question: string
  context: string
}

export interface QuizResult {
  question: string
  user_answer: string
  score: number
  feedback: string
  explanation: string
  topic: string
}

export interface TutorResponse {
  response: string
  mode: string
  quiz_data?: { questions: QuizQuestion[] } | null
}
