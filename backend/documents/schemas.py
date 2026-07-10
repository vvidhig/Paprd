from pydantic import BaseModel


class DocumentInfo(BaseModel):
    id: str
    name: str
    file_type: str  # "pdf" | "docx"
    page_count: int
    size_bytes: int
    uploaded_at: str
    chunk_count: int


class ChunkInfo(BaseModel):
    chunk_index: int
    page_number: int
    text: str
