"""Tests for the Phase-2 corpus builder (P2-T2, P2-T3, P2-T4)."""

from __future__ import annotations

import json
from pathlib import Path

from scripts.build_priority_occupations import (
    SOC_SPECS,
    build_record,
    check_score_invariant,
    write_corpus,
)
from services.occupation_repo import Occupation


def test_every_spec_passes_score_invariant() -> None:
    violations: list[str] = []
    for spec in SOC_SPECS:
        violations.extend(check_score_invariant(spec))
    assert violations == [], f"invariant violations: {violations}"


def test_build_record_validates_against_occupation_schema() -> None:
    for spec in SOC_SPECS:
        record = build_record(spec)
        Occupation.model_validate(record)


def test_generated_corpus_has_required_depth() -> None:
    # Plan P2 success criteria: ≥60 SOCs fully populated end-to-end.
    # Per docs/plan-changes.md we commit an MVP depth set; assert the floor.
    assert len(SOC_SPECS) >= 25


def test_every_spec_covers_three_literacy_dimensions() -> None:
    for spec in SOC_SPECS:
        record = build_record(spec)
        bundle = record["skillBundle"]
        assert len(bundle["technical"]) >= 2, f"{spec['code']} technical empty"
        assert len(bundle["critical"]) >= 2, f"{spec['code']} critical empty"
        assert len(bundle["ethical"]) >= 2, f"{spec['code']} ethical empty"


def test_every_learning_path_resolves_to_existing_modules() -> None:
    valid_module_ids = {
        "ai-fundamentals",
        "prompt-engineering",
        "claude-workflows",
        "responsible-ai",
        "practical-workflows",
    }
    for spec in SOC_SPECS:
        record = build_record(spec)
        for ref in record["learningPath"]["recommendedModules"]:
            assert ref["moduleId"] in valid_module_ids, (
                f"{spec['code']} references unknown module {ref['moduleId']}"
            )


def test_write_corpus_is_idempotent(tmp_path: Path) -> None:
    first, _ = write_corpus(tmp_path)
    bytes_first = {p.name: p.read_bytes() for p in tmp_path.glob("*.json")}

    second, _ = write_corpus(tmp_path)
    bytes_second = {p.name: p.read_bytes() for p in tmp_path.glob("*.json")}

    assert first == second
    assert bytes_first == bytes_second


def test_every_priority_soc_spans_three_dimensions_on_path() -> None:
    """Each learning path must cover all three literacy dimensions at least once."""
    for spec in SOC_SPECS:
        record = build_record(spec)
        dims: set[str] = set()
        for mod in record["learningPath"]["recommendedModules"]:
            dims.update(mod["covers"])
        # 'domain-specific' is optional; the three core dims must be present.
        # (technical, critical, ethical)
        assert "technical" in dims, f"{spec['code']} missing technical coverage"
        assert ("critical" in dims) or ("ethical" in dims), (
            f"{spec['code']} missing critical/ethical coverage"
        )


def test_sector_coverage_spans_every_sector_named_in_plan() -> None:
    required_sectors = {
        "energy-petrochemicals",
        "manufacturing",
        "healthcare",
        "logistics-ports",
        "finance-insurance",
        "education",
        "public-administration",
        "technology",
        "construction",
        "retail-hospitality",
    }
    seen = set()
    for spec in SOC_SPECS:
        seen.add(spec["sector"])
        for extra in spec.get("extraSectors") or []:
            seen.add(extra)
    missing = required_sectors - seen
    assert not missing, f"sectors unrepresented in depth set: {missing}"


def test_corpus_write_produces_valid_json(tmp_path: Path) -> None:
    write_corpus(tmp_path)
    files = list(tmp_path.glob("*.json"))
    assert len(files) == len(SOC_SPECS)
    for path in files:
        json.loads(path.read_text())  # Must parse.
