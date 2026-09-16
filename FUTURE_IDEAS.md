# AI Literacy App — Future Ideas Dock

Parking lot for ideas that are deliberately out of scope for the current
`IMPROVEMENT_PLAN.json` but worth preserving for a later phase.

> **Ground rule:** this app has no dependency on the LSU State-of-AI-Louisiana
> research project. LSU is a reference-only methodological input; no file,
> link, or dataset crosses the repository boundary.

---

## Deferred — Not in Current Plan

### 1. Methodology Page (`/methodology`)
A dedicated, publicly-linkable page that explains exactly how each per-SOC
score is computed and what confidence qualifiers apply. Data lineage, source
citations, aggregation formulas, known limitations, and a changelog of
methodology revisions. Targeted at policy reviewers, researchers, and
skeptical journalists rather than end users.

**Status:** captured, not implemented. The score card in Phase 4 will link to
this page as `coming soon` / external explainer.

**Effort when done:** M (1 page, ~400 lines of prose, source references, two
or three computed examples).

---

## Open Questions / Research Debt

_Things that want a decision or a primary data source before they can become
concrete tasks._

- **Wage premium by SOC** — is PwC's 56% national baseline the right anchor,
  or should we derive LA-specific premiums from BLS OEWS quartile data?
- **Confidence-interval UX** — should the score card show numeric CI bands,
  qualitative labels (low/medium/high confidence), or both?
- **O*NET version pinning** — the SOC→task mapping evolves. Which O*NET
  release do we treat as canonical, and how do we version user progress
  against taxonomy changes?
- **Primary workforce survey** — running our own opt-in learner survey
  would let us publish real LA AI-literacy data independently. Design doc
  needed before this becomes a task.

---

## Stretch Capabilities (Post-Launch)

- **Employer-sponsored cohorts** — Meta, Amazon, Entergy, Hyundai could
  fund / badge curriculum tracks for their specific workforces.
- **LCTCS LMS integration** — deep-link into Blackboard / Canvas via LTI.
- **Voice-first interface** — for workers whose primary device is a phone
  on a shop floor or offshore platform.
- **AR / mixed-reality job-shadowing content** — especially for 4D-job
  SOCs (welders, process operators) where the physical context matters.
- **Anonymous peer benchmarking** — "workers in your SOC typically score X
  on this quiz" — opt-in, differentially-private.
- **Regional community of practice** — per-RLMA discussion boards so
  workers in the same labor market can share adoption experience.

---

## Parked Technical Debt

- Prompt scorer regexes in `usePromptLab.ts` are heuristic; a Claude-based
  evaluator would be more accurate but slower and more expensive.
- Module content is TS data files — at scale (200+ SOCs × ~5 personalized
  modules each), this may warrant a CMS or markdown-first content pipeline.
- `ResponseViewer` currently trims the date stamp off model names — if
  model IDs change format, the trim logic breaks silently.

---

_Last updated: 2026-04-20. Add new ideas with date + source of the idea._
