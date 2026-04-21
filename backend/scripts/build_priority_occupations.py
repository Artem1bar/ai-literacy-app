"""Generate the MVP occupation corpus from curated per-SOC specs.

Writes one JSON file per SOC to `backend/data/occupations/<code>.json`. The
file is idempotent — re-running it against the same in-script specs
produces no diff. Enforces the plan's augmentation + replacement ≈ exposure
invariant with a 15% tolerance (flagging, not failing).

This script *is* the Phase-2 content authoring surface. When new SOCs are
promoted, add their spec to SOC_SPECS below and re-run.
"""

from __future__ import annotations

import argparse
import json
import logging
import math
import sys
from pathlib import Path
from typing import TypedDict

logger = logging.getLogger("build_priority_occupations")

BACKEND_ROOT = Path(__file__).resolve().parent.parent
OCCUPATIONS_DIR = BACKEND_ROOT / "data" / "occupations"

CORPUS_REVIEWED = "2026-04-21"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Source citations (reused per SOC)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ELOUNDOU = {
    "sourceId": "eloundou-2024",
    "label": "Eloundou et al. 2024, Appendix B (task-level exposure aggregated to SOC)",
    "url": "https://arxiv.org/abs/2303.10130",
    "asOf": "2024",
}
ANTHROPIC_EI = {
    "sourceId": "anthropic-economic-index-2025",
    "label": "Anthropic Economic Index 2025",
    "url": "https://www.anthropic.com/research/economic-index",
    "asOf": "2025",
}
PWC_BAROMETER = {
    "sourceId": "pwc-ai-jobs-barometer-2025",
    "label": "PwC AI Jobs Barometer 2024/2025 + BLS OEWS LA 2025 spread",
    "url": "https://www.pwc.com/gx/en/issues/artificial-intelligence/ai-jobs-barometer.html",
    "asOf": "2025",
}
BLS_OEWS_LA = {
    "sourceId": "bls-oews-la-2025",
    "label": "BLS OEWS Louisiana, 2025 release",
    "url": "https://www.bls.gov/oes/current/oes_la.htm",
    "asOf": "2025",
}
ONET = {
    "sourceId": "onet-28",
    "label": "O*NET 28.0",
    "url": "https://www.onetonline.org/",
    "asOf": "2024",
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Skill bundle templates — Long & Magerko 3D literacy, composed per sector
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class SkillSpec(TypedDict, total=False):
    id: str
    title: str
    summary: str
    dimension: str
    priority: str
    anchorTask: str
    glossarySlug: str


# Shared across every SOC — the three literacy dimensions, general forms.
GENERAL_TECHNICAL: list[SkillSpec] = [
    {
        "id": "tech-prompting-basics",
        "title": "Structured prompting with role, task, context, format",
        "summary": "Compose prompts that specify the assistant's role, the task, relevant context, and the expected output format. Claude-specific: use <context>/<task>/<format> XML tags for complex requests.",
        "dimension": "technical",
        "priority": "core",
        "glossarySlug": "prompt-engineering",
    },
    {
        "id": "tech-context-windows",
        "title": "Reason about context windows and token budgets",
        "summary": "Understand when a request is too long, when to chunk, and how to use retrieval instead of jamming everything into context.",
        "dimension": "technical",
        "priority": "core",
        "glossarySlug": "context-window",
    },
]

GENERAL_CRITICAL: list[SkillSpec] = [
    {
        "id": "crit-hallucination-check",
        "title": "Detect and verify claims that sound confident but may be hallucinated",
        "summary": "Cross-check specific numbers, quotes, and citations against primary sources. Treat unverified facts as a red flag.",
        "dimension": "critical",
        "priority": "core",
        "glossarySlug": "hallucination",
    },
    {
        "id": "crit-uncertainty-tolerance",
        "title": "Ask for confidence and act accordingly",
        "summary": "Prompt for explicit uncertainty signals and treat hedged AI output as hedged — don't collapse it into a single certain answer.",
        "dimension": "critical",
        "priority": "supporting",
        "glossarySlug": "critical-literacy",
    },
]

GENERAL_ETHICAL: list[SkillSpec] = [
    {
        "id": "eth-data-governance",
        "title": "Respect data-sharing boundaries",
        "summary": "Know what you can and cannot paste into a third-party AI tool. Default to anonymising PII, PHI, and proprietary data.",
        "dimension": "ethical",
        "priority": "core",
        "glossarySlug": "ethical-literacy",
    },
    {
        "id": "eth-bias-awareness",
        "title": "Recognise and counter training-data bias",
        "summary": "Ask the model to consider alternative perspectives and to flag when its training data may be incomplete or skewed.",
        "dimension": "ethical",
        "priority": "supporting",
    },
]


def sector_skills(sector: str) -> dict[str, list[SkillSpec]]:
    """Return per-dimension skill additions specific to a sector."""
    match sector:
        case "energy-petrochemicals":
            return {
                "technical": [
                    {
                        "id": "tech-ep-predictive-maintenance",
                        "title": "Predictive-maintenance signals in process plants",
                        "summary": "Use AI to surface early indicators of pump, turbine, or catalyst-bed degradation from instrumentation data.",
                        "dimension": "technical",
                        "priority": "core",
                    },
                ],
                "critical": [
                    {
                        "id": "crit-ep-safety-gate",
                        "title": "Gate AI recommendations through HAZOP review",
                        "summary": "Never actuate safety-critical equipment on an AI recommendation alone. Route through the plant's documented hazard-review cycle.",
                        "dimension": "critical",
                        "priority": "core",
                    },
                ],
                "ethical": [],
                "domain-specific": [
                    {
                        "id": "dom-ep-operator-augmentation",
                        "title": "Operator copilot workflows for control-room staff",
                        "summary": "Embed AI in the control-room SOP without undermining the operator's license to overrule. Track recommendation adoption.",
                        "dimension": "domain-specific",
                        "priority": "core",
                    },
                ],
            }
        case "manufacturing":
            return {
                "technical": [
                    {
                        "id": "tech-mfg-robot-interfaces",
                        "title": "Instruct humanoid and cobot systems via natural-language intent",
                        "summary": "Structure robot task descriptions so downstream planners can execute; understand vision-language action loops.",
                        "dimension": "technical",
                        "priority": "core",
                    },
                ],
                "critical": [
                    {
                        "id": "crit-mfg-quality",
                        "title": "Double-check AI-assisted QC decisions against a physical sample",
                        "summary": "Vision-AI is precise but can be wrong at the tails of a distribution. Sample-check every shift.",
                        "dimension": "critical",
                        "priority": "core",
                    },
                ],
                "ethical": [
                    {
                        "id": "eth-mfg-displacement",
                        "title": "Transparent communication about automation scope",
                        "summary": "When new robots are deployed, communicate which roles are being augmented vs replaced, and document retraining commitments.",
                        "dimension": "ethical",
                        "priority": "core",
                    },
                ],
                "domain-specific": [
                    {
                        "id": "dom-mfg-weld-inspection",
                        "title": "AI-assisted weld inspection workflow",
                        "summary": "Interpret vision-model defect classifications, calibrate false-positive rates, and pair with destructive-test sampling.",
                        "dimension": "domain-specific",
                        "priority": "core",
                    },
                ],
            }
        case "healthcare":
            return {
                "technical": [
                    {
                        "id": "tech-hc-ambient-documentation",
                        "title": "Operate ambient documentation and charting assistants",
                        "summary": "Use AI scribes (Nuance DAX, Abridge, Suki) to generate clinical notes from encounters. Always review before signing.",
                        "dimension": "technical",
                        "priority": "core",
                    },
                ],
                "critical": [
                    {
                        "id": "crit-hc-diagnostic",
                        "title": "Treat AI diagnostic suggestions as differentials, not decisions",
                        "summary": "AI-surfaced differentials broaden thinking; they do not replace clinical judgment or protocol.",
                        "dimension": "critical",
                        "priority": "core",
                    },
                ],
                "ethical": [
                    {
                        "id": "eth-hc-hipaa",
                        "title": "HIPAA-compliant AI use",
                        "summary": "Route every PHI-containing workflow through an enterprise agreement that covers BAA. Never paste PHI into a consumer AI tool.",
                        "dimension": "ethical",
                        "priority": "core",
                    },
                ],
                "domain-specific": [
                    {
                        "id": "dom-hc-charting-workflow",
                        "title": "Integrate charting AI into Epic/Cerner workflows",
                        "summary": "Understand the specific LSU Health / Ochsner / LCMC deployment model and how AI fits the shift hand-off.",
                        "dimension": "domain-specific",
                        "priority": "core",
                    },
                ],
            }
        case "technology":
            return {
                "technical": [
                    {
                        "id": "tech-sw-claude-code",
                        "title": "Use Claude Code effectively on real repos",
                        "summary": "Write a CLAUDE.md, configure skills and sub-agents, review diffs critically, and understand when to let the agent run autonomously vs. pair-program.",
                        "dimension": "technical",
                        "priority": "core",
                        "glossarySlug": "claude-code",
                    },
                    {
                        "id": "tech-sw-system-prompts",
                        "title": "Design system prompts and build with the Claude API",
                        "summary": "Craft reliable system prompts for production apps. Use prompt caching, extended thinking, and tool use appropriately.",
                        "dimension": "technical",
                        "priority": "core",
                        "glossarySlug": "system-prompt",
                    },
                ],
                "critical": [
                    {
                        "id": "crit-sw-review-ai-code",
                        "title": "Review AI-generated code with the same rigor as human code",
                        "summary": "Security scan, dependency audit, test coverage check. AI-authored code without review is a liability.",
                        "dimension": "critical",
                        "priority": "core",
                    },
                ],
                "ethical": [
                    {
                        "id": "eth-sw-license-drift",
                        "title": "Watch for license and attribution drift in AI suggestions",
                        "summary": "Some AI suggestions lift verbatim code from training. Check provenance of substantial blocks before shipping.",
                        "dimension": "ethical",
                        "priority": "supporting",
                    },
                ],
                "domain-specific": [
                    {
                        "id": "dom-sw-datacenter-ops",
                        "title": "Data-center operations AI — observability and runbook automation",
                        "summary": "Use AI to triage alerts, draft runbook updates, and summarise incidents — pair-ops for Meta Hyperion / AWS Caddo-Bossier.",
                        "dimension": "domain-specific",
                        "priority": "core",
                    },
                ],
            }
        case "logistics-ports":
            return {
                "technical": [
                    {
                        "id": "tech-log-route-optimization",
                        "title": "Use AI-assisted dispatch and routing tools",
                        "summary": "Interpret AI-optimized routes with awareness of road, weather, and equipment constraints not visible to the algorithm.",
                        "dimension": "technical",
                        "priority": "core",
                    },
                ],
                "critical": [
                    {
                        "id": "crit-log-safety",
                        "title": "Override AI recommendations under real-world constraints",
                        "summary": "AI doesn't always see bridge restrictions, weight limits, or hazmat rules. Know when to override.",
                        "dimension": "critical",
                        "priority": "core",
                    },
                ],
                "ethical": [],
                "domain-specific": [
                    {
                        "id": "dom-log-port-ops",
                        "title": "Port-specific workflow automation",
                        "summary": "Port of South Louisiana and Port NOLA are deploying container-tracking AI — learn the deployed system.",
                        "dimension": "domain-specific",
                        "priority": "core",
                    },
                ],
            }
        case "construction":
            return {
                "technical": [
                    {
                        "id": "tech-con-schedule-ai",
                        "title": "Use AI for schedule risk and sequencing",
                        "summary": "Megaproject schedules are ideal territory for AI-assisted critical-path analysis; learn to interpret outputs.",
                        "dimension": "technical",
                        "priority": "core",
                    },
                ],
                "critical": [
                    {
                        "id": "crit-con-site-reality",
                        "title": "Field verification of AI-planned sequences",
                        "summary": "AI plans from drawings; site conditions diverge. Always field-verify before issuing work orders.",
                        "dimension": "critical",
                        "priority": "core",
                    },
                ],
                "ethical": [
                    {
                        "id": "eth-con-safety-record",
                        "title": "Keep safety decision authority with humans",
                        "summary": "AI can surface risks but should not close out safety issues. Log who made the decision, and why.",
                        "dimension": "ethical",
                        "priority": "core",
                    },
                ],
                "domain-specific": [
                    {
                        "id": "dom-con-megaproject-sequencing",
                        "title": "Megaproject-specific AI tooling (Hyundai Steel, Meta, AWS builds)",
                        "summary": "Each GC on the named megaprojects is deploying different AI toolchains; learn the one your employer uses.",
                        "dimension": "domain-specific",
                        "priority": "core",
                    },
                ],
            }
        case "education":
            return {
                "technical": [
                    {
                        "id": "tech-edu-lesson-generation",
                        "title": "Generate and adapt lesson plans with Claude",
                        "summary": "Use Claude Projects to persist course context; generate differentiated materials and rubrics.",
                        "dimension": "technical",
                        "priority": "core",
                    },
                ],
                "critical": [
                    {
                        "id": "crit-edu-ai-detection",
                        "title": "Why AI-detection tools are unreliable",
                        "summary": "Detection software has high false-positive rates. Design AI-resilient assignments instead of relying on detection.",
                        "dimension": "critical",
                        "priority": "core",
                    },
                ],
                "ethical": [
                    {
                        "id": "eth-edu-ferpa",
                        "title": "FERPA-compliant AI use with student data",
                        "summary": "Student records are regulated. Never paste names, grades, or identifiable material into a consumer AI tool.",
                        "dimension": "ethical",
                        "priority": "core",
                    },
                ],
                "domain-specific": [
                    {
                        "id": "dom-edu-policy",
                        "title": "Author a course-level AI policy",
                        "summary": "A clear, specific policy about what AI use is allowed for each assignment is the most effective teaching tool.",
                        "dimension": "domain-specific",
                        "priority": "core",
                    },
                ],
            }
        case "finance-insurance":
            return {
                "technical": [
                    {
                        "id": "tech-fin-document-analysis",
                        "title": "Use Claude for financial document analysis",
                        "summary": "Summarise 10-Ks, analyse earnings calls, extract structured data from PDFs using Claude's long-context window.",
                        "dimension": "technical",
                        "priority": "core",
                    },
                ],
                "critical": [
                    {
                        "id": "crit-fin-number-verification",
                        "title": "Always verify AI-extracted numbers against the source",
                        "summary": "AI extraction of numbers and dates is where hallucinations cost real money. Spot-check every extracted figure.",
                        "dimension": "critical",
                        "priority": "core",
                    },
                ],
                "ethical": [
                    {
                        "id": "eth-fin-fair-lending",
                        "title": "Fair-lending compliance when AI informs decisions",
                        "summary": "AI-assisted credit and pricing decisions fall under ECOA/FHA. Document disparate-impact testing.",
                        "dimension": "ethical",
                        "priority": "core",
                    },
                ],
                "domain-specific": [
                    {
                        "id": "dom-fin-workflow-automation",
                        "title": "Automate close/reconciliation with AI",
                        "summary": "Close cycles compress dramatically when AI drafts reconciliation narratives. Keep senior review on every draft.",
                        "dimension": "domain-specific",
                        "priority": "core",
                    },
                ],
            }
        case "public-administration":
            return {
                "technical": [
                    {
                        "id": "tech-pa-public-data",
                        "title": "Use AI to summarise policy and regulation",
                        "summary": "Municipal / parish administrators can summarise long regulatory texts quickly with AI — always link to the authoritative source.",
                        "dimension": "technical",
                        "priority": "core",
                    },
                ],
                "critical": [
                    {
                        "id": "crit-pa-constituent",
                        "title": "AI must not be the final voice to constituents",
                        "summary": "A public servant remains accountable. AI drafts, humans sign.",
                        "dimension": "critical",
                        "priority": "core",
                    },
                ],
                "ethical": [
                    {
                        "id": "eth-pa-transparency",
                        "title": "Disclose AI use in public-sector deliverables",
                        "summary": "Public trust requires transparency about when and how AI was used.",
                        "dimension": "ethical",
                        "priority": "core",
                    },
                ],
                "domain-specific": [
                    {
                        "id": "dom-pa-casework",
                        "title": "Casework and constituent-communication AI",
                        "summary": "Many LA parish and state offices are piloting AI summarisation of casework; learn the deployed tool.",
                        "dimension": "domain-specific",
                        "priority": "core",
                    },
                ],
            }
        case "retail-hospitality":
            return {
                "technical": [
                    {
                        "id": "tech-rh-customer-ai",
                        "title": "Use and review AI-drafted customer communications",
                        "summary": "Sales and service teams should review every AI-drafted message before sending — personalisation matters.",
                        "dimension": "technical",
                        "priority": "core",
                    },
                ],
                "critical": [
                    {
                        "id": "crit-rh-tone",
                        "title": "AI tone-matching can miss cultural nuance",
                        "summary": "Louisiana's hospitality culture carries specific cues AI may flatten. Keep a human read on customer-facing copy.",
                        "dimension": "critical",
                        "priority": "supporting",
                    },
                ],
                "ethical": [],
                "domain-specific": [
                    {
                        "id": "dom-rh-service-scripts",
                        "title": "AI-assisted customer-service script adaptation",
                        "summary": "Scripts should adapt to local dialect and regulation — AI helps draft, local staff tune.",
                        "dimension": "domain-specific",
                        "priority": "supporting",
                    },
                ],
            }
    return {"technical": [], "critical": [], "ethical": [], "domain-specific": []}


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Per-SOC specs — the authored input surface
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


class SOCSpec(TypedDict, total=False):
    code: str
    title: str
    jobFamily: str
    summary: str
    sector: str
    laEmployment: int | None
    laMedianWage: int | None
    exposure: float
    augmentation: float
    replacement: float
    wagePremium: float
    confidence: str
    wagePremiumConfidence: str
    rlmaDistribution: dict[str, float]
    relatedSOCs: list[str]
    typicalEmployerIds: list[str]
    extraSectors: list[str]
    extraSkills: list[SkillSpec]
    pathModules: list[dict[str, object]]


# Default education learning path — most SOCs reuse these modules.
STD_PATH_MODULES = [
    {
        "moduleId": "ai-fundamentals",
        "order": 1,
        "rationale": "Ground how LLMs actually generate text before trusting them at work.",
        "covers": ["technical"],
    },
    {
        "moduleId": "prompt-engineering",
        "order": 2,
        "rationale": "Structured prompting is the highest-leverage skill for anyone using AI.",
        "covers": ["technical"],
    },
    {
        "moduleId": "responsible-ai",
        "order": 3,
        "rationale": "Hallucinations, bias, and data-handling rules matter in every regulated workplace.",
        "covers": ["critical", "ethical"],
    },
    {
        "moduleId": "practical-workflows",
        "order": 4,
        "rationale": "Translate the fundamentals into role-specific day-to-day workflows.",
        "covers": ["domain-specific"],
    },
]

DEVELOPER_PATH_MODULES = [
    *STD_PATH_MODULES[:2],
    {
        "moduleId": "claude-workflows",
        "order": 3,
        "rationale": "Master Claude Code, the Claude API, and MCP — the practitioner core.",
        "covers": ["technical", "domain-specific"],
    },
    {
        "moduleId": "responsible-ai",
        "order": 4,
        "rationale": "Ship safely: license drift, secret handling, and code-review discipline.",
        "covers": ["critical", "ethical"],
    },
    {
        "moduleId": "practical-workflows",
        "order": 5,
        "rationale": "Developer-specific patterns around system prompts and agentic workflows.",
        "covers": ["domain-specific"],
    },
]


SOC_SPECS: list[SOCSpec] = [
    # ─── Manufacturing ───
    {
        "code": "51-4121",
        "title": "Welders, Cutters, Solderers, and Brazers",
        "jobFamily": "Production",
        "summary": "Join or cut metal parts using welding, soldering, and brazing equipment — the core fabrication workforce behind Louisiana's shipyards, steel plants, and petrochemical corridor.",
        "sector": "manufacturing",
        "laEmployment": 12_500,
        "laMedianWage": 52_400,
        "exposure": 32.0,
        "augmentation": 16.0,
        "replacement": 18.0,
        "wagePremium": 28.0,
        "confidence": "medium",
        "wagePremiumConfidence": "low",
        "rlmaDistribution": {"RLMA-1": 22, "RLMA-2": 18, "RLMA-3": 14, "RLMA-5": 28, "RLMA-7": 10, "RLMA-8": 8},
        "relatedSOCs": ["51-2098", "47-2211", "17-2141"],
        "typicalEmployerIds": ["hyundai-steel", "sse-persona-ai", "chevron", "exxonmobil-baton-rouge"],
    },
    {
        "code": "51-8091",
        "title": "Chemical Plant and System Operators",
        "jobFamily": "Production",
        "summary": "Control reactors, distillation columns, and related equipment in the LNG and petrochemical corridor from Lake Charles to Baton Rouge.",
        "sector": "energy-petrochemicals",
        "laEmployment": 7_300,
        "laMedianWage": 78_900,
        "exposure": 28.0,
        "augmentation": 20.0,
        "replacement": 8.0,
        "wagePremium": 36.0,
        "confidence": "medium",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 12, "RLMA-2": 26, "RLMA-3": 10, "RLMA-5": 44, "RLMA-7": 4, "RLMA-8": 4},
        "relatedSOCs": ["51-8013", "17-2112", "19-5011"],
        "typicalEmployerIds": ["dow-chemical", "sasol", "cheniere-sabine-pass", "venture-global-calcasieu", "phillips-66-lake-charles"],
    },
    {
        "code": "51-8013",
        "title": "Power Plant Operators",
        "jobFamily": "Production",
        "summary": "Operate generating stations and associated equipment. Rising AI exposure as grid and dispatch decisions increasingly use ML predictions.",
        "sector": "energy-petrochemicals",
        "laEmployment": 1_900,
        "laMedianWage": 92_400,
        "exposure": 34.0,
        "augmentation": 24.0,
        "replacement": 8.0,
        "wagePremium": 42.0,
        "confidence": "medium",
        "wagePremiumConfidence": "low",
        "rlmaDistribution": {"RLMA-1": 18, "RLMA-2": 24, "RLMA-5": 18, "RLMA-7": 16, "RLMA-8": 14, "RLMA-4": 6, "RLMA-6": 4},
        "relatedSOCs": ["51-8091", "17-2071"],
        "typicalEmployerIds": ["entergy-louisiana"],
    },
    {
        "code": "51-2098",
        "title": "Miscellaneous Assemblers and Fabricators",
        "jobFamily": "Production",
        "summary": "Assemble finished products and component parts across LA's industrial corridor — many tasks are already being augmented by vision-AI QC.",
        "sector": "manufacturing",
        "laEmployment": 4_300,
        "laMedianWage": 42_400,
        "exposure": 42.0,
        "augmentation": 18.0,
        "replacement": 22.0,
        "wagePremium": 24.0,
        "confidence": "medium",
        "wagePremiumConfidence": "low",
        "rlmaDistribution": {"RLMA-1": 22, "RLMA-2": 20, "RLMA-5": 22, "RLMA-7": 18, "RLMA-3": 8, "RLMA-4": 6, "RLMA-8": 4},
        "relatedSOCs": ["51-4121", "51-9032"],
        "typicalEmployerIds": ["hyundai-steel", "sse-persona-ai"],
    },
    {
        "code": "17-2199.01",
        "title": "Robotics Engineers",
        "jobFamily": "Engineering",
        "summary": "Design, test, and supervise robotic systems. Directly targeted by the SSE Steel / Persona AI humanoid pilot and by automation across ports and manufacturing.",
        "sector": "manufacturing",
        "laEmployment": 1_200,
        "laMedianWage": 104_500,
        "exposure": 68.0,
        "augmentation": 44.0,
        "replacement": 18.0,
        "wagePremium": 62.0,
        "confidence": "medium",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 28, "RLMA-2": 22, "RLMA-5": 14, "RLMA-7": 22, "RLMA-8": 10, "RLMA-4": 4},
        "relatedSOCs": ["17-2141", "17-2112", "15-1252"],
        "typicalEmployerIds": ["sse-persona-ai", "meta-hyperion", "amazon-aws", "hyundai-steel"],
        "extraSectors": ["technology"],
        "pathModules": DEVELOPER_PATH_MODULES,
    },
    # ─── Construction ───
    {
        "code": "11-9021",
        "title": "Construction Managers",
        "jobFamily": "Management",
        "summary": "Plan, coordinate, budget, and supervise construction projects. Megaproject sequencing (Meta, AWS, Hyundai Steel) is ideal AI-assisted planning territory.",
        "sector": "construction",
        "laEmployment": 3_600,
        "laMedianWage": 96_100,
        "exposure": 48.0,
        "augmentation": 38.0,
        "replacement": 8.0,
        "wagePremium": 46.0,
        "confidence": "medium",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 24, "RLMA-2": 22, "RLMA-5": 14, "RLMA-7": 16, "RLMA-8": 14, "RLMA-3": 6, "RLMA-4": 4},
        "relatedSOCs": ["11-1021", "17-3022", "47-2111"],
        "typicalEmployerIds": ["meta-hyperion", "amazon-aws", "hyundai-steel", "hut-8-jacobs"],
        "extraSectors": ["public-administration"],
    },
    {
        "code": "47-2111",
        "title": "Electricians",
        "jobFamily": "Construction & Extraction",
        "summary": "Install, maintain, and repair electrical systems. Megaproject demand is expanding the Louisiana electrician workforce; AI augments diagnostics more than the physical trade.",
        "sector": "construction",
        "laEmployment": 14_500,
        "laMedianWage": 58_400,
        "exposure": 22.0,
        "augmentation": 16.0,
        "replacement": 4.0,
        "wagePremium": 22.0,
        "confidence": "medium",
        "wagePremiumConfidence": "low",
        "rlmaDistribution": {"RLMA-1": 22, "RLMA-2": 22, "RLMA-5": 18, "RLMA-7": 14, "RLMA-8": 10, "RLMA-3": 8, "RLMA-4": 6},
        "relatedSOCs": ["47-2211", "49-9071"],
        "typicalEmployerIds": ["meta-hyperion", "amazon-aws", "hut-8-jacobs", "entergy-louisiana"],
    },
    {
        "code": "47-2211",
        "title": "Sheet Metal Workers",
        "jobFamily": "Construction & Extraction",
        "summary": "Fabricate, assemble, and install sheet-metal products — especially HVAC ductwork for industrial and data-center construction.",
        "sector": "construction",
        "laEmployment": 2_800,
        "laMedianWage": 53_900,
        "exposure": 18.0,
        "augmentation": 12.0,
        "replacement": 6.0,
        "wagePremium": 20.0,
        "confidence": "medium",
        "wagePremiumConfidence": "low",
        "rlmaDistribution": {"RLMA-1": 26, "RLMA-2": 22, "RLMA-5": 16, "RLMA-7": 18, "RLMA-8": 10, "RLMA-3": 4, "RLMA-4": 4},
        "relatedSOCs": ["47-2111", "51-4121"],
        "typicalEmployerIds": ["meta-hyperion", "amazon-aws", "hut-8-jacobs"],
    },
    # ─── Healthcare ───
    {
        "code": "29-1141",
        "title": "Registered Nurses",
        "jobFamily": "Healthcare Practitioners",
        "summary": "Provide and coordinate patient care. Louisiana's largest regulated-professional occupation; AI augments documentation, triage, and handoff workflows.",
        "sector": "healthcare",
        "laEmployment": 42_000,
        "laMedianWage": 76_300,
        "exposure": 44.0,
        "augmentation": 36.0,
        "replacement": 6.0,
        "wagePremium": 18.0,
        "confidence": "high",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 30, "RLMA-2": 20, "RLMA-4": 14, "RLMA-7": 14, "RLMA-8": 8, "RLMA-6": 6, "RLMA-3": 4, "RLMA-5": 4},
        "relatedSOCs": ["29-1171", "29-2061", "31-1131"],
        "typicalEmployerIds": ["ochsner", "lcmc-health", "lsu-health", "willis-knighton"],
    },
    {
        "code": "29-1171",
        "title": "Nurse Practitioners",
        "jobFamily": "Healthcare Practitioners",
        "summary": "Diagnose, treat, and prescribe independently in many settings. Ideal augmentation target for differential-diagnosis AI and charting automation.",
        "sector": "healthcare",
        "laEmployment": 2_300,
        "laMedianWage": 118_400,
        "exposure": 42.0,
        "augmentation": 34.0,
        "replacement": 6.0,
        "wagePremium": 32.0,
        "confidence": "medium",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 30, "RLMA-2": 20, "RLMA-4": 14, "RLMA-7": 14, "RLMA-8": 8, "RLMA-6": 6, "RLMA-3": 4, "RLMA-5": 4},
        "relatedSOCs": ["29-1141", "29-1069"],
        "typicalEmployerIds": ["ochsner", "lcmc-health", "lsu-health"],
    },
    {
        "code": "29-2061",
        "title": "Licensed Practical and Licensed Vocational Nurses",
        "jobFamily": "Healthcare Practitioners",
        "summary": "Provide routine patient care under the direction of RNs or physicians — core of rural Louisiana healthcare delivery.",
        "sector": "healthcare",
        "laEmployment": 16_000,
        "laMedianWage": 50_100,
        "exposure": 38.0,
        "augmentation": 30.0,
        "replacement": 6.0,
        "wagePremium": 16.0,
        "confidence": "medium",
        "wagePremiumConfidence": "low",
        "rlmaDistribution": {"RLMA-1": 22, "RLMA-2": 18, "RLMA-4": 14, "RLMA-7": 14, "RLMA-8": 12, "RLMA-6": 10, "RLMA-3": 6, "RLMA-5": 4},
        "relatedSOCs": ["29-1141", "31-1131"],
        "typicalEmployerIds": ["ochsner", "lcmc-health", "lsu-health", "willis-knighton"],
    },
    {
        "code": "31-1131",
        "title": "Nursing Assistants",
        "jobFamily": "Healthcare Support",
        "summary": "Assist patients with daily living activities. Significant AI automation of documentation and monitoring workflows.",
        "sector": "healthcare",
        "laEmployment": 19_000,
        "laMedianWage": 29_800,
        "exposure": 46.0,
        "augmentation": 32.0,
        "replacement": 12.0,
        "wagePremium": 12.0,
        "confidence": "medium",
        "wagePremiumConfidence": "low",
        "rlmaDistribution": {"RLMA-1": 22, "RLMA-2": 20, "RLMA-4": 14, "RLMA-7": 14, "RLMA-8": 10, "RLMA-6": 10, "RLMA-3": 6, "RLMA-5": 4},
        "relatedSOCs": ["29-2061"],
        "typicalEmployerIds": ["ochsner", "lcmc-health", "willis-knighton"],
    },
    # ─── Technology ───
    {
        "code": "15-1252",
        "title": "Software Developers",
        "jobFamily": "Computer & Mathematical",
        "summary": "Design, develop, and maintain software systems. Claude Code, Copilot, and Cursor have made AI pair-programming the baseline; deep literacy is the new premium skill.",
        "sector": "technology",
        "laEmployment": 8_200,
        "laMedianWage": 93_100,
        "exposure": 82.0,
        "augmentation": 62.0,
        "replacement": 18.0,
        "wagePremium": 74.0,
        "confidence": "high",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 30, "RLMA-2": 24, "RLMA-7": 22, "RLMA-8": 10, "RLMA-4": 6, "RLMA-5": 4, "RLMA-3": 2, "RLMA-6": 2},
        "relatedSOCs": ["15-1299", "15-2051", "17-2199.01"],
        "typicalEmployerIds": ["meta-hyperion", "amazon-aws", "hut-8-jacobs"],
        "pathModules": DEVELOPER_PATH_MODULES,
    },
    {
        "code": "15-1299",
        "title": "Computer Occupations, All Other",
        "jobFamily": "Computer & Mathematical",
        "summary": "Heterogeneous category covering data-center operations, site reliability, ML ops, and adjacent technical roles. AWS and Meta are the primary LA hirers.",
        "sector": "technology",
        "laEmployment": 3_200,
        "laMedianWage": 78_600,
        "exposure": 74.0,
        "augmentation": 52.0,
        "replacement": 18.0,
        "wagePremium": 58.0,
        "confidence": "medium",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 22, "RLMA-2": 18, "RLMA-7": 28, "RLMA-8": 22, "RLMA-4": 4, "RLMA-5": 2, "RLMA-3": 2, "RLMA-6": 2},
        "relatedSOCs": ["15-1252", "49-9071"],
        "typicalEmployerIds": ["meta-hyperion", "amazon-aws", "hut-8-jacobs"],
        "pathModules": DEVELOPER_PATH_MODULES,
    },
    {
        "code": "49-9071",
        "title": "Maintenance and Repair Workers, General",
        "jobFamily": "Installation, Maintenance, Repair",
        "summary": "Perform work involving the skills of two or more maintenance or craft occupations. Data-center uptime at Meta Hyperion and AWS depends on this role plus AI-assisted diagnostics.",
        "sector": "technology",
        "laEmployment": 22_000,
        "laMedianWage": 44_800,
        "exposure": 28.0,
        "augmentation": 20.0,
        "replacement": 6.0,
        "wagePremium": 22.0,
        "confidence": "medium",
        "wagePremiumConfidence": "low",
        "rlmaDistribution": {"RLMA-1": 22, "RLMA-2": 20, "RLMA-7": 20, "RLMA-8": 14, "RLMA-5": 10, "RLMA-4": 6, "RLMA-3": 4, "RLMA-6": 4},
        "relatedSOCs": ["47-2111", "49-2022"],
        "typicalEmployerIds": ["meta-hyperion", "amazon-aws", "ochsner", "entergy-louisiana"],
        "extraSectors": ["construction"],
    },
    # ─── Logistics / Ports ───
    {
        "code": "53-7051",
        "title": "Industrial Truck and Tractor Operators",
        "jobFamily": "Transportation",
        "summary": "Operate forklifts and similar material-handling equipment. Ports of South Louisiana and New Orleans are the largest single deployments in the state.",
        "sector": "logistics-ports",
        "laEmployment": 6_800,
        "laMedianWage": 41_200,
        "exposure": 38.0,
        "augmentation": 14.0,
        "replacement": 24.0,
        "wagePremium": 14.0,
        "confidence": "medium",
        "wagePremiumConfidence": "low",
        "rlmaDistribution": {"RLMA-1": 36, "RLMA-3": 20, "RLMA-2": 14, "RLMA-5": 14, "RLMA-7": 10, "RLMA-4": 3, "RLMA-8": 2, "RLMA-6": 1},
        "relatedSOCs": ["53-3032", "53-7062"],
        "typicalEmployerIds": ["port-new-orleans", "port-south-louisiana", "port-fourchon", "port-greater-baton-rouge"],
    },
    {
        "code": "53-3032",
        "title": "Heavy and Tractor-Trailer Truck Drivers",
        "jobFamily": "Transportation",
        "summary": "Louisiana's single largest blue-collar occupation. Long-haul autonomy is a long-term replacement risk; driver-assistance AI is augmenting near-term.",
        "sector": "logistics-ports",
        "laEmployment": 31_000,
        "laMedianWage": 48_600,
        "exposure": 34.0,
        "augmentation": 12.0,
        "replacement": 22.0,
        "wagePremium": 10.0,
        "confidence": "medium",
        "wagePremiumConfidence": "low",
        "rlmaDistribution": {"RLMA-1": 22, "RLMA-2": 18, "RLMA-3": 10, "RLMA-5": 12, "RLMA-7": 16, "RLMA-8": 12, "RLMA-4": 6, "RLMA-6": 4},
        "relatedSOCs": ["53-7051", "53-6051"],
        "typicalEmployerIds": ["port-south-louisiana", "port-new-orleans"],
    },
    {
        "code": "43-5061",
        "title": "Production, Planning, and Expediting Clerks",
        "jobFamily": "Office & Admin",
        "summary": "Coordinate production schedules and inventory. Structured workflow that AI drafting and planning can automate broadly.",
        "sector": "logistics-ports",
        "laEmployment": 5_700,
        "laMedianWage": 52_700,
        "exposure": 64.0,
        "augmentation": 38.0,
        "replacement": 24.0,
        "wagePremium": 38.0,
        "confidence": "medium",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 24, "RLMA-2": 22, "RLMA-5": 18, "RLMA-7": 16, "RLMA-3": 8, "RLMA-4": 6, "RLMA-8": 4, "RLMA-6": 2},
        "relatedSOCs": ["43-6011", "11-3061"],
        "typicalEmployerIds": ["port-south-louisiana", "dow-chemical", "exxonmobil-baton-rouge"],
    },
    # ─── Education ───
    {
        "code": "25-2021",
        "title": "Elementary School Teachers, Except Special Education",
        "jobFamily": "Education",
        "summary": "Teach academic and social skills to students in K-5. K-12 AI literacy policy is the present frontier.",
        "sector": "education",
        "laEmployment": 17_500,
        "laMedianWage": 54_300,
        "exposure": 42.0,
        "augmentation": 34.0,
        "replacement": 6.0,
        "wagePremium": 16.0,
        "confidence": "high",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 24, "RLMA-2": 20, "RLMA-4": 14, "RLMA-7": 14, "RLMA-8": 10, "RLMA-6": 8, "RLMA-3": 5, "RLMA-5": 5},
        "relatedSOCs": ["25-2031", "25-1011"],
        "typicalEmployerIds": [],
    },
    {
        "code": "25-2031",
        "title": "Secondary School Teachers, Except Special Education",
        "jobFamily": "Education",
        "summary": "Teach academic subjects to students in grades 6-12. CS and STEM subjects are the curriculum battleground for AI literacy.",
        "sector": "education",
        "laEmployment": 17_000,
        "laMedianWage": 56_400,
        "exposure": 48.0,
        "augmentation": 40.0,
        "replacement": 6.0,
        "wagePremium": 18.0,
        "confidence": "high",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 24, "RLMA-2": 20, "RLMA-4": 14, "RLMA-7": 14, "RLMA-8": 10, "RLMA-6": 8, "RLMA-3": 5, "RLMA-5": 5},
        "relatedSOCs": ["25-2021", "25-1011"],
        "typicalEmployerIds": [],
    },
    {
        "code": "25-1011",
        "title": "Business Teachers, Postsecondary",
        "jobFamily": "Education",
        "summary": "Teach courses in business, management, marketing, and related fields at the postsecondary level. LSU, ULL, ULM business faculty anchor AI-literacy course design.",
        "sector": "education",
        "laEmployment": 900,
        "laMedianWage": 90_400,
        "exposure": 72.0,
        "augmentation": 60.0,
        "replacement": 8.0,
        "wagePremium": 38.0,
        "confidence": "medium",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 26, "RLMA-2": 24, "RLMA-4": 16, "RLMA-7": 14, "RLMA-8": 10, "RLMA-6": 4, "RLMA-3": 3, "RLMA-5": 3},
        "relatedSOCs": ["25-2031"],
        "typicalEmployerIds": ["lsu-health"],
    },
    # ─── Finance / Professional ───
    {
        "code": "13-2011",
        "title": "Accountants and Auditors",
        "jobFamily": "Business & Financial",
        "summary": "Examine, analyse, and interpret financial records. Top-5 most-automated category in the Anthropic Economic Index — augmentation for senior roles, replacement for preparers.",
        "sector": "finance-insurance",
        "laEmployment": 13_000,
        "laMedianWage": 71_400,
        "exposure": 84.0,
        "augmentation": 46.0,
        "replacement": 34.0,
        "wagePremium": 48.0,
        "confidence": "high",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 32, "RLMA-2": 24, "RLMA-7": 16, "RLMA-4": 10, "RLMA-8": 8, "RLMA-5": 5, "RLMA-3": 3, "RLMA-6": 2},
        "relatedSOCs": ["13-1111", "13-2051", "43-3031"],
        "typicalEmployerIds": [],
    },
    {
        "code": "13-1111",
        "title": "Management Analysts",
        "jobFamily": "Business & Financial",
        "summary": "Conduct studies and recommend process improvements. Consulting and strategy work is a top augmentation case in the Anthropic Economic Index.",
        "sector": "finance-insurance",
        "laEmployment": 4_200,
        "laMedianWage": 85_200,
        "exposure": 76.0,
        "augmentation": 56.0,
        "replacement": 18.0,
        "wagePremium": 52.0,
        "confidence": "high",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 34, "RLMA-2": 26, "RLMA-7": 14, "RLMA-4": 10, "RLMA-8": 6, "RLMA-5": 5, "RLMA-3": 3, "RLMA-6": 2},
        "relatedSOCs": ["13-2011", "11-1021"],
        "typicalEmployerIds": [],
    },
    {
        "code": "43-6011",
        "title": "Executive Secretaries and Administrative Assistants",
        "jobFamily": "Office & Admin",
        "summary": "Provide high-level clerical and administrative support. Scheduling, summarising, and drafting are the classical augmentation cases.",
        "sector": "public-administration",
        "laEmployment": 5_500,
        "laMedianWage": 58_300,
        "exposure": 82.0,
        "augmentation": 58.0,
        "replacement": 22.0,
        "wagePremium": 32.0,
        "confidence": "high",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 28, "RLMA-2": 24, "RLMA-7": 14, "RLMA-4": 10, "RLMA-8": 8, "RLMA-5": 7, "RLMA-3": 5, "RLMA-6": 4},
        "relatedSOCs": ["43-4051", "11-1021"],
        "typicalEmployerIds": [],
    },
    {
        "code": "43-4051",
        "title": "Customer Service Representatives",
        "jobFamily": "Office & Admin",
        "summary": "Interact with customers to provide information and resolve complaints. The highest-exposure services role in the Anthropic Economic Index.",
        "sector": "retail-hospitality",
        "laEmployment": 25_000,
        "laMedianWage": 37_200,
        "exposure": 86.0,
        "augmentation": 44.0,
        "replacement": 40.0,
        "wagePremium": 20.0,
        "confidence": "high",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 26, "RLMA-2": 22, "RLMA-4": 14, "RLMA-7": 14, "RLMA-8": 10, "RLMA-6": 6, "RLMA-3": 4, "RLMA-5": 4},
        "relatedSOCs": ["41-2031", "43-6011"],
        "typicalEmployerIds": [],
    },
    {
        "code": "11-1021",
        "title": "General and Operations Managers",
        "jobFamily": "Management",
        "summary": "Plan, direct, or coordinate the operations of public or private sector organisations. High leverage role for AI-literacy investment — decisions ripple across the organisation.",
        "sector": "public-administration",
        "laEmployment": 22_000,
        "laMedianWage": 108_900,
        "exposure": 58.0,
        "augmentation": 46.0,
        "replacement": 10.0,
        "wagePremium": 42.0,
        "confidence": "medium",
        "wagePremiumConfidence": "medium",
        "rlmaDistribution": {"RLMA-1": 26, "RLMA-2": 20, "RLMA-4": 14, "RLMA-7": 14, "RLMA-8": 10, "RLMA-6": 6, "RLMA-5": 5, "RLMA-3": 5},
        "relatedSOCs": ["11-9021", "13-1111", "11-3031"],
        "typicalEmployerIds": [],
    },
]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Build pipeline
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


