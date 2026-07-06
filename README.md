# AI Literacy App

**Live:** [ai-literacy-app-seven.vercel.app](https://ai-literacy-app-seven.vercel.app)

A research-backed, role-adaptive platform for learning AI literacy — covering how LLMs work, prompt engineering, Claude workflows, and responsible AI use. Content adapts to your role: student, professor, or developer.

## Features

- **Role-adaptive learning** — select your role (student, professor, developer) and content adjusts depth and framing accordingly
- **Structured modules** — guided lessons on AI fundamentals, prompt frameworks, templates, and practical Claude workflows; each module includes readings, callouts, quizzes, and hands-on exercises
- **Prompt Lab** — live sandbox to experiment with prompts directly against Claude; adjust model and max tokens
- **Resources** — curated links, further reading, and reference material organized by topic
- **Progress tracking** — role and progress state persisted locally via Zustand + localStorage
- **Rate-limited backend** — FastAPI proxy keeps the Anthropic API key server-side; per-IP rate limiting via slowapi

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui |
| State | Zustand (persist middleware) + TanStack Query |
| Routing | React Router v7 |
| Backend | FastAPI (Python), uvicorn |
| AI | Claude (via secure backend proxy) |
| Deployment | Vercel (frontend), configurable backend |

## Project Structure

```
frontend/
├── src/
│   ├── components/   # Layout, learn, lab, home, resources, profile, ui
│   ├── data/         # All content as TypeScript data files (modules, templates, resources)
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # API client, utilities, constants
│   ├── pages/        # Home, Learn, Module, Lab, Resources, Profile
│   └── store/        # Zustand stores
backend/
├── routers/          # FastAPI route handlers (health, prompt)
├── services/         # Claude API client
└── config.py         # Settings via env vars
```

## Local Development

### Frontend

```bash
cd frontend
pnpm install
pnpm dev          # http://localhost:5173
```

### Backend

```bash
cd backend
uv sync
cp .env.example .env   # set ANTHROPIC_API_KEY and ALLOWED_ORIGINS
uv run uvicorn main:app --reload   # http://localhost:8000
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key (server-side only, never exposed to frontend) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins |
| `RATE_LIMIT` | slowapi rate limit string, e.g. `20/minute` |

## Adding Content

All module content lives in `frontend/src/data/` as TypeScript data files — no component changes needed:

- `modules.ts` — learning modules with sections, blocks (paragraphs, callouts, quizzes, lists)
- `prompt-frameworks.ts` — prompt engineering frameworks
- `prompt-templates.ts` — reusable prompt templates
- `resources.ts` — curated external links
- `user-roles.ts` — role definitions and display config
