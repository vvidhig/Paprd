"""Groq LLM helpers: chat completion + robust JSON extraction."""
import json
import re

from groq import Groq

from config import GROQ_API_KEY, GROQ_MODEL

_client: Groq | None = None


def get_client() -> Groq:
    global _client
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not set. Add it to backend/.env")
    if _client is None:
        _client = Groq(api_key=GROQ_API_KEY)
    return _client


def complete(messages: list[dict], temperature: float = 0.4, max_tokens: int = 2048) -> str:
    client = get_client()
    res = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return res.choices[0].message.content or ""


def extract_json(text: str):
    """Pull the first JSON object/array out of an LLM reply."""
    text = text.strip()
    # strip markdown fences
    fence = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
    if fence:
        text = fence.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    # find first { or [ and match to the end
    for start_char, end_char in (("[", "]"), ("{", "}")):
        start = text.find(start_char)
        if start == -1:
            continue
        depth = 0
        for i in range(start, len(text)):
            if text[i] == start_char:
                depth += 1
            elif text[i] == end_char:
                depth -= 1
                if depth == 0:
                    try:
                        return json.loads(text[start : i + 1])
                    except json.JSONDecodeError:
                        break
    raise ValueError("Could not parse JSON from model output")