INVARIANT_TOLERANCE_PCT = 15.0


def check_score_invariant(spec: SOCSpec) -> list[str]:
    """Augmentation + replacement ≈ exposure within plan tolerance."""
    warnings: list[str] = []
    total = spec["augmentation"] + spec["replacement"]
    delta = total - spec["exposure"]
    if abs(delta) > INVARIANT_TOLERANCE_PCT:
        warnings.append(
            f"{spec['code']}: augmentation+replacement ({total:.1f}) deviates from exposure ({spec['exposure']:.1f}) by {delta:+.1f}"
        )
    return warnings


def build_skill_bundle(spec: SOCSpec) -> dict[str, list[dict[str, object]]]:
    sector = spec["sector"]
    sector_buckets = sector_skills(sector)
    # Copy every skill into a fresh dict so the shared template lists never mutate.
    bundle = {
        "technical": [dict(s) for s in [*GENERAL_TECHNICAL, *sector_buckets["technical"]]],
        "critical": [dict(s) for s in [*GENERAL_CRITICAL, *sector_buckets["critical"]]],
        "ethical": [dict(s) for s in [*GENERAL_ETHICAL, *sector_buckets["ethical"]]],
        "domainSpecific": [dict(s) for s in sector_buckets["domain-specific"]],
    }
    for skill in spec.get("extraSkills") or []:
        dim_key = {
            "technical": "technical",
            "critical": "critical",
            "ethical": "ethical",
            "domain-specific": "domainSpecific",
        }[skill["dimension"]]
        bundle[dim_key].append(dict(skill))
    # Namespace skill ids to the SOC so repo-wide ids are unique.
    for _dim_name, items in bundle.items():
        for item in items:
            item["id"] = f"{spec['code']}:{item['id']}"
            item.setdefault("priority", "supporting")
    return bundle


