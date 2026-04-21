"""Business logic over the occupation repository."""

from __future__ import annotations

from hashlib import sha256

from services.occupation_repo import (
    LearningPath,
    Occupation,
    OccupationRepository,
    get_repository,
)


def get_occupation(code: str, repo: OccupationRepository | None = None) -> Occupation | None:
    return (repo or get_repository()).get(code)


def search_occupations(
    query: str,
    limit: int = 25,
    repo: OccupationRepository | None = None,
) -> list[Occupation]:
    return (repo or get_repository()).search(query, limit=limit)


def list_occupations(repo: OccupationRepository | None = None) -> list[Occupation]:
    return (repo or get_repository()).list_all()


def get_curriculum(code: str, repo: OccupationRepository | None = None) -> LearningPath | None:
    occ = get_occupation(code, repo=repo)
    return occ.learningPath if occ else None


def compute_dollar_wage_premium(occupation: Occupation) -> int | None:
    """Derive the absolute dollar uplift from wage-premium % and OEWS median.

    Used by Phase 5 (wage premium in dollars). Returns None if either input is
    missing. Rounds to the nearest $100 for UI presentation.
    """
    wage = occupation.laMedianWage
    if wage is None:
        return None
    premium_pct = occupation.scoreCard.wagePremium.value
    uplift = wage * (premium_pct / 100.0)
    return int(round(uplift / 100.0)) * 100


def etag_for(occupation: Occupation) -> str:
    """Stable ETag: hash of (code, lastReviewed). Small & cheap."""
    key = f"{occupation.code}:{occupation.lastReviewed}".encode()
    return f'W/"{sha256(key).hexdigest()[:16]}"'
