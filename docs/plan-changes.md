# Plan Change Log

Append-only record of scope changes against `IMPROVEMENT_PLAN.json`, per the
`executionContract.changeLogLocation` rule.

Each entry: date • phase/task • change • reason.

---

## 2026-04-21 — P0-T3 — Playwright deferred to manual run

**Change:** Playwright config (`frontend/playwright.config.ts`) and E2E spec
(`frontend/tests/e2e/lab.spec.ts`) are committed and wired into `pnpm`, but
browser binaries are **not** installed in this pass and the suite is **not**
executed as part of overnight CI.

**Reason:** `playwright install chromium` pulls ~300 MB of binaries; the
round-trip also needs a live backend with `ANTHROPIC_API_KEY` configured to
prove the full chain. The vitest hook-level test and the pytest router-level
test together cover the units called out in the plan's acceptance criteria;
the Playwright spec lies in wait for a one-off manual run with:

```bash
cd frontend
pnpm exec playwright install chromium
pnpm exec playwright test
```

**Follow-up:** promote this to automated CI in Phase 6 when the backend is
deployed to Fly.io (P6-T9) and a long-lived test API key exists.

---

## 2026-04-21 — P1-T5 — SQLite deferred; JSON-first data layer

**Change:** The backend data layer is implemented as versioned JSON files
under `backend/data/` rather than SQLite. Schema, seed, and loader interfaces
are structured so a SQLite/SQLAlchemy migration is a drop-in later.

**Reason:** The plan explicitly permits this (`"Introduce SQLite (or JSON
files if simpler)"`). At MVP scale (~60 priority SOCs, ~40 glossary terms, 8
RLMAs, 64 parishes), a relational store adds ingest-script complexity without
payoff. JSON also keeps the store entirely in-repo/version-controlled, which
satisfies the `dataSources.ingestion: "idempotent; reproducible"` requirement
with a diff instead of a migration.

**Follow-up:** revisit when the SOC corpus expands beyond the priority set or
when `/analytics` (P6-T4) needs persistent writes. Schema is sketched in
`DATA.md` to make the SQLite transition a 1-day task.

---

## 2026-04-21 — P2 ingest — Aggregate-source approach instead of raw CSV

**Change:** Per-SOC score cards are authored from published aggregate
statistics (BLS OEWS LA 2025 summary tables, Eloundou Appendix B aggregated
figures, Anthropic Economic Index 2025 reports) plus domain-expert
extrapolation, rather than reproducing the Eloundou 1,016-task-level
aggregation from raw CSVs.

**Reason:** The raw Eloundou task data and the BLS OEWS LA microdata are not
checked into this repo and cannot be programmatically fetched during an
autonomous run. Published aggregates are authoritative enough for MVP scoring
with `confidence: 'medium'` or `'low'` qualifiers, and each number is cited.
The plan's invariant (`augmentation + replacement ≈ exposure`) is enforced
by the score-card author, not by an aggregation script.

**Follow-up:** add `backend/scripts/ingest_eloundou.py` as a real ingestion
pipeline when raw data is dropped under `/research/eloundou/`. Current
authored values become the baseline the script validates against.
