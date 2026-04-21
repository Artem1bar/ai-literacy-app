"""Star Jobs client — stub for the LWC / LED Star Jobs career portal.

Phase 5 (P5-T4) ships this as an abstract interface plus a stub
implementation. The real integration depends on a live Star Jobs API that
is not yet publicly documented; when it lands, swap `StubStarJobsClient`
for `HttpStarJobsClient` behind the same Protocol.

Toggle via env var `STARJOBS_STUB=true` (the default until a real client
lands). Documented switchover in `docs/deploy.md`.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class JobPosting:
    posting_id: str
    title: str
    employer: str
    soc_code: str
    parish: str
    city: str
    posted_at: str
    url: str
    summary: str
    salary_min: int | None = None
    salary_max: int | None = None


class StarJobsClient(Protocol):
    async def list_postings(
        self,
        soc_code: str,
        parish_id: str | None = None,
        limit: int = 10,
    ) -> list[JobPosting]: ...


class StubStarJobsClient:
    """Deterministic stub that returns plausible Louisiana postings per SOC.

    The stub is keyed by SOC so the same query returns the same set every
    run — useful for UI review and demos. It uses LA employers from the
    repo's louisiana.ts plus synthetic posting ids.
    """

    _TEMPLATES: dict[str, list[tuple[str, str, str, str, int, int]]] = {
        # (title suffix, employer, parish, city, salary_min, salary_max)
        "51-4121": [
            ("Structural Welder", "Hyundai Steel", "ascension", "Donaldsonville", 52_000, 74_000),
            ("Pipe Welder (TIG/MIG)", "ExxonMobil Baton Rouge", "east-baton-rouge", "Baton Rouge", 58_000, 82_000),
            ("Offshore Rig Welder", "Chevron Gulf Ops", "lafourche", "Galliano", 62_000, 90_000),
        ],
        "15-1252": [
            ("Senior Software Engineer", "AWS Caddo/Bossier", "caddo", "Shreveport", 130_000, 190_000),
            ("Site Reliability Engineer", "Meta Hyperion", "richland", "Rayville", 125_000, 180_000),
        ],
        "29-1141": [
            ("Registered Nurse — ICU", "Ochsner Medical Center", "orleans", "New Orleans", 74_000, 96_000),
            ("Registered Nurse — Oncology", "LCMC Health", "orleans", "New Orleans", 72_000, 92_000),
            ("Travel RN — Med/Surg", "Willis-Knighton", "caddo", "Shreveport", 75_000, 100_000),
        ],
        "51-8091": [
            ("Board Operator", "Sasol Lake Charles", "calcasieu", "Westlake", 82_000, 110_000),
            ("Unit Operator", "Cheniere LNG Sabine Pass", "cameron", "Cameron", 86_000, 115_000),
        ],
        "13-2011": [
            ("Senior Accountant", "Entergy Louisiana", "east-baton-rouge", "Baton Rouge", 72_000, 95_000),
        ],
    }

    async def list_postings(
        self,
        soc_code: str,
        parish_id: str | None = None,
        limit: int = 10,
    ) -> list[JobPosting]:
        tpls = self._TEMPLATES.get(soc_code, [])
        out: list[JobPosting] = []
        for idx, (title, employer, parish, city, smin, smax) in enumerate(tpls):
            if parish_id and parish_id != parish:
                continue
            out.append(
                JobPosting(
                    posting_id=f"stub-{soc_code}-{idx + 1:02d}",
                    title=title,
                    employer=employer,
                    soc_code=soc_code,
                    parish=parish,
                    city=city,
                    posted_at="2026-04-20",
                    url="https://www.laworks.net/StarJobs/",
                    summary=f"Simulated Star Jobs posting — real integration pending (STARJOBS_STUB={is_stub()}).",
                    salary_min=smin,
                    salary_max=smax,
                )
            )
            if len(out) >= limit:
                break
        return out


def is_stub() -> bool:
    return os.environ.get("STARJOBS_STUB", "true").lower() in {"1", "true", "yes"}


def get_client() -> StarJobsClient:
    # Only the stub is implemented today.
    return StubStarJobsClient()
