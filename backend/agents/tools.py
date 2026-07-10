"""The 5 study-agent tools from the spec. Each is a plain function the
routers (and the agent) call — LangChain-style tools without the executor
overhead, so behavior stays deterministic."""
from agents import prompts
from rag.chain import complete, extract_json
from rag.retriever import format_context, retrieve
from rag.vectorstore import get_doc_chunks


def search_documents(question: str, doc_ids: list[str], top_k: int = 5) -> list[dict]:
    """ChromaDB similarity search."""
    return retrieve(question, doc_ids, top_k=top_k)


def get_document_summary(doc_id: str) -> str:
    """Summarize a specific document from its stored chunks."""
    chunks = get_doc_chunks(doc_id, limit=20)
    if not chunks:
        return "No content found for this document."
    text = "\n\n".join(c["text"] for c in chunks)[:12000]
    return complete(
        [{"role": "user", "content": prompts.SUMMARY_PROMPT.format(chunks=text)}],
        temperature=0.3,
    )


def generate_notes(doc_ids: list[str], topic: str | None) -> str:
    """Create structured markdown study notes."""
    query_text = topic or "key concepts, definitions, and important facts"
    chunks = retrieve(query_text, doc_ids, top_k=10)
    if not chunks:
        raise ValueError("No document content found. Upload documents first.")
    topic_line = f"Focus specifically on: {topic}" if topic else ""
    prompt = prompts.NOTES_PROMPT.format(
        retrieved_chunks=format_context(chunks), topic_line=topic_line
    )
    return complete([{"role": "user", "content": prompt}], temperature=0.3, max_tokens=3000)


def generate_flashcards(doc_ids: list[str], topic: str | None, count: int) -> list[dict]:
    """Create flashcard JSON."""
    query_text = topic or "key concepts, definitions, and important facts"
    chunks = retrieve(query_text, doc_ids, top_k=12)
    if not chunks:
        raise ValueError("No document content found. Upload documents first.")
    prompt = prompts.FLASHCARD_PROMPT.format(
        retrieved_chunks=format_context(chunks),
        topic=topic or "general coverage of the material",
        count=count,
    )
    raw = complete([{"role": "user", "content": prompt}], temperature=0.5, max_tokens=4000)
    cards = extract_json(raw)
    if not isinstance(cards, list):
        raise ValueError("Model returned invalid flashcards")
    cleaned = []
    for i, c in enumerate(cards):
        back = c.get("back", [])
        if isinstance(back, str):
            back = [back]
        cleaned.append(
            {
                "id": str(c.get("id", i + 1)),
                "front": str(c.get("front", "")).strip(),
                "back": [str(b) for b in back][:5],
                "difficulty": c.get("difficulty", "medium"),
                "source_doc": str(c.get("source_doc", "")),
                "source_page": int(c.get("source_page", 1) or 1),
            }
        )
    return [c for c in cleaned if c["front"] and c["back"]]


def quiz_generator(doc_ids: list[str], topic: str | None, n: int = 4) -> dict:
    """Create quiz questions with grading context."""
    query_text = topic or "the most important concepts in the material"
    chunks = retrieve(query_text, doc_ids, top_k=8)
    if not chunks:
        raise ValueError("No document content found. Upload documents first.")
    prompt = prompts.TUTOR_QUIZ_PROMPT.format(n=n, retrieved_chunks=format_context(chunks))
    raw = complete([{"role": "user", "content": prompt}], temperature=0.5, max_tokens=2000)
    data = extract_json(raw)
    questions = data.get("questions", []) if isinstance(data, dict) else []
    return {
        "intro": data.get("intro", "Let's test your understanding! 🌟") if isinstance(data, dict) else "Quiz time!",
        "questions": [
            {"question": q.get("question", ""), "context": q.get("context", "")}
            for q in questions
            if q.get("question")
        ],
    }
