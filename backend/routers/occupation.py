"""HTTP routes for occupation + curriculum data (P1-T6)."""

from __future__ import annotations

from fastapi import APIRouter, Header, HTTPException, Query, Response

from services import occupation_service

router = APIRouter()

CACHE_CONTROL_1H = "public, max-age=3600"


@router.get("/api/occupations/search")
async def search_occupations(
    q: str = Query(..., min_length=1, max_length=80),
    limit: int = Query(25, ge=1, le=100),
) -> dict[str, object]:
    hits = occupation_service.search_occupations(q, limit=limit)
    return {
        "query": q,
        "count": len(hits),
        "results": [
            {
                "code": occ.code,
                "title": occ.title,
                "jobFamily": occ.jobFamily,
                "laEmployment": occ.laEmployment,
                "laMedianWage": occ.laMedianWage,
                "exposure": occ.scoreCard.exposure.value,
                "exposureConfidence": occ.scoreCard.exposure.confidence,
                "topRLMAs": sorted(
                    occ.rlmaDistribution.items(),
                    key=lambda item: -item[1],
                )[:3],
            }
            for occ in hits
        ],
    }


@router.get("/api/occupations")
async def list_occupations(
    response: Response,
    priority_only: bool = Query(False, alias="priorityOnly"),
) -> dict[str, object]:
    occupations = occupation_service.list_occupations()
    if priority_only:
        occupations = [o for o in occupations if o.laEmployment and o.laEmployment >= 5_000]
    response.headers["Cache-Control"] = CACHE_CONTROL_1H
    return {
        "count": len(occupations),
        "results": [
            {
                "code": occ.code,
                "title": occ.title,
                "jobFamily": occ.jobFamily,
                "laEmployment": occ.laEmployment,
                "laMedianWage": occ.laMedianWage,
                "sectorIds": occ.sectorIds,
                "exposure": occ.scoreCard.exposure.value,
                "augmentation": occ.scoreCard.augmentation.value,
                "replacement": occ.scoreCard.replacement.value,
                "wagePremium": occ.scoreCard.wagePremium.value,
            }
            for occ in occupations
        ],
    }


@router.get("/api/occupation/{code}")
async def get_occupation(
    code: str,
    response: Response,
    if_none_match: str | None = Header(default=None, alias="If-None-Match"),
) -> dict[str, object]:
    occ = occupation_service.get_occupation(code)
    if occ is None:
        raise HTTPException(
            status_code=404,
            detail={"error": "occupation_not_found", "code": code},
        )
    etag = occupation_service.etag_for(occ)
    response.headers["ETag"] = etag
    response.headers["Cache-Control"] = CACHE_CONTROL_1H
    if if_none_match == etag:
        raise HTTPException(status_code=304, detail="Not Modified")
    dollar_premium = occupation_service.compute_dollar_wage_premium(occ)
    return {
        **occ.model_dump(),
        "derived": {"wagePremiumDollars": dollar_premium},
    }


@router.get("/api/curriculum/{code}")
async def get_curriculum(
    code: str,
    response: Response,
) -> dict[str, object]:
    path = occupation_service.get_curriculum(code)
    if path is None:
        raise HTTPException(
            status_code=404,
            detail={"error": "curriculum_not_found", "code": code},
        )
    response.headers["Cache-Control"] = CACHE_CONTROL_1H
    return path.model_dump()
