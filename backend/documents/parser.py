"""Parse PDFs (PyMuPDF) and DOCX (python-docx) into per-page text."""
import re
from pathlib import Path

import fitz  # PyMuPDF
from docx import Document as DocxDocument


def _clean(text: str) -> str:
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def parse_pdf(path: Path) -> list[tuple[int, str]]:
    """Return list of (page_number, text) starting at 1."""
    pages: list[tuple[int, str]] = []
    with fitz.open(path) as doc:
        for i, page in enumerate(doc, start=1):
            text = _clean(page.get_text())
            if text:
                pages.append((i, text))
    return pages


def parse_docx(path: Path) -> list[tuple[int, str]]:
    """DOCX has no fixed pages; approximate one 'page' per ~3000 chars."""
    doc = DocxDocument(str(path))
    full = _clean("\n".join(p.text for p in doc.paragraphs if p.text.strip()))
    if not full:
        return []
    pages: list[tuple[int, str]] = []
    size = 3000
    for i in range(0, len(full), size):
        pages.append((i // size + 1, full[i : i + size]))
    return pages


def parse_document(path: Path) -> list[tuple[int, str]]:
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        return parse_pdf(path)
    if suffix == ".docx":
        return parse_docx(path)
    raise ValueError(f"Unsupported file type: {suffix}")
