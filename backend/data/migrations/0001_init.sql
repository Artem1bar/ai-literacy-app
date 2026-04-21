-- Phase 1 (P1-T5) reference schema.
--
-- Not yet executed — the live data layer serves from JSON under
-- `backend/data/occupations/*.json`. This DDL mirrors the JSON shape so a
-- future SQLite migration is mechanical: load each JSON file into the
-- matching table and run this script.

CREATE TABLE IF NOT EXISTS occupation (
    code            TEXT PRIMARY KEY,               -- 6-digit SOC, e.g. "51-4121"
    title           TEXT NOT NULL,
    job_family      TEXT NOT NULL,
    summary         TEXT NOT NULL,
    la_employment   INTEGER,                        -- nullable — BLS suppresses some cells
    la_median_wage  INTEGER,
    last_reviewed   TEXT NOT NULL                   -- ISO date
);

CREATE INDEX IF NOT EXISTS occupation_title_idx ON occupation (title);
CREATE INDEX IF NOT EXISTS occupation_family_idx ON occupation (job_family);

CREATE TABLE IF NOT EXISTS occupation_rlma_distribution (
    occupation_code TEXT NOT NULL REFERENCES occupation (code) ON DELETE CASCADE,
    rlma_id         TEXT NOT NULL,                  -- RLMA-1 .. RLMA-8
    percentage      REAL NOT NULL,                  -- 0..100
    PRIMARY KEY (occupation_code, rlma_id)
);

CREATE TABLE IF NOT EXISTS occupation_sector (
    occupation_code TEXT NOT NULL REFERENCES occupation (code) ON DELETE CASCADE,
    sector_id       TEXT NOT NULL,
    PRIMARY KEY (occupation_code, sector_id)
);

CREATE TABLE IF NOT EXISTS occupation_related (
    occupation_code         TEXT NOT NULL REFERENCES occupation (code) ON DELETE CASCADE,
    related_occupation_code TEXT NOT NULL,
    PRIMARY KEY (occupation_code, related_occupation_code)
);

CREATE TABLE IF NOT EXISTS occupation_employer (
    occupation_code TEXT NOT NULL REFERENCES occupation (code) ON DELETE CASCADE,
    employer_id     TEXT NOT NULL,
    PRIMARY KEY (occupation_code, employer_id)
);

CREATE TABLE IF NOT EXISTS score_card (
    occupation_code TEXT NOT NULL REFERENCES occupation (code) ON DELETE CASCADE,
    metric          TEXT NOT NULL,                  -- exposure | augmentation | replacement | wagePremium
    value           REAL NOT NULL,
    confidence      TEXT NOT NULL,                  -- low | medium | high
    source_id       TEXT NOT NULL,
    source_label    TEXT NOT NULL,
    source_url      TEXT,
    source_as_of    TEXT NOT NULL,
    last_computed   TEXT NOT NULL,
    note            TEXT,
    PRIMARY KEY (occupation_code, metric)
);

CREATE TABLE IF NOT EXISTS skill_item (
    id              TEXT PRIMARY KEY,
    occupation_code TEXT NOT NULL REFERENCES occupation (code) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    summary         TEXT NOT NULL,
    dimension       TEXT NOT NULL,                  -- technical | critical | ethical | domain-specific
    priority        TEXT NOT NULL,                  -- core | supporting | stretch
    anchor_task     TEXT,
    glossary_slug   TEXT
);

CREATE INDEX IF NOT EXISTS skill_item_occ_dim_idx
    ON skill_item (occupation_code, dimension);

CREATE TABLE IF NOT EXISTS learning_path_module (
    occupation_code TEXT NOT NULL REFERENCES occupation (code) ON DELETE CASCADE,
    order_idx       INTEGER NOT NULL,
    module_id       TEXT NOT NULL,
    rationale       TEXT NOT NULL,
    PRIMARY KEY (occupation_code, order_idx)
);

CREATE TABLE IF NOT EXISTS data_source (
    id              TEXT PRIMARY KEY,
    label           TEXT NOT NULL,
    url             TEXT,
    as_of           TEXT NOT NULL,
    sha256          TEXT,
    notes           TEXT
);

CREATE TABLE IF NOT EXISTS methodology_revision (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at         TEXT NOT NULL,
    occupation_code    TEXT,                        -- null = corpus-wide
    metric             TEXT,                        -- null = non-metric revision
    reason             TEXT NOT NULL,
    previous_value     TEXT,
    new_value          TEXT
);
