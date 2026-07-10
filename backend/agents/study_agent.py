"""Tutor agent: routes modes to tools and builds tutor conversations."""
from agents import prompts, tools
from rag.chain import complete
from rag.retriever import format_context, retrieve

MODE_INSTRUCTIONS = {
    "eli5": "Explain in VERY simple language a 5-year-old could follow, with everyday analogies.",
    "analogy": "Teach this with one creative, memorable analogy (in a > blockquote).",
    "summarize": "Give a brief, structured overview of the topic.",
    "why": "Explain why this matters in the real world, with concrete examples.",
    "connect": "Show how the topics in the material relate to each other.",
}


def tutor_chat(message: str, doc_ids: list[str], history: list[dict], mode: str | None) -> dict:
    if mode == "test":
        quiz = tools.quiz_generator(doc_ids, topic=None, n=4)
        return {
            "response": quiz["intro"] + " Answer each question below and I'll grade you as we go. 📝",
            "mode": "test",
            "quiz_data": {"questions": quiz["questions"]},
        }

    chunks = retrieve(message, doc_ids, top_k=6)
    context = format_context(chunks) if chunks else "(no matching material found)"

    system = prompts.TUTOR_SYSTEM + f"\n\nStudy material context:\n{context}"
    if mode in MODE_INSTRUCTIONS:
        system += f"\n\nActive command: {MODE_INSTRUCTIONS[mode]}"

    messages = [{"role": "system", "content": system}]
    for h in history[-10:]:
        role = "assistant" if h.get("role") == "assistant" else "user"
        messages.append({"role": role, "content": h.get("content", "")})
    messages.append({"role": "user", "content": message})

    response = complete(messages, temperature=0.6, max_tokens=1500)
    return {"response": response, "mode": mode or "chat", "quiz_data": None}
