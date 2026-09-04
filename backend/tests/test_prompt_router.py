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

import httpx
import anthropic
from starlette.requests import Request

from routers.prompt import PromptRequest, client_ip


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


def _request_with_headers(headers: dict[str, str]) -> Request:
    scope = {
        "type": "http",
        "method": "POST",
        "path": "/api/prompt",
        "query_string": b"",
        "scheme": "http",
        "server": ("test", 80),
        "client": ("10.0.0.9", 1234),
        "headers": [(k.lower().encode(), v.encode()) for k, v in headers.items()],
    }
    return Request(scope)


def test_client_ip_prefers_first_forwarded_hop() -> None:
    req = _request_with_headers({"X-Forwarded-For": "203.0.113.7, 10.0.0.1"})
    assert client_ip(req) == "203.0.113.7"


def test_client_ip_falls_back_to_remote_address() -> None:
    assert client_ip(_request_with_headers({})) == "10.0.0.9"


@pytest.mark.asyncio
async def test_prompt_returns_503_when_no_key_is_configured(
    client: AsyncClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    from config import settings

    monkeypatch.setattr(settings, "anthropic_api_key", "")
    resp = await client.post("/api/prompt", json={"prompt": "hello"})
    assert resp.status_code == 503
    assert resp.json()["detail"]["error"] == "lab_not_configured"


def _anthropic_status_error(status: int) -> anthropic.APIStatusError:
    request = httpx.Request("POST", "https://api.anthropic.com/v1/messages")
    response = httpx.Response(status, request=request)
    cls = {401: anthropic.AuthenticationError, 429: anthropic.RateLimitError}.get(
        status, anthropic.APIStatusError
    )
    return cls("upstream said no", response=response, body=None)


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("status", "expected_http", "expected_code"),
    [
        (401, 503, "lab_not_configured"),
        (429, 503, "upstream_rate_limited"),
        (500, 502, "upstream_error"),
    ],
)
async def test_prompt_maps_upstream_errors(
    client: AsyncClient,
    monkeypatch: pytest.MonkeyPatch,
    status: int,
    expected_http: int,
    expected_code: str,
) -> None:
    async def failing_send_message(**_: object) -> dict[str, object]:
        raise _anthropic_status_error(status)

    monkeypatch.setattr("routers.prompt.send_message", failing_send_message)
    resp = await client.post("/api/prompt", json={"prompt": "hello"})
    assert resp.status_code == expected_http
    assert resp.json()["detail"]["error"] == expected_code
    # Nothing secret leaks into the message.
    assert "test-key" not in resp.text
