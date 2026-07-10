"""Recursive character chunking (size 1000, overlap 200).

Self-contained implementation of LangChain's RecursiveCharacterTextSplitter
algorithm — importing langchain_text_splitters drags in sentence-transformers/
torch at package init, which fails to load on this machine.
"""

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
SEPARATORS = ["\n\n", "\n", ". ", " ", ""]


def _split_text(text: str, separators: list[str]) -> list[str]:
    """Recursively split text so each piece fits CHUNK_SIZE."""
    if len(text) <= CHUNK_SIZE:
        return [text] if text.strip() else []

    sep = separators[0]
    rest = separators[1:]
    parts = text.split(sep) if sep else list(text)

    chunks: list[str] = []
    current = ""
    for part in parts:
        candidate = current + sep + part if current else part
        if len(candidate) <= CHUNK_SIZE:
            current = candidate
            continue
        if current.strip():
            chunks.append(current)
        if len(part) > CHUNK_SIZE and rest:
            chunks.extend(_split_text(part, rest))
            current = ""
        else:
            current = part
    if current.strip():
        chunks.append(current)

    # add overlap by prepending the tail of the previous chunk
    if CHUNK_OVERLAP > 0 and len(chunks) > 1:
        overlapped = [chunks[0]]
        for prev, cur in zip(chunks, chunks[1:]):
            tail = prev[-CHUNK_OVERLAP:]
            overlapped.append((tail + sep + cur)[: CHUNK_SIZE + CHUNK_OVERLAP])
        chunks = overlapped
    return chunks


def chunk_pages(pages: list[tuple[int, str]]) -> list[dict]:
    """Return chunks with page-number metadata preserved."""
    chunks: list[dict] = []
    index = 0
    for page_number, text in pages:
        for piece in _split_text(text, SEPARATORS):
            chunks.append(
                {
                    "chunk_index": index,
                    "page_number": page_number,
                    "text": piece,
                }
            )
            index += 1
    return chunks
