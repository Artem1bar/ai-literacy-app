"""Tests for /api/occupation, /api/occupations, /api/curriculum (P1-T6)."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from httpx import ASGITransport, AsyncClient

from tests.test_occupation_repo import make_occupation


@pytest.fixture
async def api_client(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    data_dir = tmp_path / "occupations"
    data_dir.mkdir()
    # Seed three records so list + search have enough to flex against.
    records = [
        make_occupation(code="17-2199.01", title="Robotics Engineers"),
        make_occupation(code="15-1252", title="Software Developers"),
        make_occupation(
            code="51-4121",
            title="Welders, Cutters, Solderers, and Brazers",
            job_family="Production",
            la_employment=12_500,
            la_median_wage=52_400,
        ),
    ]
    for r in records:
        (data_dir / f"{r['code']}.json").write_text(json.dumps(r))

    # Patch the repository to read our tmp dir.
    from services import occupation_repo

    monkeypatch.setattr(occupation_repo, "_default_data_dir", lambda: data_dir)
    occupation_repo.reset_repository_cache()

    # Stub the Claude call for the prompt router so main() imports cleanly.
    async def fake_send_message(prompt: str, model: str = "claude-sonnet-4-6", max_tokens: int = 4096):
        return {"content": "noop", "model": model, "usage": {"input_tokens": 1, "output_tokens": 1}}

    monkeypatch.setattr("routers.prompt.send_message", fake_send_message)

    from main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

    occupation_repo.reset_repository_cache()


async def test_get_occupation_happy(api_client: AsyncClient) -> None:
    resp = await api_client.get("/api/occupation/17-2199.01")
    assert resp.status_code == 200
    body = resp.json()
    assert body["code"] == "17-2199.01"
    assert body["scoreCard"]["exposure"]["value"] == 68
    assert body["derived"]["wagePremiumDollars"] is not None
    assert resp.headers.get("ETag", "").startswith('W/"')
    assert resp.headers.get("Cache-Control") == "public, max-age=3600"


async def test_get_occupation_404_unknown(api_client: AsyncClient) -> None:
    resp = await api_client.get("/api/occupation/99-9999")
    assert resp.status_code == 404
    assert resp.json()["detail"]["error"] == "occupation_not_found"


async def test_etag_304(api_client: AsyncClient) -> None:
    first = await api_client.get("/api/occupation/17-2199.01")
    etag = first.headers["ETag"]
    second = await api_client.get(
        "/api/occupation/17-2199.01",
        headers={"If-None-Match": etag},
    )
    assert second.status_code == 304


async def test_search_occupations(api_client: AsyncClient) -> None:
    resp = await api_client.get("/api/occupations/search?q=welder")
    assert resp.status_code == 200
    body = resp.json()
    assert body["count"] >= 1
    assert body["results"][0]["code"] == "51-4121"


async def test_search_by_soc_code(api_client: AsyncClient) -> None:
    resp = await api_client.get("/api/occupations/search?q=15-1252")
    body = resp.json()
    assert body["results"][0]["code"] == "15-1252"


async def test_search_empty_query_is_400(api_client: AsyncClient) -> None:
    resp = await api_client.get("/api/occupations/search?q=")
    assert resp.status_code == 422


async def test_list_priority_only(api_client: AsyncClient) -> None:
    resp = await api_client.get("/api/occupations?priorityOnly=true")
    body = resp.json()
    codes = {r["code"] for r in body["results"]}
    assert "51-4121" in codes  # 12,500 LA employment passes ≥5,000 gate
    assert "17-2199.01" not in codes  # 1,200 fails
    assert resp.headers.get("Cache-Control") == "public, max-age=3600"


async def test_curriculum_returns_learning_path(api_client: AsyncClient) -> None:
    resp = await api_client.get("/api/curriculum/17-2199.01")
    assert resp.status_code == 200
    body = resp.json()
    assert body["socCode"] == "17-2199.01"
    assert len(body["recommendedModules"]) == 3


async def test_curriculum_404(api_client: AsyncClient) -> None:
    resp = await api_client.get("/api/curriculum/99-9999")
    assert resp.status_code == 404
