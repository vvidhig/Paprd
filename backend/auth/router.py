"""Lightweight auth: PBKDF2-hashed passwords + opaque session tokens.

Users and sessions persist as JSON under storage/ — no extra dependencies,
appropriate for a local-first study app.
"""
import hashlib
import json
import re
import secrets
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from config import BASE_DIR

router = APIRouter(prefix="/api/auth", tags=["auth"])

USERS_PATH = BASE_DIR / "storage" / "users.json"
SESSIONS_PATH = BASE_DIR / "storage" / "sessions.json"

PBKDF2_ITERATIONS = 200_000
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


def _load(path: Path, default):
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return default
    return default


def _save(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")


def _hash_password(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac(
        "sha256", password.encode(), bytes.fromhex(salt), PBKDF2_ITERATIONS
    ).hex()


def _public_user(user: dict) -> dict:
    return {"id": user["id"], "name": user["name"], "email": user["email"]}


def _create_session(user_id: str) -> str:
    sessions = _load(SESSIONS_PATH, {})
    token = secrets.token_urlsafe(32)
    sessions[token] = {"user_id": user_id, "created_at": datetime.now(timezone.utc).isoformat()}
    _save(SESSIONS_PATH, sessions)
    return token


def current_user(authorization: str | None = Header(default=None)) -> dict:
    """FastAPI dependency: resolve the logged-in user or raise 401."""
    return _user_from_token(authorization)


def _user_from_token(authorization: str | None) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Not authenticated")
    token = authorization.removeprefix("Bearer ").strip()
    sessions = _load(SESSIONS_PATH, {})
    session = sessions.get(token)
    if not session:
        raise HTTPException(401, "Invalid or expired session")
    users = _load(USERS_PATH, [])
    user = next((u for u in users if u["id"] == session["user_id"]), None)
    if not user:
        raise HTTPException(401, "User no longer exists")
    return user


@router.post("/signup")
def signup(req: SignupRequest):
    name = req.name.strip()
    email = req.email.strip().lower()
    if not name:
        raise HTTPException(400, "Please tell us your name")
    if not EMAIL_RE.match(email):
        raise HTTPException(400, "That doesn't look like a valid email")
    if len(req.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")

    users = _load(USERS_PATH, [])
    if any(u["email"] == email for u in users):
        raise HTTPException(400, "An account with this email already exists — try logging in")

    salt = secrets.token_hex(16)
    user = {
        "id": uuid.uuid4().hex[:12],
        "name": name,
        "email": email,
        "pw_salt": salt,
        "pw_hash": _hash_password(req.password, salt),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    users.append(user)
    _save(USERS_PATH, users)
    return {"token": _create_session(user["id"]), "user": _public_user(user)}


@router.post("/login")
def login(req: LoginRequest):
    email = req.email.strip().lower()
    users = _load(USERS_PATH, [])
    user = next((u for u in users if u["email"] == email), None)
    if not user or not secrets.compare_digest(
        _hash_password(req.password, user["pw_salt"]), user["pw_hash"]
    ):
        raise HTTPException(401, "Incorrect email or password")
    return {"token": _create_session(user["id"]), "user": _public_user(user)}


@router.get("/me")
def me(authorization: str | None = Header(default=None)):
    return _public_user(_user_from_token(authorization))


@router.post("/logout")
def logout(authorization: str | None = Header(default=None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ").strip()
        sessions = _load(SESSIONS_PATH, {})
        if token in sessions:
            del sessions[token]
            _save(SESSIONS_PATH, sessions)
    return {"ok": True}
