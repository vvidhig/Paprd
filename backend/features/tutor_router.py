from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from agents import prompts
from agents.study_agent import tutor_chat
from auth.router import current_user
from documents.router import owned_doc_ids
from rag.chain import complete, extract_json

router = APIRouter(prefix="/api/tutor", tags=["tutor"])


class TutorChatRequest(BaseModel):
    message: str
    document_ids: list[str] = []
    chat_history: list[dict] = []
    mode: str | None = None


class EvaluateRequest(BaseModel):
    question: str
    user_answer: str
    correct_context: str


@router.post("/chat")
def chat(req: TutorChatRequest, user: dict = Depends(current_user)):
    allowed = owned_doc_ids(user["id"])
    doc_ids = [d for d in req.document_ids if d in allowed] or list(allowed)
    if not doc_ids:
        raise HTTPException(422, "No documents found. Upload documents first.")
    try:
        return tutor_chat(req.message, doc_ids, req.chat_history, req.mode)
    except ValueError as e:
        raise HTTPException(422, str(e))
    except RuntimeError as e:
        raise HTTPException(500, str(e))


@router.post("/evaluate")
def evaluate(req: EvaluateRequest, user: dict = Depends(current_user)):
    prompt = prompts.EVALUATE_PROMPT.format(
        question=req.question,
        user_answer=req.user_answer,
        correct_context=req.correct_context,
    )
    try:
        raw = complete([{"role": "user", "content": prompt}], temperature=0.2, max_tokens=600)
        data = extract_json(raw)
    except (ValueError, RuntimeError) as e:
        raise HTTPException(500, f"Evaluation failed: {e}")
    return {
        "question": req.question,
        "user_answer": req.user_answer,
        "score": float(data.get("score", 0)),
        "feedback": data.get("feedback", ""),
        "explanation": data.get("explanation", ""),
        "topic": data.get("topic", "General"),
    }
