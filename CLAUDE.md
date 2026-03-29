# AI Literacy Interactive Web App

## Purpose
Research-backed, role-adaptive web app teaching AI literacy, prompt engineering, Claude workflows, and responsible AI use to students, professors, and developers.

## Tech Stack
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Routing**: React Router v7
- **State**: Zustand (persist middleware for localStorage) + React Query
- **Backend**: FastAPI (Python) — thin proxy for Claude API
- **AI Model**: Claude Sonnet 4.6 (`claude-sonnet-4-6`) via backend proxy

## Folder Conventions
- `frontend/src/data/` — all content (modules, templates, resources) as TypeScript data files
- `frontend/src/components/` — organized by feature: layout, learn, lab, home, resources, profile, ui
- `frontend/src/store/` — Zustand stores with persist middleware
- `frontend/src/hooks/` — custom React hooks
- `frontend/src/lib/` — utilities, API client, constants
- `backend/routers/` — FastAPI route handlers
- `backend/services/` — business logic (Claude API client)

## Critical Rules
- **NEVER expose the Anthropic API key in frontend code** — all Claude API calls go through the FastAPI backend proxy
- All module content must be editable from `src/data/` files without touching components
- Role selection persists via localStorage (Zustand persist middleware)
- External links must use `target="_blank" rel="noopener noreferrer"`
- Dark mode is the default theme (`.dark` class on `<html>`)
- All pages must be mobile-responsive

## Commands
- Frontend dev: `cd frontend && pnpm dev`
- Backend dev: `cd backend && uv run uvicorn main:app --reload`
- Type check: `cd frontend && pnpm tsc --noEmit`
