"""Persistent local vector store (numpy cosine search).

ChromaDB's storage layer is unusable on this machine (1.x rust bindings
crash the process on .add(); 0.5.x needs a C++ toolchain to build hnswlib),
so chunks + embeddings persist as JSON per document and search is exact
brute-force cosine — precise and instant at study-app scale.
The public interface matches the original ChromaDB wrapper.
"""
import json
from pathlib import Path

import numpy as np

from config import CHROMA_PERSIST_DIR

STORE_DIR = Path(CHROMA_PERSIST_DIR)

# in-memory cache: doc_id -> {"doc_name", "chunks", "matrix"}
_cache: dict[str, dict] = {}
_loaded = False


def _doc_path(doc_id: str) -> Path:
    return STORE_DIR / f"{doc_id}.json"


def _load_all() -> None:
    global _loaded
    if _loaded:
        return
    STORE_DIR.mkdir(parents=True, exist_ok=True)
    for path in STORE_DIR.glob("*.json"):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            _cache[path.stem] = {
                "doc_name": data["doc_name"],
                "chunks": data["chunks"],
                "matrix": np.array(data["embeddings"], dtype=np.float32),
            }
        except (json.JSONDecodeError, KeyError):
            continue
    _loaded = True


def add_chunks(doc_id: str, doc_name: str, chunks: list[dict], embeddings: list[list[float]]) -> None:
    _load_all()
    STORE_DIR.mkdir(parents=True, exist_ok=True)
    _doc_path(doc_id).write_text(
        json.dumps({"doc_name": doc_name, "chunks": chunks, "embeddings": embeddings}),
        encoding="utf-8",
    )
    _cache[doc_id] = {
        "doc_name": doc_name,
        "chunks": chunks,
        "matrix": np.array(embeddings, dtype=np.float32),
    }


def delete_document(doc_id: str) -> None:
    _load_all()
    _cache.pop(doc_id, None)
    _doc_path(doc_id).unlink(missing_ok=True)


def query(embedding: list[float], doc_ids: list[str], top_k: int = 5) -> list[dict]:
    _load_all()
    ids = [d for d in (doc_ids or list(_cache)) if d in _cache]
    scored: list[tuple[float, dict]] = []
    q = np.array(embedding, dtype=np.float32)
    q = q / (np.linalg.norm(q) or 1.0)
    for doc_id in ids:
        entry = _cache[doc_id]
        matrix = entry["matrix"]
        if matrix.size == 0:
            continue
        norms = np.linalg.norm(matrix, axis=1)
        norms[norms == 0] = 1.0
        sims = (matrix @ q) / norms
        for idx in np.argsort(sims)[::-1][:top_k]:
            chunk = entry["chunks"][int(idx)]
            scored.append(
                (
                    float(sims[idx]),
                    {
                        "text": chunk["text"],
                        "doc_id": doc_id,
                        "doc_name": entry["doc_name"],
                        "page_number": chunk["page_number"],
                        "chunk_index": chunk["chunk_index"],
                    },
                )
            )
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [item for _, item in scored[:top_k]]


def get_doc_chunks(doc_id: str, limit: int = 40) -> list[dict]:
    _load_all()
    entry = _cache.get(doc_id)
    if not entry:
        return []
    items = [
        {
            "text": c["text"],
            "doc_id": doc_id,
            "doc_name": entry["doc_name"],
            "page_number": c["page_number"],
            "chunk_index": c["chunk_index"],
        }
        for c in entry["chunks"]
    ]
    items.sort(key=lambda x: x["chunk_index"])
    return items[:limit]
