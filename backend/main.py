"""Paprd backend — AI-powered document study platform.

Feed it docs. Understand everything.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import CORS_ORIGINS
from auth.router import router as auth_router
from documents.router import router as documents_router
from features.ask_router import router as ask_router
from features.notes_router import router as notes_router
from features.flashcards_router import router as flashcards_router
from features.tutor_router import router as tutor_router

app = FastAPI(title="Paprd API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(ask_router)
app.include_router(notes_router)
app.include_router(flashcards_router)
app.include_router(tutor_router)


@app.get("/api/health")
def health():
    return {"status": "ok", "app": "Paprd"}
