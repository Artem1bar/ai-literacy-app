# Backend data layer

This directory is the source of truth for every per-SOC occupation record,
glossary term, curriculum path, and data-source checksum the backend serves.

## Layout

```
backend/data/
├── README.md                        (this file)
├── checksums.json                   manifest of source-file SHA-256s
├── occupations/                     one JSON file per SOC (P2 populates)
│   └── <soc-code>.json
├── seeds/                           curation inputs & mappings
│   ├── priority_socs.csv            P2-T1 output
│   └── sector_defaults.json         sector-mean fallback values
└── migrations/                      forward-compatible DDL when we move to SQLite
    └── 0001_init.sql
```

## Why JSON (not SQLite) at MVP

The improvement plan explicitly allows JSON *or* SQLite at P1-T5. At MVP
scale (~60 priority SOCs, ~45 glossary terms, 8 RLMAs, 64 parishes), JSON
keeps the entire corpus in-repo and diffable. Every record change is a
human-reviewable git diff. `migrations/0001_init.sql` mirrors the shape so
the transition to SQLite is a one-day task when scale or writes demand it.

## Refreshing data

1. Drop authoritative CSVs under `/research/<source>/` (gitignored).
2. Run `uv run python scripts/ingest_<source>.py`.
3. The script writes new JSON files + updates `checksums.json`.
4. `git diff backend/data/` is the review artifact.

Every ingest script is idempotent — re-running against unchanged source
data produces no diff.
