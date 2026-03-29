from anthropic import AsyncAnthropic

from config import settings

client = AsyncAnthropic(api_key=settings.anthropic_api_key)


async def send_message(
    prompt: str,
    model: str = "claude-sonnet-4-6-20250514",
    max_tokens: int = 4096,
) -> dict:
    response = await client.messages.create(
        model=model,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}],
    )
    return {
        "content": response.content[0].text,
        "model": response.model,
        "usage": {
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
        },
    }
