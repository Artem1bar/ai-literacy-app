"""Employer partnership layer (P5-T5).

JSON-backed at MVP (consistent with the rest of the Phase-1 data layer).
When the employer-cohort feature ships post-launch, migrate to SQLite using
`backend/data/migrations/0003_employer_tracks.sql`.

The store is read-only at runtime; editing happens via pull requests to
`backend/data/employer_tracks.json`.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class EmployerTrackModuleOverride:
    baseModuleId: str
    overrideTitle: str | None
    overrideSummary: str | None
    orderIdx: int


@dataclass(frozen=True)
class EmployerTrack:
    id: str
    employerId: str
    name: str
    description: str
    status: str
    socCodes: tuple[str, ...]
    moduleOverrides: tuple[EmployerTrackModuleOverride, ...]


def _tracks_path() -> Path:
    return Path(__file__).resolve().parent.parent / "data" / "employer_tracks.json"


@lru_cache(maxsize=1)
def load_tracks() -> tuple[EmployerTrack, ...]:
    path = _tracks_path()
    if not path.exists():
        return ()
    try:
        payload = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError):
        logger.exception("Failed to read %s", path)
        return ()

    out: list[EmployerTrack] = []
    for rec in payload.get("tracks", []):
        socs = tuple(rec.get("socCodes", []))
        overrides = tuple(
            EmployerTrackModuleOverride(
                baseModuleId=o["baseModuleId"],
                overrideTitle=o.get("overrideTitle"),
                overrideSummary=o.get("overrideSummary"),
                orderIdx=int(o.get("orderIdx", 0)),
            )
            for o in rec.get("moduleOverrides", [])
        )
        out.append(
            EmployerTrack(
                id=rec["id"],
                employerId=rec["employerId"],
                name=rec["name"],
                description=rec["description"],
                status=rec.get("status", "draft"),
                socCodes=socs,
                moduleOverrides=overrides,
            )
        )
    return tuple(out)


def tracks_for_employer(employer_id: str) -> tuple[EmployerTrack, ...]:
    return tuple(t for t in load_tracks() if t.employerId == employer_id and t.status == "active")


def tracks_for_soc(soc: str) -> tuple[EmployerTrack, ...]:
    return tuple(t for t in load_tracks() if soc in t.socCodes and t.status == "active")


def reset_cache() -> None:
    load_tracks.cache_clear()
