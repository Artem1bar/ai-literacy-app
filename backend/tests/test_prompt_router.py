"""Tests for the /api/prompt router.

Covers the three critical paths called out in the plan (P0-T3):
  - happy path
  - validation error (too-short prompt)
  - rate-limit 429
"""

from __future__ import annotations

import asyncio

import pytest
from httpx import AsyncClient

from routers.prompt import PromptRequest


@pytest.mark.asyncio
async def test_prompt_request_default_model_is_undated() -> None:
    """Default model must be the slug form, not the dated variant (P0-T1)."""
    body = PromptRequest(prompt="hello")
    assert body.model == "claude-sonnet-4-6"


@pytest.mark.asyncio
async def test_prompt_round_trip_happy_path(client: AsyncClient) -> None:
    resp = await client.post(
        "/api/prompt",
        json={"prompt": "Explain tokens in one sentence."},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert "content" in body
    assert body["content"].startswith("(stubbed")
    assert body["model"] == "claude-sonnet-4-6"
    assert body["usage"]["input_tokens"] == 12
    assert body["usage"]["output_tokens"] == 34


@pytest.mark.asyncio
async def test_prompt_rejects_empty_body(client: AsyncClient) -> None:
    resp = await client.post("/api/prompt", json={"prompt": ""})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_prompt_respects_max_tokens_override(client: AsyncClient) -> None:
    resp = await client.post(
        "/api/prompt",
        json={"prompt": "Test", "max_tokens": 1024},
    )
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_prompt_rate_limit_returns_429(client: AsyncClient) -> None:
    """Rate limit is configured as '10/minute'; burst over the limit returns 429."""
    # Fire 12 concurrent requests from the same client address.
    async def one() -> int:
        resp = await client.post("/api/prompt", json={"prompt": "ping"})
        return resp.status_code

    results = await asyncio.gather(*[one() for _ in range(12)])
    assert 429 in results, f"expected at least one 429 in {results}"
