-- Phase 5 (P5-T5) — Employer partnership data layer.
--
-- Scaffolds the post-launch cohort feature described in FUTURE_IDEAS.md.
-- Supports N-to-M employer ↔ SOC ↔ module_override relationships. No UI
-- surface in v1; API-only for now.

CREATE TABLE IF NOT EXISTS employer_track (
    id                TEXT PRIMARY KEY,
    employer_id       TEXT NOT NULL,                  -- matches louisiana.ts Employer.id
    name              TEXT NOT NULL,                  -- e.g. "Amazon AWS Data Center Ops"
    description       TEXT NOT NULL,
    created_at        TEXT NOT NULL,
    status            TEXT NOT NULL                   -- draft | active | archived
         CHECK (status IN ('draft', 'active', 'archived'))
);

CREATE TABLE IF NOT EXISTS employer_track_soc (
    track_id          TEXT NOT NULL REFERENCES employer_track (id) ON DELETE CASCADE,
    soc_code          TEXT NOT NULL,
    priority          INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (track_id, soc_code)
);

CREATE TABLE IF NOT EXISTS employer_track_module_override (
    track_id          TEXT NOT NULL REFERENCES employer_track (id) ON DELETE CASCADE,
    base_module_id    TEXT NOT NULL,
    override_title    TEXT,
    override_summary  TEXT,
    order_idx         INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (track_id, base_module_id)
);

CREATE INDEX IF NOT EXISTS employer_track_employer_idx
    ON employer_track (employer_id);

CREATE INDEX IF NOT EXISTS employer_track_soc_employer_idx
    ON employer_track_soc (soc_code);
