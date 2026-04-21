"""Tests for the occupation repository (P1-T5)."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest

from services.occupation_repo import (
    OccupationRepository,
    _build_repository,
    build_repository_from,
)


def make_occupation(
    code: str = "17-2199.01",
    title: str = "Robotics Engineers",
    job_family: str = "Engineering",
    la_employment: int | None = 1200,
    la_median_wage: int | None = 104_000,
) -> dict[str, Any]:
    return {
        "code": code,
        "title": title,
        "jobFamily": job_family,
        "laEmployment": la_employment,
        "laMedianWage": la_median_wage,
        "rlmaDistribution": {"RLMA-1": 25.0, "RLMA-7": 30.0, "RLMA-8": 10.0},
        "relatedSOCs": ["17-2112", "17-2141"],
        "typicalEmployerIds": ["meta-hyperion", "amazon-aws"],
        "sectorIds": ["technology", "manufacturing"],
        "scoreCard": {
            "exposure": {
                "value": 68.0,
                "confidence": "medium",
                "source": {
                    "sourceId": "eloundou-2024",
                    "label": "Eloundou et al. 2024, Appendix B",
                    "url": "https://arxiv.org/abs/2303.10130",
                    "asOf": "2024",
                },
                "lastComputed": "2026-04-21",
            },
            "augmentation": {
                "value": 42.0,
                "confidence": "medium",
                "source": {
                    "sourceId": "anthropic-economic-index-2025",
                    "label": "Anthropic Economic Index 2025",
                    "url": "https://www.anthropic.com/research/economic-index",
                    "asOf": "2025",
                },
                "lastComputed": "2026-04-21",
            },
            "replacement": {
                "value": 26.0,
                "confidence": "low",
                "source": {
                    "sourceId": "anthropic-economic-index-2025",
                    "label": "Anthropic Economic Index 2025",
                    "url": "https://www.anthropic.com/research/economic-index",
                    "asOf": "2025",
                },
                "lastComputed": "2026-04-21",
            },
            "wagePremium": {
                "value": 58.0,
                "confidence": "medium",
                "source": {
                    "sourceId": "pwc-ai-jobs-barometer-2025",
                    "label": "PwC AI Jobs Barometer 2024/2025 + BLS OEWS LA 2025",
                    "url": "https://www.pwc.com/gx/en/issues/artificial-intelligence/ai-jobs-barometer.html",
                    "asOf": "2025",
                },
                "lastComputed": "2026-04-21",
            },
        },
        "skillBundle": {
            "technical": [
                {
                    "id": "tech-1",
                    "title": "Claude API integration for robot perception",
                    "summary": "Use the Anthropic SDK to pipe sensor data through Claude for object classification.",
                    "dimension": "technical",
                    "priority": "core",
                },
            ],
            "critical": [
                {
                    "id": "crit-1",
                    "title": "Verify model output before actuating",
                    "summary": "Gate every LLM-suggested motion command through a deterministic safety check.",
                    "dimension": "critical",
                    "priority": "core",
                },
            ],
            "ethical": [
                {
                    "id": "eth-1",
                    "title": "Workplace-safety accountability when AI is in the loop",
                    "summary": "Document every AI-assisted decision for incident review.",
                    "dimension": "ethical",
                    "priority": "supporting",
                },
            ],
            "domainSpecific": [
                {
                    "id": "dom-1",
                    "title": "Humanoid fabrication workcell programming",
                    "summary": "Program SSE Steel-style workcells where humanoids handle repetitive welding prep.",
                    "dimension": "domain-specific",
                    "priority": "core",
                    "anchorTask": "O*NET 17-2199.01 task 12",
                },
            ],
        },
        "learningPath": {
            "socCode": code,
            "recommendedModules": [
                {
                    "moduleId": "ai-fundamentals",
                    "order": 1,
                    "rationale": "Ground how LLMs think before you let them drive motion.",
                    "covers": ["technical"],
                },
                {
                    "moduleId": "prompt-engineering",
                    "order": 2,
                    "rationale": "Claude-specific prompting for sensor+context pipelines.",
                    "covers": ["technical"],
                },
                {
                    "moduleId": "responsible-ai",
                    "order": 3,
                    "rationale": "Safety-of-life implications of AI-controlled actuators.",
                    "covers": ["ethical", "critical"],
                },
            ],
            "supplementalResources": [],
            "estimatedTotalMinutes": 85,
            "milestones": [],
        },
        "summary": "Plans, designs, tests, and supervises robotic systems.",
        "sourceCitations": [
            {
                "sourceId": "onet-28",
                "label": "O*NET 28.0",
                "url": "https://www.onetonline.org/",
                "asOf": "2024",
            },
        ],
        "lastReviewed": "2026-04-21",
    }


def write_occupation(dir_: Path, code: str, overrides: dict[str, Any] | None = None) -> Path:
    rec = make_occupation(code=code)
    if overrides:
        rec.update(overrides)
    path = dir_ / f"{code}.json"
    path.write_text(json.dumps(rec, indent=2))
    return path


def test_build_repository_from_dicts() -> None:
    repo = build_repository_from([make_occupation()])
    assert len(repo.list_all()) == 1
    assert repo.get("17-2199.01") is not None
    assert repo.get("99-9999") is None


def test_repository_search_prefers_exact_code(tmp_path: Path) -> None:
    write_occupation(tmp_path, "17-2199.01")
    write_occupation(tmp_path, "17-2112", overrides={"title": "Industrial Engineers"})
    repo = _build_repository(tmp_path)

    exact = repo.search("17-2199.01")
    assert exact[0].code == "17-2199.01"


def test_repository_search_matches_title_case_insensitive(tmp_path: Path) -> None:
    write_occupation(tmp_path, "17-2199.01")
    repo = _build_repository(tmp_path)
    hits = repo.search("robotics")
    assert hits and hits[0].code == "17-2199.01"


def test_repository_search_empty_query_returns_nothing() -> None:
    repo = build_repository_from([make_occupation()])
    assert repo.search("") == []
    assert repo.search("   ") == []


def test_repository_handles_missing_dir(tmp_path: Path) -> None:
    repo = _build_repository(tmp_path / "does-not-exist")
    assert isinstance(repo, OccupationRepository)
    assert repo.list_all() == []


def test_invalid_json_skipped(tmp_path: Path) -> None:
    write_occupation(tmp_path, "17-2199.01")
    (tmp_path / "broken.json").write_text("{ not json")
    repo = _build_repository(tmp_path)
    assert len(repo.list_all()) == 1


def test_schema_validation_rejects_unknown_field(tmp_path: Path) -> None:
    (tmp_path / "bad.json").write_text(
        json.dumps({**make_occupation(), "wildField": "nope"}),
    )
    repo = _build_repository(tmp_path)
    # The file is skipped; no record loaded.
    assert repo.list_all() == []
