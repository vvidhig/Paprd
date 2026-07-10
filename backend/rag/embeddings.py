"""Local all-MiniLM-L6-v2 embeddings via ChromaDB's ONNX runtime.

(The sentence-transformers/torch path fails to load on this machine —
torch c10.dll DLL init error — so we use the identical MiniLM model
exported to ONNX, bundled with chromadb. Same 384-dim vectors, no torch.)
"""
from functools import lru_cache

from chromadb.utils.embedding_functions import ONNXMiniLM_L6_V2


@lru_cache(maxsize=1)
def get_model() -> ONNXMiniLM_L6_V2:
    return ONNXMiniLM_L6_V2(preferred_providers=["CPUExecutionProvider"])


def embed_texts(texts: list[str]) -> list[list[float]]:
    model = get_model()
    return [list(map(float, vec)) for vec in model(texts)]


def embed_query(text: str) -> list[float]:
    return embed_texts([text])[0]
