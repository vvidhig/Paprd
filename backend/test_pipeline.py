"""Verify the parse -> chunk -> embed -> store -> retrieve pipeline outside uvicorn."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from documents.parser import parse_document
from documents.chunker import chunk_pages
from rag.embeddings import embed_texts
from rag import vectorstore
from rag.retriever import retrieve

pdf = Path(r"C:\Projects\Paprd\physics_test.pdf")
pages = parse_document(pdf)
print(f"parsed {len(pages)} pages")
chunks = chunk_pages(pages)
print(f"chunked into {len(chunks)} chunks")
embs = embed_texts([c["text"] for c in chunks])
print(f"embedded: {len(embs)} x {len(embs[0])}")
vectorstore.add_chunks("testdoc", "physics_test.pdf", chunks, embs)
print("stored")
hits = retrieve("What is Newton's third law?", ["testdoc"], top_k=2)
for h in hits:
    print("HIT page", h["page_number"], ":", h["text"][:80])
vectorstore.delete_document("testdoc")
print("cleanup ok")
