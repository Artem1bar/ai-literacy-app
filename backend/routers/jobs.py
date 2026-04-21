"""/api/jobs — thin wrapper around the Star Jobs client (P5-T4)."""

from __future__ import annotations

from fastapi import APIRouter, Query, Response

from services.starjobs_client import get_client, is_stub

router = APIRouter()


@router.get("/api/jobs")
async def list_jobs(
    response: Response,
    soc: str = Query(..., min_length=4, max_length=12),
    parishId: str | None = Query(default=None, max_length=40),
    limit: int = Query(10, ge=1, le=25),
) -> dict[str, object]:
    client = get_client()
    postings = await client.list_postings(soc, parish_id=parishId, limit=limit)
    response.headers["Cache-Control"] = "public, max-age=300"
    return {
        "soc": soc,
        "parishId": parishId,
        "stub": is_stub(),
        "count": len(postings),
        "results": [
            {
                "postingId": p.posting_id,
                "title": p.title,
                "employer": p.employer,
                "parish": p.parish,
                "city": p.city,
                "socCode": p.soc_code,
                "postedAt": p.posted_at,
                "url": p.url,
                "summary": p.summary,
                "salaryMin": p.salary_min,
                "salaryMax": p.salary_max,
            }
            for p in postings
        ],
    }
