"""Document upload, listing, deletion. Pipeline: parse -> chunk -> embed -> store."""
import json
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile

from auth.router import current_user
from config import DOCS_META_PATH, MAX_FILE_SIZE_MB, UPLOAD_DIR
from documents.chunker import chunk_pages
from documents.parser import parse_document
from documents.schemas import DocumentInfo
from rag.embeddings import embed_texts
from rag import vectorstore

router = APIRouter(prefix="/api/documents", tags=["documents"])


def _load_meta() -> list[dict]:
    if DOCS_META_PATH.exists():
        return json.loads(DOCS_META_PATH.read_text(encoding="utf-8"))
    return []


def _save_meta(items: list[dict]) -> None:
    DOCS_META_PATH.parent.mkdir(parents=True, exist_ok=True)
    DOCS_META_PATH.write_text(json.dumps(items, indent=2), encoding="utf-8")


def owned_doc_ids(user_id: str) -> set[str]:
    """Document ids belonging to a user — used by feature routers to scope RAG."""
    return {d["id"] for d in _load_meta() if d.get("owner_id") == user_id}


@router.get("", response_model=list[DocumentInfo])
def list_documents(user: dict = Depends(current_user)):
    return [d for d in _load_meta() if d.get("owner_id") == user["id"]]


@router.post("/upload", response_model=DocumentInfo)
async def upload_document(file: UploadFile, user: dict = Depends(current_user)):
    name = file.filename or "document"
    suffix = name.lower().rsplit(".", 1)[-1] if "." in name else ""
    if suffix not in ("pdf", "docx"):
        raise HTTPException(400, "Only PDF and DOCX files are supported")

    data = await file.read()
    if len(data) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(400, f"File exceeds {MAX_FILE_SIZE_MB} MB limit")

    doc_id = uuid.uuid4().hex[:12]
    path = UPLOAD_DIR / f"{doc_id}.{suffix}"
    path.write_bytes(data)

    try:
        pages = parse_document(path)  # Parse
        if not pages:
            raise ValueError("No text could be extracted from this file")
        chunks = chunk_pages(pages)  # Chunk
        embeddings = embed_texts([c["text"] for c in chunks])  # Embed
        vectorstore.add_chunks(doc_id, name, chunks, embeddings)  # Store
    except ValueError as e:
        path.unlink(missing_ok=True)
        raise HTTPException(422, str(e))
    except Exception as e:
        path.unlink(missing_ok=True)
        raise HTTPException(500, f"Processing failed: {e}")

    info = {
        "id": doc_id,
        "owner_id": user["id"],
        "name": name,
        "file_type": suffix,
        "page_count": max(p for p, _ in pages),
        "size_bytes": len(data),
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
        "chunk_count": len(chunks),
    }
    meta = _load_meta()
    meta.insert(0, info)
    _save_meta(meta)
    return info


@router.delete("/{doc_id}")
def delete_document(doc_id: str, user: dict = Depends(current_user)):
    meta = _load_meta()
    doc = next((d for d in meta if d["id"] == doc_id and d.get("owner_id") == user["id"]), None)
    if not doc:
        raise HTTPException(404, "Document not found")
    _save_meta([d for d in meta if d["id"] != doc_id])
    vectorstore.delete_document(doc_id)
    path = UPLOAD_DIR / f"{doc_id}.{doc['file_type']}"
    path.unlink(missing_ok=True)
    return {"ok": True}


@router.get("/{doc_id}/chunks")
def get_chunks(doc_id: str, user: dict = Depends(current_user)):
    if doc_id not in owned_doc_ids(user["id"]):
        raise HTTPException(404, "Document not found")
    return vectorstore.get_doc_chunks(doc_id)
