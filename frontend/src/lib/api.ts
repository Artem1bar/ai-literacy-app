import { API_URL } from "./constants"

export interface PromptRequest {
  prompt: string
  model?: string
  max_tokens?: number
}

export interface PromptResponse {
  content: string
  model: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function sendPrompt(req: PromptRequest): Promise<PromptResponse> {
  const res = await fetch(`${API_URL}/api/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: req.prompt,
      model: req.model ?? "claude-sonnet-4-6-20250514",
      max_tokens: req.max_tokens ?? 4096,
    }),
  })

  if (!res.ok) {
    if (res.status === 429) {
      throw new ApiError(
        "Rate limit reached — you can send 10 prompts per minute. Please wait a moment.",
        429,
      )
    }
    const body = await res.text().catch(() => "")
    throw new ApiError(
      `Request failed (${res.status})${body ? `: ${body}` : ""}`,
      res.status,
    )
  }

  return res.json() as Promise<PromptResponse>
}
