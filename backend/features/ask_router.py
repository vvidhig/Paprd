"""RAG Q&A: embed question -> search -> Groq answer with citations."""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from agents import prompts
from auth.router import current_user
from documents.router import owned_doc_ids
from rag.chain import complete, extract_json
from rag.retriever import format_context, retrieve

router = APIRouter(prefix="/api", tags=["ask"])


class AskRequest(BaseModel):
    question: str
    document_ids: list[str] = []
    chat_history: list[dict] = []


@router.post("/ask")
def ask(req: AskRequest, user: dict = Depends(current_user)):
    allowed = owned_doc_ids(user["id"])
    doc_ids = [d for d in req.document_ids if d in allowed] or list(allowed)
    if not doc_ids:
        raise HTTPException(422, "No documents found. Upload documents first.")
    chunks = retrieve(req.question, doc_ids, top_k=5)
    if not chunks:
        raise HTTPException(422, "No relevant content found. Upload documents first.")

    prompt = prompts.ASK_PROMPT.format(
        retrieved_chunks=format_context(chunks), question=req.question
    )
    messages: list[dict] = [
        {"role": "system", "content": "You answer strictly from the provided context and return valid JSON."}
    ]
    for h in req.chat_history[-8:]:
        role = "assistant" if h.get("role") == "assistant" else "user"
        messages.append({"role": role, "content": h.get("content", "")})
    messages.append({"role": "user", "content": prompt})

    try:
        raw = complete(messages, temperature=0.3, max_tokens=2000)
        data = extract_json(raw)
        answer = data.get("answer", raw)
        suggested = data.get("suggested_questions", [])[:3]
    except ValueError:
        answer, suggested = raw, []
    except RuntimeError as e:
        raise HTTPException(500, str(e))

    sources = [
        {
            "doc_id": c["doc_id"],
            "doc_name": c["doc_name"],
            "page_number": c["page_number"],
            "chunk_text": c["text"],
        }
        for c in chunks[:3]
    ]
    return {"answer": answer, "sources": sources, "suggested_questions": suggested}
