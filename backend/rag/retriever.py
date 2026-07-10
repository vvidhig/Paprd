"""Query pipeline: embed question -> ChromaDB top_k search."""
from rag.embeddings import embed_query
from rag.vectorstore import query


def retrieve(question: str, doc_ids: list[str], top_k: int = 5) -> list[dict]:
    emb = embed_query(question)
    return query(emb, doc_ids, top_k=top_k)


def format_context(chunks: list[dict]) -> str:
    parts = []
    for c in chunks:
        parts.append(f"[{c['doc_name']} · page {c['page_number']}]\n{c['text']}")
    return "\n\n---\n\n".join(parts)
