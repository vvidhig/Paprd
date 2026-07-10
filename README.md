# 📄 Paprd

**Feed it docs. Understand everything.**

An AI-powered document study platform — upload PDFs/DOCX, then ask questions with citations, generate study notes, flip through 3D flashcards, and learn with an AI tutor.

## Stack

- **Frontend:** React 18 + TypeScript + Tailwind CSS + Vite + Framer Motion + Lenis
- **Backend:** FastAPI + Python 3.11+
- **RAG:** ChromaDB + sentence-transformers (`all-MiniLM-L6-v2`, local) + LangChain text splitters
- **LLM:** Groq API (`llama-3.3-70b-versatile`)
- **Parsing:** PyMuPDF (PDF) · python-docx (DOCX)

## Setup

### 1. Backend

```powershell
cd backend
python -m venv venv          # already created
venv\Scripts\pip install -r requirements.txt
```

Add your Groq API key to `backend/.env`:

```
GROQ_API_KEY=gsk_...
```

(Free key at https://console.groq.com/keys)

Run:

```powershell
venv\Scripts\uvicorn main:app --reload --port 8000
```

> First upload downloads the embedding model (~90 MB) — one-time.

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — the Vite dev server proxies `/api` to the backend on port 8000.

## Pages

| Page | What it does |
|---|---|
| 🏠 Landing (`/`) | Animated hero, feature showcase, how-it-works, login/signup modal |
| 📚 Library | Drag & drop upload → parse → chunk → embed pipeline with animated progress |
| 💬 Ask | RAG Q&A with clickable source citations + follow-up suggestions |
| 📝 Notes | AI-generated structured study notes, editable & saved locally |
| 🎴 Flashcards | Premium 3D flip cards, got-it/review tracking, shuffle, deck overview |
| 🧑‍🏫 Tutor | Conversational tutor with ELI5/analogy/quiz modes and scorecards |

## Auth

Simple local accounts: signup/login on the landing page. Passwords are PBKDF2-hashed
into `backend/storage/users.json`; sessions are opaque bearer tokens in
`backend/storage/sessions.json`. App routes redirect to the landing page when logged out.

## Assets

`frontend/public/assets/` contains hand-crafted pastel SVG illustrations. The CLAUDE.md spec calls for Higgsfield-generated PNGs with the same names — regenerate and drop them in when Higgsfield credits are available.
