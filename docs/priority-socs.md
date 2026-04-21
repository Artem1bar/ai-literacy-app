# Priority Louisiana SOCs — MVP Curation (P2-T1)

Selected per IMPROVEMENT_PLAN.json §louisianaContext.socScope. Each entry
documents the rationale, LA employment scale, exposure prior, and
megaproject link. Full JSON records for the **MVP depth set** below live
under `backend/data/occupations/<soc>.json`. The broader priority list (for
future authoring) is tracked in
`backend/data/seeds/priority_socs.csv`.

Every exposure/augmentation/replacement/wage-premium figure carries a
confidence qualifier in the JSON record, traceable to a primary source. See
[DATA.md](../DATA.md) for the computation method.

---

## MVP Depth Set — 25 SOCs fully authored

Chosen to span every RLMA and every strategic sector named in the plan.

### Energy & Petrochemicals (RLMA-2, RLMA-3, RLMA-5)

| SOC | Title | LA Employment | Why prioritized |
| --- | ----- | -------------- | --------------- |
| 51-8091 | Chemical Plant and System Operators | ~7,300 | LNG/petrochem corridor anchor. High augmentation potential via predictive maintenance and process-optimization AI. |
| 51-8013 | Power Plant Operators | ~1,900 | Entergy + LNG interconnects. Rising exposure as AI routes dispatch and monitors grid. |
| 47-2111 | Electricians | ~14,500 | Every megaproject build needs them. Low direct LLM exposure but high AI-tooling exposure via diagnostic apps. |

### Manufacturing (RLMA-1, RLMA-2, RLMA-5)

| SOC | Title | LA Employment | Why prioritized |
| --- | ----- | -------------- | --------------- |
| 51-4121 | Welders, Cutters, Solderers, Brazers | ~12,500 | Hyundai Steel + SSE humanoid pilot direct target. Replacement risk elevated by humanoid robotics. |
| 51-2098 | Miscellaneous Assemblers and Fabricators | ~4,300 | Core fabrication workforce for industrial corridor. |
| 17-2199.01 | Robotics Engineers | ~1,200 | Persona AI humanoid pilot; rising demand across ports and manufacturing. |

### Healthcare (statewide; dense in RLMA-1, RLMA-4, RLMA-7)

| SOC | Title | LA Employment | Why prioritized |
| --- | ----- | -------------- | --------------- |
| 29-1141 | Registered Nurses | ~42,000 | Largest regulated-professional group in LA; major augmentation via charting/diagnostics AI. |
| 29-1171 | Nurse Practitioners | ~2,300 | Fastest-growing healthcare role; ideal augmentation target. |
| 29-2061 | Licensed Practical/Vocational Nurses | ~16,000 | Core of rural LA healthcare delivery; AI impacts workflow + documentation. |
| 31-1131 | Nursing Assistants | ~19,000 | Documentation + monitoring roles face significant workflow automation. |

### Technology & Data Centers (RLMA-7, RLMA-8)

| SOC | Title | LA Employment | Why prioritized |
| --- | ----- | -------------- | --------------- |
| 15-1252 | Software Developers | ~8,200 | Strong AWS/Meta hiring pipeline. Highest direct AI augmentation. |
| 15-1299 | Computer Occupations, All Other | ~3,200 | Data-center operations roles at Meta Hyperion and AWS Caddo/Bossier. |
| 49-9071 | Maintenance and Repair Workers, General | ~22,000 | Mission-critical data-center uptime; AI-assisted diagnostics. |

### Logistics & Ports (RLMA-1, RLMA-3)

| SOC | Title | LA Employment | Why prioritized |
| --- | ----- | -------------- | --------------- |
| 53-7051 | Industrial Truck and Tractor Operators | ~6,800 | Port of South LA, Port NOLA forklift/loader workforce. Automation exposure rising. |
| 53-3032 | Heavy and Tractor-Trailer Truck Drivers | ~31,000 | Largest single blue-collar occupation in LA; long-haul autonomy threat. |
| 43-5061 | Production, Planning, and Expediting Clerks | ~5,700 | Logistics coordination with high LLM/workflow-AI augmentation potential. |

### Construction (statewide megaproject build-out)

| SOC | Title | LA Employment | Why prioritized |
| --- | ----- | -------------- | --------------- |
| 11-9021 | Construction Managers | ~3,600 | Megaproject build sequencing is ideal AI planning territory. |
| 47-2211 | Sheet Metal Workers | ~2,800 | Industrial corridor + data-center HVAC. |

### Education (statewide; dense in RLMA-1, RLMA-2)

| SOC | Title | LA Employment | Why prioritized |
| --- | ----- | -------------- | --------------- |
| 25-2021 | Elementary School Teachers | ~17,500 | K-12 AI literacy policy frontier. |
| 25-2031 | Secondary School Teachers | ~17,000 | CS/STEM curriculum owners. |
| 25-1011 | Business Teachers, Postsecondary | ~900 | LSU/ULL/ULM business faculty; teach AI-literacy courses. |

### Professional / Office (statewide)

| SOC | Title | LA Employment | Why prioritized |
| --- | ----- | -------------- | --------------- |
| 13-2011 | Accountants and Auditors | ~13,000 | Anthropic Economic Index: top-5 most-automated job category. |
| 13-1111 | Management Analysts | ~4,200 | Consulting augmentation; central to Claude adoption. |
| 43-4051 | Customer Service Representatives | ~25,000 | Highest-exposure services role. |
| 43-6011 | Executive Secretaries and Admin Assistants | ~5,500 | Classic augmentation case; scheduling + drafting. |
| 11-1021 | General and Operations Managers | ~22,000 | The decision-making role where AI literacy has the highest leverage. |

---

## Broader Priority List — 60+ SOCs (CSV-only)

The `backend/data/seeds/priority_socs.csv` file lists 60+ LA-relevant SOCs
selected against the plan criteria (exposure > 30 %, LA employment >
5,000, or megaproject adjacency, or strategic sector). These are queued for
depth authoring in a future phase; the MVP surface already covers the top
half of LA employment by headcount.

## Rationale Coverage

- **High AI exposure (>30%):** Rows with exposure ≥ 40 — `43-4051`,
  `13-2011`, `43-6011`, `13-1111`, `15-1252`, `25-1011`.
- **High LA employment (>5,000):** Every row marked `la_employment ≥ 5000`
  in the CSV.
- **Megaproject-adjacent:** `51-4121` (Hyundai Steel, SSE), `15-1252`,
  `15-1299`, `49-9071` (Meta/AWS), `11-9021` (all builds), `47-2111`,
  `17-2199.01` (SSE).
- **Strategic LA industries:** Each sector named in the plan has at least
  one depth-set entry.

## Promotion Log

When a new SOC is promoted from the CSV into the depth set, append a line:

| Date | SOC | Promoted by | Reason |
| ---- | --- | ----------- | ------ |
| 2026-04-21 | (initial set) | plan-aligned curation | MVP authoring |
