"""JSON-backed repository for SOC occupations.

Reads `backend/data/occupations/*.json` at startup, validates each record
against the Pydantic `Occupation` schema, and keeps an in-memory index.

The repository is read-only at runtime. Updates happen via the ingest
scripts under `backend/scripts/`, which rewrite the JSON files.
"""

from __future__ import annotations

import json
import logging
from collections.abc import Iterable
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, ValidationError

logger = logging.getLogger(__name__)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Pydantic schema — mirror of frontend types.SOCOccupation
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class SourceCitation(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    sourceId: str
    label: str
    url: str | None = None
    asOf: str


class ScoreMetric(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    value: float
    confidence: str = Field(pattern=r"^(low|medium|high)$")
    source: SourceCitation
    lastComputed: str
    note: str | None = None


class ScoreCard(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    exposure: ScoreMetric
    augmentation: ScoreMetric
    replacement: ScoreMetric
    wagePremium: ScoreMetric


class SkillItem(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    id: str
    title: str
    summary: str
    dimension: str = Field(
        pattern=r"^(technical|critical|ethical|domain-specific)$",
    )
    priority: str = Field(pattern=r"^(core|supporting|stretch)$")
    anchorTask: str | None = None
    glossarySlug: str | None = None


class SkillBundle(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    technical: list[SkillItem]
    critical: list[SkillItem]
    ethical: list[SkillItem]
    domainSpecific: list[SkillItem]


class ModuleRef(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    moduleId: str
    order: int
    rationale: str
    covers: list[str]


class ResourceRef(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    resourceId: str
    rationale: str


class Milestone(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    id: str
    label: str
    afterModuleId: str
    description: str


class LearningPath(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    socCode: str
    recommendedModules: list[ModuleRef]
    supplementalResources: list[ResourceRef] = Field(default_factory=list)
    estimatedTotalMinutes: int
    milestones: list[Milestone] = Field(default_factory=list)


class Occupation(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")

    code: str = Field(pattern=r"^[0-9]{2}-[0-9]{4}(\.[0-9]{2})?$")
    title: str
    jobFamily: str
    laEmployment: int | None = None
    laMedianWage: int | None = None
    rlmaDistribution: dict[str, float] = Field(default_factory=dict)
    relatedSOCs: list[str] = Field(default_factory=list)
    typicalEmployerIds: list[str] = Field(default_factory=list)
    sectorIds: list[str] = Field(default_factory=list)
    scoreCard: ScoreCard
    skillBundle: SkillBundle
    learningPath: LearningPath
    summary: str
    sourceCitations: list[SourceCitation] = Field(default_factory=list)
    lastReviewed: str


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Repository
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


@dataclass(frozen=True)
class OccupationRepository:
    """Immutable in-memory index over the occupations directory."""

    by_code: dict[str, Occupation]

    def list_all(self) -> list[Occupation]:
        return list(self.by_code.values())

    def get(self, code: str) -> Occupation | None:
        return self.by_code.get(code)

    def search(self, query: str, limit: int = 25) -> list[Occupation]:
        """Case-insensitive fuzzy match on SOC code, title, and job family."""
        q = query.strip().lower()
        if not q:
            return []

        scored: list[tuple[int, Occupation]] = []
        for occ in self.by_code.values():
            score = 0
            code = occ.code.lower()
            title = occ.title.lower()
            family = occ.jobFamily.lower()
            if code == q:
                score += 100
            elif code.startswith(q):
                score += 50
            elif q in code:
                score += 20
            if title == q:
                score += 80
            elif q in title.split():
                score += 40
            elif q in title:
                score += 25
            if q in family:
                score += 10
            if score > 0:
                scored.append((score, occ))

        scored.sort(key=lambda pair: (-pair[0], pair[1].code))
        return [occ for _score, occ in scored[:limit]]


def _default_data_dir() -> Path:
    return Path(__file__).resolve().parent.parent / "data" / "occupations"


def _load_occupation_file(path: Path) -> Occupation | None:
    try:
        payload: dict[str, Any] = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError):
        logger.exception("Failed to read occupation file %s", path)
        return None
    try:
        return Occupation.model_validate(payload)
    except ValidationError:
        logger.exception("Invalid occupation record in %s", path)
        return None


def _build_repository(data_dir: Path) -> OccupationRepository:
    by_code: dict[str, Occupation] = {}
    if not data_dir.exists():
        logger.warning("Occupation data directory %s does not exist", data_dir)
        return OccupationRepository(by_code={})
    for path in sorted(data_dir.glob("*.json")):
        occ = _load_occupation_file(path)
        if occ is None:
            continue
        by_code[occ.code] = occ
    logger.info("Loaded %d occupations from %s", len(by_code), data_dir)
    return OccupationRepository(by_code=by_code)


@lru_cache(maxsize=1)
def get_repository() -> OccupationRepository:
    return _build_repository(_default_data_dir())


def reset_repository_cache() -> None:
    """Clear the lru_cache — call after ingest scripts modify JSON files."""
    get_repository.cache_clear()


def build_repository_from(records: Iterable[dict[str, Any]]) -> OccupationRepository:
    """Build a repository from in-memory dicts (used in tests)."""
    by_code = {Occupation.model_validate(r).code: Occupation.model_validate(r) for r in records}
    return OccupationRepository(by_code=by_code)
