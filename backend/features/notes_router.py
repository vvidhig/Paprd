import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from agents import tools
from auth.router import current_user
from documents.router import owned_doc_ids

router = APIRouter(prefix="/api/notes", tags=["notes"])


class NotesRequest(BaseModel):
    document_ids: list[str] = []
    topic: str | None = None


@router.post("/generate")
def generate_notes(req: NotesRequest, user: dict = Depends(current_user)):
    allowed = owned_doc_ids(user["id"])
    doc_ids = [d for d in req.document_ids if d in allowed] or list(allowed)
    if not doc_ids:
        raise HTTPException(422, "No documents found. Upload documents first.")
    try:
        markdown = tools.generate_notes(doc_ids, req.topic)
    except ValueError as e:
        raise HTTPException(422, str(e))
    except RuntimeError as e:
        raise HTTPException(500, str(e))
    sections = re.findall(r"^##\s+(.+)$", markdown, re.MULTILINE)
    return {"notes_markdown": markdown, "sections": sections}