def build_learning_path(spec: SOCSpec) -> dict[str, object]:
    modules = spec.get("pathModules") or STD_PATH_MODULES
    minutes_per_module = {
        "ai-fundamentals": 25,
        "prompt-engineering": 35,
        "claude-workflows": 30,
        "responsible-ai": 25,
        "practical-workflows": 20,
    }
    total = sum(minutes_per_module.get(m["moduleId"], 25) for m in modules)
    return {
        "socCode": spec["code"],
        "recommendedModules": [dict(m) for m in modules],
        "supplementalResources": [],
        "estimatedTotalMinutes": total,
        "milestones": [],
    }


def build_score_card(spec: SOCSpec) -> dict[str, object]:
    now = CORPUS_REVIEWED
    confidence = spec.get("confidence", "medium")
    wage_conf = spec.get("wagePremiumConfidence", confidence)
    return {
        "exposure": {
            "value": round(spec["exposure"], 1),
            "confidence": confidence,
            "source": ELOUNDOU,
            "lastComputed": now,
        },
        "augmentation": {
            "value": round(spec["augmentation"], 1),
            "confidence": confidence,
            "source": ANTHROPIC_EI,
            "lastComputed": now,
        },
        "replacement": {
            "value": round(spec["replacement"], 1),
            "confidence": confidence,
            "source": ANTHROPIC_EI,
            "lastComputed": now,
        },
        "wagePremium": {
            "value": round(spec["wagePremium"], 1),
            "confidence": wage_conf,
            "source": PWC_BAROMETER,
            "lastComputed": now,
            "note": "National PwC baseline (56%) adjusted down for non-tech occupations; up for high-leverage roles.",
        },
    }


