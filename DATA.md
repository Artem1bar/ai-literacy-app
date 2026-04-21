# AI Literacy App — Data Methodology

Engineering reference for how every per-SOC score, skill bundle, and
learning path in this codebase is constructed. For the *public* methodology
explainer (policy-reviewer target), see `/methodology` (queued in
`FUTURE_IDEAS.md` for a post-MVP phase).

This document satisfies `IMPROVEMENT_PLAN.json` task **P2-T5**.

---

## 1. Sources

Every number surfaced to the user carries an in-record citation pointing
back to one of the sources below. Source IDs match the `dataSources` block
of the improvement plan.

| Source ID | Use | Licensing | Refresh Cadence |
|-----------|-----|-----------|-----------------|
| `eloundou-2024` | Task-level AI exposure labels aggregated to SOC | Published in Science; task-level appendix freely available | Static (one-time snapshot) |
| `anthropic-economic-index-2025` | Augmentation-vs-automation split per occupation | Anthropic public dataset | Annual |
| `pwc-ai-jobs-barometer-2025` | Baseline wage premium for AI-skilled roles (56% national) | Publicly reported aggregate | Annual (PwC release) |
| `bls-oews-la-2025` | LA employment count, LA median wage, wage percentiles | Public domain (U.S. BLS) | Annual |
| `onet-28` | SOC → tasks/skills/tools taxonomy | Public domain (DOL) | Rolling (semi-annual) |
| `long-magerko-2020` | Three-dimensional AI literacy framework | Academic publication | Static |
| `led-opportunitylouisiana` | Megaproject metadata, parish-level investment | Government press releases | Ad-hoc |

When raw source data lands under `research/<source>/` (gitignored), the
matching `backend/scripts/ingest_*.py` script records the SHA-256 in
`backend/data/checksums.json` for reproducibility.

---

## 2. Score Card Computation

Each SOC's score card exposes four metrics. Every metric publishes a
`value` (0-100), a `confidence` qualifier (`low`/`medium`/`high`), a
`source` citation, and a `lastComputed` ISO date.

### 2.1 Exposure (source: `eloundou-2024`)

Definition: the fraction of this occupation's tasks for which an LLM can
plausibly perform at least part of the task. Formally, the mean of
Eloundou et al.'s binary exposure label across every O*NET task mapped to
the SOC.

At MVP, values are authored directly from the paper's published aggregate
tables with the following confidence rubric:

- **high**: exposure is within the paper's top-25 most-studied SOCs.
- **medium**: exposure is derivable from a sector-level aggregate in the
  paper, or from a closely related SOC within the same broad category.
- **low**: exposure is inferred from a coarser O*NET job family.

### 2.2 Augmentation (source: `anthropic-economic-index-2025`)

Definition: the share of exposed tasks where AI makes a human worker
faster or better, rather than replacing them.

National calibration: **≈57% of AI-assisted activity** is augmentation
per the Anthropic Economic Index 2025 (vs. 43% automation). Per-SOC values
lean on the Index's occupation-category splits; where the Index reports a
category directly, we inherit its value (confidence = medium). Where we
must map a broad Index category to a narrow SOC, confidence drops to low.

### 2.3 Replacement / Automation (source: `anthropic-economic-index-2025`)

Definition: the share of exposed tasks where AI substitutes for human
labour.

Computed as exposure × (1 - augmentation_share_within_exposure). The same
source and confidence rubric as augmentation apply.

### 2.4 Wage Premium (source: `pwc-ai-jobs-barometer-2025` + `bls-oews-la-2025`)

Definition: the estimated percent uplift in pay for AI-skilled workers
in the SOC versus their non-AI-skilled peers.

MVP method:
1. Start from PwC's 56% national baseline premium.
2. Adjust up/down per occupation using a multiplier derived from the
   BLS OEWS LA 90th/50th-percentile wage spread — wider spreads tolerate
   larger AI-skill premiums; narrower spreads compress them.
3. Confidence is `medium` when both source figures are directly
   available, `low` when either is imputed.

The dollar-value uplift rendered on the UI is
`laMedianWage × (wagePremium / 100)`, rounded to the nearest $100.

### 2.5 Invariant

`augmentation + replacement` should track `exposure` within ±15 %.
`backend/scripts/build_priority_occupations.py::check_score_invariant`
enforces this and the CI test
`tests/test_build_priority_occupations.py::test_every_spec_passes_score_invariant`
fails the build if any SOC drifts further than tolerance.

---

## 3. Skill Bundle Construction

Every SOC receives a `skillBundle` with four sub-lists:
`technical`, `critical`, `ethical`, and `domainSpecific` — three sourced
from the Long & Magerko (2020) literacy framework plus one SOC-specific
track grounded in O*NET tasks.

