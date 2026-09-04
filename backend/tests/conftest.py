"""Shared pytest fixtures."""

from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient


@pytest.fixture
async def client(monkeypatch: pytest.MonkeyPatch) -> AsyncIterator[AsyncClient]:
    """Boot the FastAPI app with the Claude call stubbed out."""

    async def fake_send_message(
        prompt: str,
        model: str = "claude-sonnet-4-6",
        max_tokens: int = 4096,
    ) -> dict[str, Any]:
        return {
            "content": f"(stubbed response for: {prompt[:40]})",
            "model": model,
            "usage": {"input_tokens": 12, "output_tokens": 34},
        }

    monkeypatch.setattr(
        "routers.prompt.send_message",
        fake_send_message,
    )

    # The router refuses to call Claude without a key; tests act as a configured server.
    from config import settings

    monkeypatch.setattr(settings, "anthropic_api_key", "test-key")

    # Import after patching so module-level refs see the patched symbol.
    from main import app
    from routers.prompt import limiter

    # The limiter's in-memory storage outlives the app between tests.
    limiter.reset()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