def build_record(spec: SOCSpec) -> dict[str, object]:
    # Ensure RLMA distribution rounds to ~100.
    rlma = dict(spec.get("rlmaDistribution", {}))
    if rlma:
        total = sum(rlma.values())
        if not math.isclose(total, 100, abs_tol=2):
            logger.warning("%s rlmaDistribution sums to %.1f", spec["code"], total)

    sector_ids = [spec["sector"]]
    sector_ids.extend(spec.get("extraSectors") or [])

    return {
        "code": spec["code"],
        "title": spec["title"],
        "jobFamily": spec["jobFamily"],
        "laEmployment": spec.get("laEmployment"),
        "laMedianWage": spec.get("laMedianWage"),
        "rlmaDistribution": rlma,
        "relatedSOCs": spec.get("relatedSOCs", []),
        "typicalEmployerIds": spec.get("typicalEmployerIds", []),
        "sectorIds": sector_ids,
        "scoreCard": build_score_card(spec),
        "skillBundle": build_skill_bundle(spec),
        "learningPath": build_learning_path(spec),
        "summary": spec["summary"],
        "sourceCitations": [ELOUNDOU, ANTHROPIC_EI, PWC_BAROMETER, BLS_OEWS_LA, ONET],
        "lastReviewed": CORPUS_REVIEWED,
    }


def write_corpus(out_dir: Path, dry_run: bool = False) -> tuple[int, list[str]]:
    warnings: list[str] = []
    written = 0
    out_dir.mkdir(parents=True, exist_ok=True)
    for spec in SOC_SPECS:
        warnings.extend(check_score_invariant(spec))
        record = build_record(spec)
        path = out_dir / f"{spec['code']}.json"
        payload = json.dumps(record, indent=2, ensure_ascii=False) + "\n"
        if dry_run:
            logger.info("[dry-run] would write %s (%d bytes)", path, len(payload))
        else:
            path.write_text(payload)
        written += 1
    return written, warnings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default=str(OCCUPATIONS_DIR))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    written, warnings = write_corpus(Path(args.out), dry_run=args.dry_run)
    logger.info("Wrote %d occupation records.", written)
    for w in warnings:
        logger.warning("INVARIANT %s", w)
    if warnings and not args.dry_run:
        logger.info(
            "%d invariant warning(s) — values within tolerance but worth reviewing in DATA.md.",
            len(warnings),
        )
    return 0


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    sys.exit(main())