### 3.1 Composition

Each bundle is built by
`backend/scripts/build_priority_occupations.py::build_skill_bundle` from:

1. **GENERAL_TECHNICAL / GENERAL_CRITICAL / GENERAL_ETHICAL** — shared
   cross-occupation skills that apply to every role (structured
   prompting, hallucination verification, data-governance hygiene).
2. **Sector template** — 3-5 additional skills keyed by sector (energy,
   manufacturing, healthcare, technology, logistics, construction,
   education, finance, public admin, retail/hospitality).
3. **SOC-specific `extraSkills`** — optional additions in each SOC's spec
   for idiosyncratic needs (e.g. robotics-engineer humanoid programming).

Each `SkillItem` has a `priority` of `core`, `supporting`, or `stretch`
and an optional `anchorTask` (O*NET) or `glossarySlug` (internal
glossary) cross-reference.

### 3.2 Coverage guarantees

The unit test
`test_every_spec_covers_three_literacy_dimensions` enforces **≥2 items
per dimension** for every published SOC. In practice the MVP corpus
averages 3 technical + 3 critical + 3 ethical + 1-2 domain-specific.

### 3.3 Validation

`tests/test_build_priority_occupations.py` re-validates every generated
record against the `Occupation` Pydantic schema, so schema drift is
caught at CI time before the JSON files are written.

---

## 4. Learning Path Derivation

Every SOC resolves to a 3-7 module path under `learningPath`. Paths are
built from the five existing modules in `frontend/src/data/modules.ts`:

| Module ID | Covers | Est. Minutes |
|-----------|--------|--------------|
| `ai-fundamentals` | technical | 25 |
| `prompt-engineering` | technical | 35 |
| `claude-workflows` | technical, domain-specific | 30 |
| `responsible-ai` | critical, ethical | 25 |
| `practical-workflows` | domain-specific | 20 |

MVP defaults use a **4-module standard path**
(`ai-fundamentals → prompt-engineering → responsible-ai →
practical-workflows`) for non-developer roles and a **5-module developer
path** (inserting `claude-workflows` after `prompt-engineering`) for
software, robotics, and data-center operations roles.

`estimatedTotalMinutes` is the sum across modules. The plan's invariant
("≤ 360 minutes") is met by every MVP SOC.

A future pass can refine paths further by analysing each SOC's
`skillBundle` coverage gaps and reordering — the current implementation is
a curated default that's still hand-traceable.

---

## 5. Confidence Rubric — Quick Reference

| Confidence | Condition | Visual treatment |
|------------|-----------|------------------|
| `high` | Direct published data for the exact SOC | Green badge |
| `medium` | Sector-mean with documented adjustment OR related-SOC proxy with small extrapolation | Amber badge |
| `low` | Inferred from a coarser category, a single source, or an analogy | Red outline badge |

Every UI surface that displays a metric **must** surface its confidence
badge alongside the number.

---

## 6. Known Limitations

- **Raw Eloundou task data not in repo.** Aggregate figures cited from
  the paper's published tables suffice for MVP with `medium`/`low`
  confidence labels. Replacing this with live CSV aggregation is queued
  under `backend/scripts/ingest_eloundou.py`.
- **O*NET anchor tasks sparse.** Only a few domain-specific skills cite
  exact O*NET task ids (e.g. `17-2199.01 task 12`). Filling this in is a
  content-research pass, not an engineering change.
- **PwC wage premium is a national baseline.** The LA-specific
  derivation is an OEWS-derived multiplier; the open question (should
  we compute an independent LA premium?) is tracked in
  `FUTURE_IDEAS.md`.
- **Anthropic Economic Index augmentation split is category-level.**
  Narrow SOCs within a broad category inherit the category value; this
  is reflected by a lower `augmentation` confidence.

---

## 7. Per-SOC Revision Log

Track material changes to any SOC's `scoreCard`, `skillBundle`, or
`learningPath` here, or in a future `backend/data/revision_log.jsonl`
append-only file when the methodology revisions schema ships.

| Date | SOC | Metric | Old Value | New Value | Reason |
| ---- | --- | ------ | --------- | --------- | ------ |
| 2026-04-21 | (corpus-wide) | — | — | — | Initial MVP authoring of 26 priority SOCs. |

---

## 8. Regenerating the Corpus

```bash
cd backend
uv run python -m scripts.build_priority_occupations

# Verify
uv run pytest tests/test_build_priority_occupations.py -v
```

Running the builder is idempotent: unchanged specs produce no `git diff`.
Every occupation JSON file is regenerated from the in-script specs — the
files themselves are an artefact, not a hand-edited source of truth.
