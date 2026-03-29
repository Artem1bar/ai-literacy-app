from fastapi import APIRouter, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from config import settings
from services.claude_service import send_message

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


class PromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000)
    model: str = Field(default="claude-sonnet-4-6-20250514")
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
    result = await send_message(
        prompt=body.prompt,
        model=body.model,
        max_tokens=body.max_tokens,
    )
    return result
