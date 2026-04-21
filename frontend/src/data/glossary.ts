/**
 * AI Literacy — Louisiana Glossary
 *
 * ≥45 curated terms across five categories. Each entry links back to at
 * least one primary source (Anthropic docs, BLS, U.S. Census, O*NET, LED,
 * LWC, Long & Magerko 2020, Eloundou et al. 2024, Anthropic Economic Index).
 *
 * When adding terms:
 *   - slug is kebab-case and must match the file-level uniqueness invariant
 *     tested in glossary.test.ts
 *   - short is ≤120 chars; long is 2–5 sentences of markdown
 *   - relatedSlugs must all resolve; seeAlso links go to live primary sources
 */

import type { GlossaryTerm } from "./types"

export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  // ━━━ AI concepts ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "llm",
    term: "Large Language Model (LLM)",
    short:
      "A neural network trained on massive text corpora that predicts the next token given the prior tokens.",
    long: "A **large language model** is a transformer-based neural network trained on hundreds of billions of tokens of text so it can continue a given prompt by generating one token at a time. Modern LLMs — Claude, GPT, Gemini — power chat, code generation, and document analysis. LLMs don't retrieve stored answers; they compute statistically likely continuations, which explains both their fluency and their tendency to hallucinate.",
    category: "ai-concepts",
    relatedSlugs: ["token", "context-window", "hallucination", "prompt"],
    seeAlso: [
      {
        label: "Anthropic — What is Claude?",
        url: "https://www.anthropic.com/claude",
      },
    ],
  },
  {
    slug: "token",
    term: "Token",
    short:
      "The unit of text an LLM reads and writes — roughly three-quarters of an English word.",
    long: "Every prompt and every response is broken into **tokens** before the model sees it. In English, one token ≈ ¾ of a word; the word *understanding* splits into several tokens. Token counts drive both cost (you pay per token) and context-window usage.",
    category: "ai-concepts",
    relatedSlugs: ["llm", "context-window"],
    seeAlso: [
      {
        label: "Anthropic — Tokens and token counting",
        url: "https://docs.claude.com/en/docs/about-claude/context-windows",
      },
    ],
  },
  {
    slug: "context-window",
    term: "Context Window",
    short:
      "The maximum number of tokens an LLM can process in one prompt-response exchange.",
    long: "The **context window** bounds how much text an LLM can read and generate in a single turn. Claude Sonnet 4.6 supports a 200 K-token context (≈ 150 K words); some Claude models expose a 1 M-token window for large codebases or long documents. Tokens at the start and end of the window are typically weighted more heavily than tokens in the middle — 'lost in the middle'.",
    category: "ai-concepts",
    relatedSlugs: ["token", "llm", "rag"],
    seeAlso: [
      {
        label: "Anthropic — Context windows",
        url: "https://docs.claude.com/en/docs/about-claude/context-windows",
      },
    ],
  },
  {
    slug: "prompt",
    term: "Prompt",
    short:
      "The text you send to an LLM to instruct it — the model's only input apart from its system prompt.",
    long: "A **prompt** is the natural-language (or structured) request you send to a model. Good prompts provide role, task, context, format, and constraints. Small changes to a prompt often swing the quality of the response dramatically — the craft of writing them is *prompt engineering*.",
    category: "ai-concepts",
    relatedSlugs: ["prompt-engineering", "system-prompt", "xml-tags", "co-star"],
    seeAlso: [
      {
        label: "Anthropic — Prompt engineering overview",
        url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview",
      },
    ],
  },
  {
    slug: "hallucination",
    term: "Hallucination",
    short:
      "When an LLM generates content that sounds plausible but is factually wrong or fabricated.",
    long: "A **hallucination** is output that an LLM states with confidence but that is unsupported by any real source — fabricated citations, invented statistics, or confidently wrong claims. Because models generate text by next-token prediction rather than fact-lookup, they lack a built-in fact-checker. Mitigations include retrieval-augmented generation (RAG), explicit source citation requirements, and post-hoc human verification.",
    category: "ai-concepts",
    relatedSlugs: ["llm", "rag", "critical-literacy"],
    seeAlso: [
      {
        label: "Anthropic — Reducing hallucinations",
        url: "https://docs.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations",
      },
    ],
  },
  {
    slug: "rlhf",
    term: "RLHF — Reinforcement Learning from Human Feedback",
    short:
      "A training technique that uses human preference data to align LLMs toward helpful, honest, harmless responses.",
    long: "**RLHF** fine-tunes a base language model using a reward signal learned from human rankings of candidate responses. It is the technique that turned raw 'text completion' engines into the assistant-style models people use today. Anthropic refined this with *Constitutional AI*, replacing some human labels with AI-generated critiques grounded in an explicit principle set.",
    category: "ai-concepts",
    relatedSlugs: ["llm", "fine-tuning"],
    seeAlso: [
      {
        label: "Anthropic — Core views on AI safety",
        url: "https://www.anthropic.com/news/core-views-on-ai-safety",
      },
    ],
  },
  {
    slug: "fine-tuning",
    term: "Fine-Tuning",
    short:
      "Adjusting a pre-trained model on a narrower dataset so it specialises in a specific domain or style.",
    long: "**Fine-tuning** takes a general model and trains it further on a targeted corpus — legal documents, internal code, a brand's voice. It's more expensive than prompt engineering but produces more consistent domain behaviour when the base model's in-context learning is insufficient. For most applications, system prompts plus retrieval beat fine-tuning on speed and cost.",
    category: "ai-concepts",
    relatedSlugs: ["llm", "rlhf", "rag"],
    seeAlso: [
      {
        label: "Anthropic — Fine-tuning Claude Haiku",
        url: "https://www.anthropic.com/news/fine-tune-claude-3-haiku",
      },
    ],
  },
  {
    slug: "agent",
    term: "AI Agent",
    short:
      "An LLM-driven system that plans, uses tools, and takes multi-step actions toward a goal — not just one-shot Q&A.",
    long: "An **AI agent** is an LLM orchestrating a loop of *observe → think → act → observe* with external tools (search, code execution, APIs, file edits). Claude Code, ChatGPT Operator, and multi-step research assistants are agents. The defining trait is autonomy across multiple tool calls, rather than stateless prompt-response.",
    category: "ai-concepts",
    relatedSlugs: ["llm", "mcp", "react"],
    seeAlso: [
      {
        label: "Anthropic — Building effective agents",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
      },
    ],
  },
  {
    slug: "mcp",
    term: "MCP — Model Context Protocol",
    short:
      "An open standard for connecting LLMs to external tools, resources, and data sources.",
    long: "The **Model Context Protocol** is a JSON-RPC standard created by Anthropic that lets any LLM client (Claude Desktop, Claude Code, Cursor, etc.) discover and call *tools* served by any MCP server. Servers wrap databases, APIs, filesystems, or bespoke business logic; clients invoke them uniformly. MCP replaces ad-hoc function-calling glue with a portable, language-agnostic protocol.",
    category: "ai-concepts",
    relatedSlugs: ["agent", "claude-code"],
    seeAlso: [
      {
        label: "Model Context Protocol — specification",
        url: "https://modelcontextprotocol.io/",
      },
    ],
  },
  {
    slug: "xml-tags",
    term: "XML Tags (for Claude)",
    short:
      "Structural delimiters like <context>, <task>, <format> that Claude is trained to parse especially cleanly.",
    long: "Claude's training gave special weight to **XML-style tags** as a way to separate a prompt's components. Wrapping your instructions in `<context>`, `<task>`, `<examples>`, and `<format>` blocks measurably improves Claude's compliance with multi-part requests, particularly on long-context tasks. Anthropic's prompt-engineering docs recommend tags any time you combine more than two ingredients.",
    category: "ai-concepts",
    relatedSlugs: ["prompt-engineering", "co-star", "claude"],
    seeAlso: [
      {
        label: "Anthropic — Use XML tags",
        url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags",
      },
    ],
  },
  {
    slug: "rag",
    term: "RAG — Retrieval-Augmented Generation",
    short:
      "Fetching relevant documents from an external store and injecting them into the prompt before generation.",
    long: "**Retrieval-augmented generation** grounds an LLM's response in specific documents retrieved on demand — company wikis, a research corpus, a user's files. A retriever (typically embedding-based) selects the most relevant chunks; the model then answers over those chunks, citing them. RAG is the most cost-effective way to combat hallucinations on factual queries.",
    category: "ai-concepts",
    relatedSlugs: ["hallucination", "embeddings", "context-window"],
    seeAlso: [
      {
        label: "Anthropic — Contextual retrieval",
        url: "https://www.anthropic.com/news/contextual-retrieval",
      },
    ],
  },
  {
    slug: "temperature",
    term: "Temperature",
    short:
      "A sampling parameter (0–1) that controls how random an LLM's token selection is.",
    long: "**Temperature** scales the probability distribution over candidate tokens. At 0, the model picks the single highest-probability token every time (deterministic, best for analysis). Near 1, sampling becomes diffuse and outputs vary across runs (useful for brainstorming). Most API callers default to 0–0.3 for production work.",
    category: "ai-concepts",
    relatedSlugs: ["llm", "prompt"],
    seeAlso: [
      {
        label: "Anthropic — API parameters",
        url: "https://docs.claude.com/en/api/messages",
      },
    ],
  },
  {
    slug: "system-prompt",
    term: "System Prompt",
    short:
      "A persistent instruction block that shapes the model's behaviour across every turn of a conversation.",
    long: "The **system prompt** sets the role, rules, and voice for every response in a session. Unlike the per-turn user prompt, it stays fixed and is weighted heavily by the model. In the Claude API it lives in the `system` field; in Claude Code, it's assembled from `CLAUDE.md` plus skills and sub-agent configuration.",
    category: "ai-concepts",
    relatedSlugs: ["prompt", "prompt-engineering", "claude-code"],
    seeAlso: [
      {
        label: "Anthropic — Giving Claude a role",
        url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/system-prompts",
      },
    ],
  },
  {
    slug: "chain-of-thought",
    term: "Chain-of-Thought (CoT)",
    short:
      "Prompting the model to show its reasoning step by step, which dramatically improves accuracy on hard problems.",
    long: "**Chain-of-thought** prompting asks the model to 'think step by step' before giving a final answer. On multi-step reasoning, math, or code-tracing problems, CoT can move a model from 40 % to 80 % accuracy without any weight change — all it does is extend the compute budget at inference time. Extended-thinking modes on Claude 4.x expose this as a first-class setting.",
    category: "ai-concepts",
    relatedSlugs: ["prompt-engineering", "react"],
    seeAlso: [
      {
        label: "Anthropic — Extended thinking",
        url: "https://docs.claude.com/en/docs/build-with-claude/extended-thinking",
      },
    ],
  },
  {
    slug: "embeddings",
    term: "Embeddings",
    short:
      "Dense numerical vectors that place similar texts near each other — the backbone of semantic search and RAG.",
    long: "An **embedding** is a high-dimensional vector (often 768–3 072 floats) that represents the meaning of a chunk of text. Documents with similar meaning cluster geometrically, which is why embeddings power vector search, clustering, classification, and RAG retrieval. Voyage AI and OpenAI publish leading embedding models.",
    category: "ai-concepts",
    relatedSlugs: ["rag", "llm"],
    seeAlso: [
      {
        label: "Voyage AI — Embeddings",
        url: "https://blog.voyageai.com/",
      },
    ],
  },

  // ━━━ Tools ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "claude",
    term: "Claude",
    short:
      "Anthropic's family of LLMs — Opus, Sonnet, Haiku — known for long-context reasoning and coding.",
    long: "**Claude** is Anthropic's assistant family, spanning **Opus** (deepest reasoning), **Sonnet** (the default all-rounder and what this app uses), and **Haiku** (fastest, cheapest). Claude is available via the web interface at claude.ai, the Anthropic API, and as the brain behind Claude Code.",
    category: "tools",
    relatedSlugs: ["claude-code", "xml-tags", "system-prompt"],
    seeAlso: [
      {
        label: "Claude — claude.ai",
        url: "https://claude.ai/",
      },
      {
        label: "Anthropic — models overview",
        url: "https://docs.claude.com/en/docs/about-claude/models",
      },
    ],
  },
  {
    slug: "claude-code",
    term: "Claude Code",
    short:
      "Anthropic's agentic coding environment — CLI, IDE plugins, and web app that operates on your whole repo.",
    long: "**Claude Code** is Anthropic's agentic coding tool. It reads your repository, edits files, runs commands, and coordinates multiple sub-agents via MCP. Projects guide its behaviour with a `CLAUDE.md` at the repo root plus skills, hooks, and settings. Available as a terminal CLI, a VS Code extension, a JetBrains plugin, and at claude.com/code.",
    category: "tools",
    relatedSlugs: ["claude", "mcp", "agent"],
    seeAlso: [
      {
        label: "Claude Code — docs",
        url: "https://docs.claude.com/en/docs/claude-code/overview",
      },
    ],
  },
  {
    slug: "chatgpt",
    term: "ChatGPT",
    short:
      "OpenAI's conversational assistant — the product that popularised LLM chat interfaces.",
    long: "**ChatGPT** is OpenAI's consumer-facing LLM product, launched November 2022. It ships on top of the GPT-4o and o-series reasoning models and integrates custom GPTs, Projects, memory, and plug-ins. It's the most widely-used AI assistant outside of productivity embedding (Copilot, Gemini in Workspace).",
    category: "tools",
    relatedSlugs: ["llm", "claude", "copilot"],
    seeAlso: [{ label: "ChatGPT", url: "https://chat.openai.com/" }],
  },
  {
    slug: "copilot",
    term: "GitHub Copilot",
    short:
      "AI pair-programmer built into GitHub and editors, powered by a mix of OpenAI, Anthropic, and Google models.",
    long: "**GitHub Copilot** provides inline code completion, chat, and more recently agent-style actions across VS Code, JetBrains, and GitHub.com. It routes requests across model providers (OpenAI GPT, Anthropic Claude, Google Gemini) and is the highest-penetration AI tool among working developers.",
    category: "tools",
    relatedSlugs: ["llm", "claude-code", "cursor"],
    seeAlso: [{ label: "GitHub Copilot", url: "https://github.com/features/copilot" }],
  },
  {
    slug: "cursor",
    term: "Cursor",
    short:
      "An AI-native editor (a VS Code fork) with deep inline code generation, chat, and agent workflows.",
    long: "**Cursor** is an IDE built specifically around AI coding — tab-to-accept completions, repo-wide chat, and autonomous agents. It was an early test-bed for agent UX patterns later adopted in Claude Code and Copilot.",
    category: "tools",
    relatedSlugs: ["copilot", "claude-code"],
    seeAlso: [{ label: "Cursor", url: "https://cursor.com/" }],
  },

  // ━━━ Frameworks ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "prompt-engineering",
    term: "Prompt Engineering",
    short:
      "The craft of writing, testing, and iterating on prompts to reliably produce useful LLM outputs.",
    long: "**Prompt engineering** is the discipline of structuring inputs so a model produces high-quality, predictable outputs. It spans role framing, few-shot examples, XML structuring, format constraints, and test-driven iteration. Anthropic publishes a full course at docs.claude.com; this app's Prompt Lab is designed to practise it.",
    category: "frameworks",
    relatedSlugs: ["prompt", "co-star", "risen", "xml-tags"],
    seeAlso: [
      {
        label: "Anthropic — Prompt engineering overview",
        url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview",
      },
    ],
  },
  {
    slug: "co-star",
    term: "CO-STAR",
    short:
      "A 6-part prompt framework: Context, Objective, Style, Tone, Audience, Response.",
    long: "**CO-STAR** is a general-purpose prompt template originally published by GovTech Singapore. Each letter prompts you to specify one dimension of the request, so nothing's left implicit. It's the most widely-taught framework and pairs well with XML tags for Claude.",
    category: "frameworks",
    relatedSlugs: ["prompt-engineering", "risen", "xml-tags"],
    seeAlso: [
      {
        label: "GovTech Singapore — CO-STAR",
        url: "https://medium.com/data-and-beyond/prompt-engineering-framework-co-star-5a3f6a6da06f",
      },
    ],
  },
  {
    slug: "risen",
    term: "RISEN",
    short:
      "A task-focused prompt framework: Role, Instructions, Steps, End goal, Narrowing.",
    long: "**RISEN** is a goal-oriented prompt framework. Start by pinning down the role, spell out the instructions, break the task into steps, state the end goal, and narrow with constraints. It maps cleanly onto procedural tasks — drafting, coding, analysis — where you can enumerate the steps.",
    category: "frameworks",
    relatedSlugs: ["prompt-engineering", "co-star"],
    seeAlso: [
      {
        label: "RISEN framework walkthrough",
        url: "https://www.linkedin.com/pulse/risen-framework-better-prompts-maven-risem",
      },
    ],
  },
  {
    slug: "react",
    term: "ReAct",
    short:
      "A prompting pattern that alternates Reasoning and Acting — the model thinks, takes a tool action, observes, repeats.",
    long: "**ReAct** (Yao et al. 2022) interleaves *thought* and *action* tokens so an agent can reason about a problem, call a tool, observe the result, and think again. It is the conceptual backbone of most agent loops today, including Claude Code's sub-agents.",
    category: "frameworks",
    relatedSlugs: ["agent", "chain-of-thought"],
    seeAlso: [
      {
        label: "ReAct paper (arXiv 2210.03629)",
        url: "https://arxiv.org/abs/2210.03629",
      },
    ],
  },

  // ━━━ LA workforce ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "soc",
    term: "SOC — Standard Occupational Classification",
    short:
      "The U.S. federal taxonomy of occupations — 6-digit codes slotting every job into ~800 detailed categories.",
    long: "The **Standard Occupational Classification** (SOC 2018) is the BLS's taxonomy for U.S. occupations. Every job maps to a 6-digit code — e.g. *51-4121 Welders, Cutters, Solderers, and Brazers* — organised into families and broad occupations. BLS OEWS, O*NET, and this app all key personalization off SOC codes.",
    category: "la-workforce",
    relatedSlugs: ["naics", "onet", "oews"],
    seeAlso: [
      {
        label: "BLS — SOC 2018 manual",
        url: "https://www.bls.gov/soc/2018/",
      },
    ],
  },
  {
    slug: "naics",
    term: "NAICS — North American Industry Classification System",
    short:
      "The U.S./Canada/Mexico industry taxonomy — how industries (not occupations) are coded.",
    long: "**NAICS** classifies *businesses* by industry; SOC classifies *jobs*. A welder (SOC 51-4121) might work at a shipyard (NAICS 3366) or a pipeline contractor (NAICS 237120). The two taxonomies cross-reference each other and are used together for labor-market analysis.",
    category: "la-workforce",
    relatedSlugs: ["soc"],
    seeAlso: [
      {
        label: "U.S. Census Bureau — NAICS",
        url: "https://www.census.gov/naics/",
      },
    ],
  },
  {
    slug: "onet",
    term: "O*NET",
    short:
      "The U.S. Department of Labor's database of tasks, skills, abilities, and technologies for every SOC code.",
    long: "**O*NET** (Occupational Information Network, 28th release) is the canonical U.S. dataset describing what workers in each SOC actually do. It catalogues tasks, tools and technologies, skills, knowledge areas, work activities, and work context — the raw material for per-SOC skill bundles in this app.",
    category: "la-workforce",
    relatedSlugs: ["soc", "oews"],
    seeAlso: [{ label: "O*NET OnLine", url: "https://www.onetonline.org/" }],
  },
  {
    slug: "oews",
    term: "OEWS — Occupational Employment and Wage Statistics",
    short:
      "BLS's annual program publishing employment counts and wage percentiles per SOC, per state and metro.",
    long: "**OEWS** reports how many people work in each SOC in each state/metro and what they earn at the 10th, 25th, 50th, 75th, and 90th percentiles. Louisiana's OEWS release is the source for every `laEmployment` and `laMedianWage` figure in this app.",
    category: "la-workforce",
    relatedSlugs: ["soc", "wage-premium"],
    seeAlso: [{ label: "BLS OEWS — Louisiana", url: "https://www.bls.gov/oes/current/oes_la.htm" }],
  },
  {
    slug: "rlma",
    term: "RLMA — Regional Labor Market Area",
    short:
      "The Louisiana Workforce Commission's 8-region breakdown of the state's labor markets.",
    long: "**Regional Labor Market Areas** are the LWC's eight multi-parish planning regions: New Orleans, Baton Rouge, Houma, Lafayette, Lake Charles, Alexandria, Shreveport, Monroe. Every Louisiana parish sits in exactly one RLMA; this app uses them as the default geographic grain for local-employer and megaproject surfacing.",
    category: "la-workforce",
    relatedSlugs: ["parish", "lwc", "megaproject"],
    seeAlso: [{ label: "Louisiana Workforce Commission", url: "https://www.laworks.net/" }],
  },
  {
    slug: "parish",
    term: "Parish",
    short:
      "Louisiana's equivalent of a county — the state has 64 parishes as of 2020.",
    long: "**Parishes** are Louisiana's county-equivalent administrative subdivisions, a legacy of the state's French and Spanish colonial history. The Census tracks 64 parishes statewide; each maps into one of the LWC's 8 RLMAs.",
    category: "la-workforce",
    relatedSlugs: ["rlma"],
    seeAlso: [
      {
        label: "Louisiana Secretary of State — Parishes",
        url: "https://www.sos.la.gov/HistoricalResources/PublishedDocuments/HistoryOfLouisianaSymbols.pdf",
      },
    ],
  },
  {
    slug: "megaproject",
    term: "Megaproject",
    short:
      "A large, long-horizon industrial build — the Louisiana ones defining this app's priority SOC list.",
    long: "In this app, **megaproject** refers to the five named anchor investments: Meta Hyperion (Richland), Amazon AWS (Caddo/Bossier), Hyundai Steel (Ascension), Hut 8 / Jacobs (West Feliciana), and SSE Steel / Persona AI (St. Bernard). Each creates thousands of construction and operations jobs and shifts the AI-literacy demand in its region.",
    category: "la-workforce",
    relatedSlugs: ["led", "rlma"],
    seeAlso: [
      { label: "Louisiana Economic Development", url: "https://www.opportunitylouisiana.gov/" },
    ],
  },
  {
    slug: "led",
    term: "LED — Louisiana Economic Development",
    short:
      "The state agency that brokers major business-attraction deals and publishes the official project announcements.",
    long: "**Louisiana Economic Development** (opportunityLouisiana.gov) is the executive-branch agency responsible for attracting and retaining investment. Its press releases and project databases are the canonical source for megaproject metadata used in this app.",
    category: "la-workforce",
    relatedSlugs: ["megaproject", "lwc"],
    seeAlso: [
      { label: "Louisiana Economic Development", url: "https://www.opportunitylouisiana.gov/" },
    ],
  },
  {
    slug: "lwc",
    term: "LWC — Louisiana Workforce Commission",
    short:
      "The state agency that runs Louisiana's workforce data, Star Jobs, and RLMA definitions.",
    long: "The **Louisiana Workforce Commission** publishes the state's labor-market information, manages the unemployment insurance system, and operates the Star Jobs career portal. It defines the 8 RLMAs this app uses.",
    category: "la-workforce",
    relatedSlugs: ["rlma", "led", "oews"],
    seeAlso: [{ label: "Louisiana Workforce Commission", url: "https://www.laworks.net/" }],
  },

  // ━━━ Methodology ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "ai-exposure",
    term: "AI Exposure",
    short:
      "The % of an occupation's tasks an LLM can plausibly assist with — high exposure does not imply replacement.",
    long: "**AI exposure** is a 0–100 measure of how many of a job's routine tasks can be at least partially performed by an LLM. Eloundou et al. (2024) estimate that ≈80 % of U.S. workers have ≥10 % of their tasks exposed. Exposure is a *capability* signal; whether exposure becomes *augmentation* or *replacement* depends on economic, regulatory, and adoption factors.",
    category: "methodology",
    relatedSlugs: ["augmentation", "replacement", "eloundou-framework", "confidence-level"],
    seeAlso: [
      {
        label: "Eloundou et al. (2024) — GPTs are GPTs",
        url: "https://openai.com/research/gpts-are-gpts",
      },
    ],
  },
  {
    slug: "augmentation",
    term: "Augmentation",
    short:
      "The share of exposed tasks where AI makes a human worker faster or better, rather than replacing them.",
    long: "**Augmentation** is the component of AI exposure that lifts worker productivity without eliminating the role. Anthropic's Economic Index (2025) reports a ~57 % / 43 % split between augmentation and automation across observed Claude usage. Occupations high on augmentation tend to reward AI-literacy investment; those skewed toward replacement face higher displacement risk.",
    category: "methodology",
    relatedSlugs: ["ai-exposure", "replacement", "anthropic-economic-index", "wage-premium"],
    seeAlso: [
      {
        label: "Anthropic Economic Index (2025)",
        url: "https://www.anthropic.com/research/economic-index",
      },
    ],
  },
  {
    slug: "replacement",
    term: "Replacement (Automation)",
    short:
      "The share of exposed tasks where AI substitutes for human labor — the automation component.",
    long: "**Replacement** (also called *automation*) is the portion of exposure where AI removes the need for a human on a given task. It's the counterpart to augmentation. Anthropic Economic Index 2025 estimates the national augmentation-to-replacement split at roughly 57 % / 43 %, with wide variation across occupations. In this app, replacement is calibrated per SOC with a confidence level.",
    category: "methodology",
    relatedSlugs: ["augmentation", "ai-exposure", "anthropic-economic-index"],
    seeAlso: [
      {
        label: "Anthropic Economic Index (2025)",
        url: "https://www.anthropic.com/research/economic-index",
      },
    ],
  },
  {
    slug: "wage-premium",
    term: "Wage Premium",
    short:
      "The pay uplift associated with AI-skilled roles relative to their non-AI-skilled counterparts.",
    long: "The **wage premium** is the observed difference in median wages between AI-skilled and non-AI-skilled workers in the same occupation. PwC's 2024/2025 AI Jobs Barometer reports a ~56 % national average premium; this app calibrates per-SOC multipliers against BLS OEWS LA percentiles with a confidence label.",
    category: "methodology",
    relatedSlugs: ["oews", "ai-exposure", "confidence-level"],
    seeAlso: [
      {
        label: "PwC AI Jobs Barometer 2024",
        url: "https://www.pwc.com/gx/en/issues/artificial-intelligence/ai-jobs-barometer.html",
      },
    ],
  },
  {
    slug: "confidence-level",
    term: "Confidence Level",
    short:
      "A low/medium/high qualifier on every published score, signalling how robust the underlying evidence is.",
    long: "Every score card metric (exposure, augmentation, replacement, wage premium) carries a **confidence level** — `low`, `medium`, or `high`. *High* = direct published data for the exact SOC; *medium* = sector-mean with a documented adjustment; *low* = inferred from a coarser category, a proxy, or a single source. Confidence is displayed in the UI next to every number.",
    category: "methodology",
    relatedSlugs: ["ai-exposure", "augmentation", "replacement", "wage-premium"],
    seeAlso: [],
  },
  {
    slug: "eloundou-framework",
    term: "Eloundou Exposure Framework",
    short:
      "Eloundou et al. (2024): task-level binary exposure labels aggregated to SOC codes — the basis for AI-exposure scoring.",
    long: "Eloundou, Manning, Mishkin, and Rock (2024) published per-task binary exposure labels across 19 452 detailed tasks, aggregated to SOC. Their headline finding: about 80 % of U.S. workers have ≥10 % of their tasks exposed to LLMs. This app's exposure metric inherits their aggregation method; raw data is publicly available as supplementary material.",
    category: "methodology",
    relatedSlugs: ["ai-exposure", "onet", "soc"],
    seeAlso: [
      {
        label: "Eloundou et al. — GPTs are GPTs (Science, 2024)",
        url: "https://arxiv.org/abs/2303.10130",
      },
    ],
  },
  {
    slug: "anthropic-economic-index",
    term: "Anthropic Economic Index",
    short:
      "Anthropic's 2025 public dataset measuring how Claude is actually being used across occupations and tasks.",
    long: "The **Anthropic Economic Index** (2025) analyses millions of anonymised Claude.ai conversations and maps them onto O*NET tasks and SOC codes. It reports the real-world split between augmentation (≈57 %) and automation (≈43 %) across categories — an empirical counterweight to theoretical exposure estimates. The Index is the source for this app's per-SOC augmentation vs replacement calibration.",
    category: "methodology",
    relatedSlugs: ["augmentation", "replacement", "ai-exposure"],
    seeAlso: [
      {
        label: "Anthropic Economic Index",
        url: "https://www.anthropic.com/research/economic-index",
      },
    ],
  },
  {
    slug: "three-dimensional-literacy",
    term: "Three-Dimensional AI Literacy",
    short:
      "Long & Magerko's (2020) framework: AI literacy spans technical, critical, and ethical dimensions.",
    long: "**AI literacy**, per Long & Magerko (2020), is not a single skill but three intersecting ones: **technical** (how the tools work), **critical** (when to trust outputs and how to verify them), and **ethical** (responsible use, bias, accountability). This app's skill bundles for every SOC are structured along these three dimensions plus an occupation-specific domain track.",
    category: "methodology",
    relatedSlugs: [
      "technical-literacy",
      "critical-literacy",
      "ethical-literacy",
    ],
    seeAlso: [
      {
        label: "Long & Magerko (2020) — What is AI Literacy?",
        url: "https://doi.org/10.1145/3313831.3376727",
      },
    ],
  },
  {
    slug: "technical-literacy",
    term: "Technical AI Literacy",
    short:
      "Understanding how LLMs, tokens, and prompt structure actually work at a conceptual level.",
    long: "**Technical literacy** is the first dimension of Long & Magerko's framework. It covers how LLMs learn, what tokens and context windows are, how prompts change behaviour, and the mechanics of tool use. It's what lets a worker prompt effectively rather than cargo-culting.",
    category: "methodology",
    relatedSlugs: ["three-dimensional-literacy", "llm", "prompt-engineering"],
    seeAlso: [
      {
        label: "Long & Magerko (2020)",
        url: "https://doi.org/10.1145/3313831.3376727",
      },
    ],
  },
  {
    slug: "critical-literacy",
    term: "Critical AI Literacy",
    short:
      "Knowing when to trust AI output, when to verify it, and when to override it entirely.",
    long: "**Critical literacy** is the second Long-&-Magerko dimension: the judgment skills to evaluate AI output for correctness, bias, and fit-for-purpose. It includes verifying citations, cross-checking facts, recognising hallucinations, and tolerating uncertainty in outputs.",
    category: "methodology",
    relatedSlugs: ["three-dimensional-literacy", "hallucination"],
    seeAlso: [
      {
        label: "Long & Magerko (2020)",
        url: "https://doi.org/10.1145/3313831.3376727",
      },
    ],
  },
  {
    slug: "ethical-literacy",
    term: "Ethical AI Literacy",
    short:
      "Recognising bias, protecting privacy, and using AI responsibly in professional and academic contexts.",
    long: "**Ethical literacy** is the third Long-&-Magerko dimension: recognising bias in training data, protecting privacy of human subjects and coworkers, following institutional policies, and maintaining accountability for AI-assisted decisions. For regulated sectors (healthcare, education, finance) it's the dominant dimension.",
    category: "methodology",
    relatedSlugs: ["three-dimensional-literacy", "critical-literacy"],
    seeAlso: [
      {
        label: "Long & Magerko (2020)",
        url: "https://doi.org/10.1145/3313831.3376727",
      },
    ],
  },
]
