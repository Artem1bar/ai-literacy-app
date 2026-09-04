import anthropic
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from config import settings
from services.claude_service import send_message


def client_ip(request: Request) -> str:
    """Rate-limit key: the first hop in X-Forwarded-For when behind a proxy.

    On Vercel (and most hosts) `request.client.host` is the proxy, so keying
    on it alone would make every visitor share one bucket.
    """
    forwarded = request.headers.get("x-forwarded-for", "")
    first_hop = forwarded.split(",")[0].strip()
    return first_hop or get_remote_address(request)


limiter = Limiter(key_func=client_ip)
router = APIRouter()

LAB_NOT_CONFIGURED = {
    "error": "lab_not_configured",
    "message": "The Prompt Lab backend has no ANTHROPIC_API_KEY configured.",
}


class PromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000)
    model: str = Field(default="claude-sonnet-4-6")
    max_tokens: int = Field(default=4096, ge=1, le=4096)


class UsageInfo(BaseModel):
    input_tokens: int
    output_tokens: int


class PromptResponse(BaseModel):
    content: str
    model: str
    usage: UsageInfo


@router.post("/api/prompt", response_model=PromptResponse)
@limiter.limit(settings.rate_limit)
async def handle_prompt(request: Request, body: PromptRequest):
    if not settings.anthropic_api_key:
        raise HTTPException(status_code=503, detail=LAB_NOT_CONFIGURED)
    try:
        return await send_message(
            prompt=body.prompt,
            model=body.model,
            max_tokens=body.max_tokens,
        )
    except anthropic.AuthenticationError as exc:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "lab_not_configured",
                "message": "The backend's Anthropic API key was rejected.",
            },
        ) from exc
    except anthropic.RateLimitError as exc:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "upstream_rate_limited",
                "message": "Claude is rate-limiting this backend right now — try again in a moment.",
            },
        ) from exc
    except anthropic.APIStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error": "upstream_error",
                "message": f"Claude returned an error ({exc.status_code}).",
            },
        ) from exc
    except anthropic.APIConnectionError as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error": "upstream_unreachable",
                "message": "Couldn't reach the Claude API from the backend.",
            },
        ) from exc
