import type { Module } from "./types"

export const MODULES: readonly Module[] = [
  // ━━━ Module 1: AI Fundamentals ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "ai-fundamentals",
    slug: "ai-fundamentals",
    title: "How AI Works",
    description:
      "Understand the foundations of modern AI — from large language models to tokens and context windows. Learn what AI can and cannot do.",
    icon: "Brain",
    roles: ["student", "professor", "developer"],
    estimatedMinutes: 25,
    prerequisites: [],
    sections: [
      {
        id: "what-is-llm",
        title: "What Is a Large Language Model?",
        blocks: [
          { type: "heading", level: 2, text: "What Is a Large Language Model?" },
          {
            type: "paragraph",
            text: "A Large Language Model (LLM) is an AI system trained on vast amounts of text data to understand and generate human language. Models like Claude, GPT, and Gemini are all LLMs. They learn patterns in language — grammar, facts, reasoning styles, and even coding conventions — by processing billions of documents.",
          },
          {
            type: "callout",
            variant: "info",
            title: "Key Insight",
            text: "LLMs don't \"know\" things the way humans do. They've learned statistical patterns about how words and ideas relate to each other. This is powerful but fundamentally different from human understanding.",
          },
          {
            type: "paragraph",
            text: "Think of an LLM like an incredibly well-read assistant that has processed millions of books, articles, and conversations. It can draw on all of that to help you, but it's working from patterns, not personal experience or real-time information.",
          },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Training**: LLMs are trained on large datasets of text from the internet, books, code, and other sources",
              "**Parameters**: Models have billions of adjustable parameters that encode learned patterns",
              "**Fine-tuning**: After initial training, models are refined for specific tasks like following instructions or being helpful",
              "**RLHF**: Reinforcement Learning from Human Feedback helps models align with human preferences and values",
            ],
          },
          {
            type: "quiz",
            id: "llm-basics-1",
            question: "What is the primary way LLMs generate responses?",
            options: [
              "By searching the internet in real time",
              "By predicting the next most likely token based on learned patterns",
              "By retrieving answers from a database of pre-written responses",
              "By simulating human consciousness",
            ],
            correctIndex: 1,
            explanation:
              "LLMs generate text by predicting the next token (word or word-part) based on patterns learned during training. They don't search the internet or retrieve pre-written answers — they generate new text each time.",
          },
        ],
      },
      {
        id: "tokens-and-context",
        title: "Tokens, Context Windows, and Why They Matter",
        blocks: [
          { type: "heading", level: 2, text: "Tokens, Context Windows, and Why They Matter" },
          {
            type: "paragraph",
            text: "When you type a message to an AI, your text is broken into **tokens** — small chunks of text, roughly 3-4 characters each. The word \"understanding\" might be split into \"under\" + \"standing\". Every AI model has a **context window** — the maximum number of tokens it can process in a single conversation.",
          },
          {
            type: "callout",
            variant: "tip",
            title: "Rule of Thumb",
            text: "1 token ≈ ¾ of a word in English. So 100,000 tokens ≈ 75,000 words ≈ roughly a 300-page book.",
          },
          {
            type: "paragraph",
            text: "Context windows matter because they determine how much information the AI can \"see\" at once. Claude's context window is 200,000 tokens — enough to process entire codebases or lengthy documents. But even with large windows, the AI's attention is not equally distributed across all tokens.",
          },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Token limit**: Each API call has a maximum input + output token count",
              "**Cost**: You pay per token (input and output), so efficiency matters",
              "**Attention**: Information at the beginning and end of the context tends to be weighted more heavily",
              "**Context engineering**: The practice of carefully managing what information goes into the context window",
            ],
          },
          {
            type: "quiz",
            id: "tokens-1",
            question: "Approximately how many words fit in a 100,000-token context window?",
            options: ["10,000 words", "25,000 words", "75,000 words", "100,000 words"],
            correctIndex: 2,
            explanation:
              "One token is roughly ¾ of a word, so 100,000 tokens ≈ 75,000 words. This is enough to process substantial documents, but you still need to be strategic about what you include.",
          },
        ],
      },
      {
        id: "how-ai-generates-text",
        title: "How AI Generates Text",
        blocks: [
          { type: "heading", level: 2, text: "How AI Generates Text" },
          {
            type: "paragraph",
            text: "AI generates text one token at a time through **next-token prediction**. Given everything that came before, the model predicts what token is most likely to come next. It does this thousands of times to produce a complete response.",
          },
          {
            type: "paragraph",
            text: "This process is probabilistic — the model assigns probabilities to many possible next tokens and samples from that distribution. Parameters like **temperature** control how random this sampling is: low temperature produces more predictable text, high temperature produces more creative (but potentially less accurate) text.",
          },
          {
            type: "callout",
            variant: "important",
            title: "This Explains Hallucinations",
            text: "Because the model generates text based on what \"sounds right\" statistically, it can produce confident-sounding text that is factually incorrect. The model doesn't have a separate fact-checking system — it's all pattern matching.",
          },
          {
            type: "list",
            style: "ordered",
            items: [
              "Your prompt is tokenized and fed into the model",
              "The model processes all tokens through its neural network",
              "It generates a probability distribution over possible next tokens",
              "A token is sampled from this distribution",
              "Steps 2-4 repeat until the response is complete",
            ],
          },
        ],
      },
      {
        id: "capabilities-and-limits",
        title: "Capabilities and Hard Limits",
        blocks: [
          { type: "heading", level: 2, text: "Capabilities and Hard Limits" },
          {
            type: "paragraph",
            text: "Modern AI models are remarkably capable at many tasks, but they have fundamental limitations that every user should understand. Knowing these boundaries helps you use AI effectively and avoid costly mistakes.",
          },
          {
            type: "heading", level: 3, text: "What AI Does Well"
          },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Writing and editing**: Drafting, summarizing, translating, and refining text",
              "**Code generation**: Writing, reviewing, and debugging code across many languages",
              "**Analysis**: Breaking down complex topics, comparing options, identifying patterns",
              "**Brainstorming**: Generating ideas, exploring angles, creative problem-solving",
              "**Explanation**: Making complex concepts accessible at any level",
              "**Structured tasks**: Following templates, formatting data, organizing information",
            ],
          },
          {
            type: "heading", level: 3, text: "Hard Limits"
          },
          {
            type: "list",
            style: "unordered",
            items: [
              "**No real-time information**: Training data has a cutoff date — the model doesn't know about events after that",
              "**No true reasoning**: While models can simulate reasoning, they can make logical errors that a human wouldn't",
              "**Hallucination risk**: Models can state incorrect information with high confidence",
              "**No persistent memory**: Each conversation starts fresh (unless using special features like Projects)",
              "**No internet access**: Unless connected to tools/MCP servers, models can't browse the web",
              "**No emotional understanding**: Models simulate empathy but don't feel emotions",
            ],
          },
          {
            type: "quiz",
            id: "capabilities-1",
            question: "Which of the following is a fundamental limitation of current LLMs?",
            options: [
              "They cannot generate code",
              "They can produce confident-sounding but factually incorrect information",
              "They can only respond in English",
              "They require an internet connection to generate text",
            ],
            correctIndex: 1,
            explanation:
              "Hallucination — generating plausible but incorrect information — is a fundamental limitation. Models don't have a built-in fact-checker; they generate text based on learned patterns, which can sometimes produce errors.",
          },
        ],
      },
      {
        id: "ai-models-overview",
        title: "Overview of Major AI Models",
        blocks: [
          { type: "heading", level: 2, text: "Overview of Major AI Models" },
          {
            type: "paragraph",
            text: "The AI landscape includes several major model families. Understanding their differences helps you choose the right tool for each task.",
          },
          {
            type: "heading", level: 3, text: "Claude (Anthropic)"
          },
          {
            type: "paragraph",
            text: "Claude is built by Anthropic with a focus on safety, helpfulness, and honesty. The current model family includes **Opus 4.6** (deepest reasoning), **Sonnet 4.6** (best balance of speed and capability), and **Haiku 4.5** (fastest and most cost-effective). Claude excels at long-form analysis, coding, and following nuanced instructions.",
          },
          {
            type: "heading", level: 3, text: "GPT (OpenAI)"
          },
          {
            type: "paragraph",
            text: "OpenAI's GPT family includes GPT-4o and o1/o3 reasoning models. GPT-4o is a strong general-purpose model, while the o-series models focus on extended reasoning for complex problems. Widely adopted with a large plugin ecosystem.",
          },
          {
            type: "heading", level: 3, text: "Gemini (Google)"
          },
          {
            type: "paragraph",
            text: "Google's Gemini models are natively multimodal — designed to process text, images, video, and audio together. They integrate deeply with Google's ecosystem (Search, Workspace, Android).",
          },
          {
            type: "callout",
            variant: "tip",
            title: "Choosing a Model",
            text: "There's no single \"best\" model. The right choice depends on your task, budget, and requirements. For this course, we focus on Claude because of its strong instruction-following, safety features, and powerful coding capabilities.",
          },
        ],
      },
    ],
  },

  // ━━━ Module 2: Prompt Engineering ━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "prompt-engineering",
    slug: "prompt-engineering",
    title: "Prompt Engineering",
    description:
      "Master the art and science of writing effective prompts — from basic principles to advanced frameworks like CO-STAR and Chain-of-Thought.",
    icon: "MessageSquare",
    roles: ["student", "professor", "developer"],
    estimatedMinutes: 35,
    prerequisites: ["ai-fundamentals"],
    sections: [
      {
        id: "why-prompts-matter",
        title: "Why Prompts Matter",
        blocks: [
          { type: "heading", level: 2, text: "Why Prompts Matter" },
          {
            type: "paragraph",
            text: "The quality of your prompt directly determines the quality of the AI's response. A vague prompt gets a generic answer. A well-crafted prompt gets a precise, useful, and targeted response. Prompt engineering is the skill of communicating your intent clearly to an AI system.",
          },
          {
            type: "callout",
            variant: "info",
            title: "The Prompt Gap",
            text: "Studies show that the same AI model can perform at a \"beginner\" or \"expert\" level depending entirely on how it's prompted. The difference isn't the model — it's the prompt.",
          },
          {
            type: "paragraph",
            text: "Think of prompting like giving instructions to a brilliant but literal-minded assistant. They'll do exactly what you ask — so the more specific and clear you are, the better the result.",
          },
        ],
      },
      {
        id: "anatomy-of-great-prompt",
        title: "Anatomy of a Great Prompt",
        blocks: [
          { type: "heading", level: 2, text: "Anatomy of a Great Prompt" },
          {
            type: "paragraph",
            text: "Every effective prompt contains some combination of these five elements. You don't always need all of them, but the more complex your task, the more elements you should include.",
          },
          {
            type: "list",
            style: "ordered",
            items: [
              "**Role**: Who should the AI act as? (e.g., \"You are an experienced data scientist...\")",
              "**Task**: What specific thing should the AI do? (e.g., \"Analyze this dataset and identify trends...\")",
              "**Context**: What background information is relevant? (e.g., \"This data comes from a 2024 customer survey...\")",
              "**Format**: How should the response be structured? (e.g., \"Present findings as a bulleted list with...\")",
              "**Constraints**: What limitations or boundaries apply? (e.g., \"Keep the response under 500 words. Focus only on...\")",
            ],
          },
          {
            type: "code",
            language: "markdown",
            caption: "A weak prompt vs. a strong prompt",
            code: `# Weak prompt:
"Tell me about climate change"

# Strong prompt:
"You are an environmental science educator. Explain the top 3
causes of climate change to a high school student. For each cause:
- Explain the mechanism in simple terms
- Give one real-world example
- Rate its relative impact (high/medium/low)
Keep the total response under 400 words."`,
          },
          {
            type: "quiz",
            id: "prompt-anatomy-1",
            question: "Which element of a prompt helps prevent overly long or off-topic responses?",
            options: ["Role", "Task", "Context", "Constraints"],
            correctIndex: 3,
            explanation:
              "Constraints set boundaries on the response — length limits, topic focus, what to include/exclude. Without constraints, the AI may produce responses that are technically correct but not useful for your specific needs.",
          },
        ],
      },
      {
        id: "prompt-frameworks",
        title: "Prompt Frameworks",
        blocks: [
          { type: "heading", level: 2, text: "Prompt Frameworks" },
          {
            type: "paragraph",
            text: "Frameworks provide a repeatable structure for building effective prompts. Here are the most widely-used frameworks, each suited to different types of tasks.",
          },
          { type: "heading", level: 3, text: "CO-STAR" },
          {
            type: "paragraph",
            text: "**Context, Objective, Style, Tone, Audience, Response** — The most comprehensive general-purpose framework. Covers all dimensions of a good prompt. Best for complex tasks where you need precise control over the output.",
          },
          { type: "heading", level: 3, text: "RISEN" },
          {
            type: "paragraph",
            text: "**Role, Instructions, Steps, End goal, Narrowing** — A goal-oriented framework ideal for task-focused prompts. Works well when you have a clear deliverable in mind and can break the task into steps.",
          },
          { type: "heading", level: 3, text: "Chain-of-Thought (CoT)" },
          {
            type: "paragraph",
            text: "Ask the AI to \"think step by step\" through a problem. This dramatically improves accuracy on reasoning tasks, math problems, and complex analysis. Simply adding \"Let's think through this step by step\" can improve results.",
          },
          { type: "heading", level: 3, text: "ReAct" },
          {
            type: "paragraph",
            text: "**Reasoning + Acting** — A pattern where the AI alternates between observing, thinking, and taking action. Useful for debugging, troubleshooting, and iterative problem-solving.",
          },
          {
            type: "callout",
            variant: "tip",
            title: "Try It in the Prompt Lab",
            text: "Head to the Prompt Lab to try each of these frameworks with guided step-by-step composition. The framework picker will scaffold the structure for you.",
          },
        ],
      },
      {
        id: "xml-tags-for-claude",
        title: "XML Tags and Structured Inputs",
        blocks: [
          { type: "heading", level: 2, text: "XML Tags and Structured Inputs for Claude" },
          {
            type: "paragraph",
            text: "Claude responds especially well to XML-tagged prompts. XML tags create clear sections that help Claude understand the structure of your request. This is one of the most powerful Claude-specific techniques.",
          },
          {
            type: "code",
            language: "xml",
            caption: "Using XML tags to structure a Claude prompt",
            code: `<context>
I'm building a REST API for a task management app.
The app uses PostgreSQL and Express.js.
</context>

<task>
Review the following API endpoint and suggest improvements
for security, performance, and error handling.
</task>

<code>
app.get('/tasks/:id', async (req, res) => {
  const task = await db.query(
    'SELECT * FROM tasks WHERE id = ' + req.params.id
  );
  res.json(task.rows[0]);
});
</code>

<format>
Provide your review as a numbered list of issues, each with:
1. Severity (Critical/High/Medium/Low)
2. Description of the issue
3. Fixed code snippet
</format>`,
          },
          {
            type: "callout",
            variant: "warning",
            title: "Why XML Tags Work",
            text: "Claude was specifically trained to recognize XML tag structure. Using tags like <context>, <task>, <format>, and <examples> helps Claude parse your intent more accurately than plain prose alone.",
          },
          {
            type: "list",
            style: "unordered",
            items: [
              "**<context>**: Background information the AI needs",
              "**<task>** or **<objective>**: What you want accomplished",
              "**<format>** or **<response_format>**: How the output should be structured",
              "**<examples>**: Input/output examples of what you want",
              "**<constraints>**: Boundaries and limitations",
              "**<document>** or **<code>**: Content to analyze or process",
            ],
          },
        ],
      },
      {
        id: "iterative-refinement",
        title: "Iterative Refinement",
        blocks: [
          { type: "heading", level: 2, text: "Iterative Refinement and Evaluation" },
          {
            type: "paragraph",
            text: "Great prompts rarely emerge fully formed. The best prompt engineers iterate: write a prompt, test it, analyze the output, and refine. This cycle of improvement is where the real skill lies.",
          },
          {
            type: "list",
            style: "ordered",
            items: [
              "**Start simple**: Begin with a basic prompt that captures your core intent",
              "**Test it**: Run the prompt and carefully read the output",
              "**Identify gaps**: What's missing? What's wrong? What's unnecessary?",
              "**Add specificity**: Address each gap with more precise instructions",
              "**Test variations**: Try different phrasings, structures, and frameworks",
              "**Evaluate consistently**: Use the same test cases to compare prompt versions",
            ],
          },
          {
            type: "callout",
            variant: "tip",
            title: "The 80/20 Rule of Prompting",
            text: "You'll often get 80% of the way with a basic prompt. The last 20% — getting the output exactly right — is where frameworks, XML tags, examples, and constraints become essential.",
          },
          {
            type: "quiz",
            id: "iteration-1",
            question: "What's the most effective way to improve a prompt that's giving mediocre results?",
            options: [
              "Use a larger, more expensive model",
              "Add more text to make the prompt longer",
              "Identify specific gaps in the output and add targeted instructions",
              "Start completely over with a different approach",
            ],
            correctIndex: 2,
            explanation:
              "The best approach is targeted refinement. Identify exactly what's wrong with the output (too vague? wrong format? missing information?) and add specific instructions to address those gaps. More text doesn't help — more precision does.",
          },
        ],
      },
    ],
  },

  // ━━━ Module 3: Working with Claude ━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "claude-workflows",
    slug: "claude-workflows",
    title: "Working with Claude",
    description:
      "Learn Claude's models, features, and tools — from the web interface to Claude Code and the API. Master practical workflows across all surfaces.",
    icon: "Sparkles",
    roles: ["student", "professor", "developer"],
    estimatedMinutes: 30,
    prerequisites: ["ai-fundamentals"],
    sections: [
      {
        id: "claude-models",
        title: "Claude Models Overview",
        blocks: [
          { type: "heading", level: 2, text: "Claude Models Overview" },
          {
            type: "paragraph",
            text: "Anthropic offers three tiers of Claude models, each optimized for different needs. Choosing the right model balances capability, speed, and cost.",
          },
          { type: "heading", level: 3, text: "Opus 4.6 — Deepest Reasoning" },
          {
            type: "paragraph",
            text: "The most capable model for complex analysis, architectural decisions, and tasks requiring deep reasoning. Best for research, multi-step problem solving, and high-stakes decisions. Higher cost and slower, but produces the most thorough results.",
          },
          { type: "heading", level: 3, text: "Sonnet 4.6 — Best All-Rounder" },
          {
            type: "paragraph",
            text: "The best balance of speed, capability, and cost. Excels at coding, writing, and everyday tasks. This is the recommended model for most use cases — including the Prompt Lab in this app.",
          },
          { type: "heading", level: 3, text: "Haiku 4.5 — Fastest" },
          {
            type: "paragraph",
            text: "The fastest and most cost-effective model. Achieves ~90% of Sonnet's capability at a fraction of the cost. Ideal for high-volume tasks, quick answers, and automated workflows where speed matters more than depth.",
          },
          {
            type: "callout",
            variant: "tip",
            title: "How to Choose",
            text: "Use Haiku for quick tasks and high volume. Use Sonnet for daily work and coding. Use Opus when you need the absolute best reasoning — complex architecture, nuanced analysis, or when the stakes are high.",
          },
        ],
      },
      {
        id: "claude-ai-interface",
        title: "Claude.ai — Chat Interface",
        blocks: [
          { type: "heading", level: 2, text: "Claude.ai — The Chat Interface" },
          {
            type: "paragraph",
            text: "Claude.ai is the web-based chat interface where most people first interact with Claude. It's available at claude.ai and includes several powerful features beyond basic chat.",
          },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Projects**: Organize conversations with persistent context — upload documents, set custom instructions, and maintain project-specific knowledge",
              "**Artifacts**: Claude can create interactive documents, code, and visualizations right in the chat",
              "**Memory**: Claude can remember details across conversations (when enabled)",
              "**File uploads**: Share PDFs, images, code files, and other documents for analysis",
              "**Extended thinking**: For complex tasks, Claude can show its reasoning process",
            ],
          },
          {
            type: "callout",
            variant: "info",
            title: "For Students and Professors",
            text: "Claude.ai Projects is one of the most useful features for academic work. Create a project for each course or research topic, upload relevant papers, and Claude will reference them in its responses.",
          },
        ],
      },
      {
        id: "claude-code",
        title: "Claude Code for Developers",
        blocks: [
          { type: "heading", level: 2, text: "Claude Code for Developers" },
          {
            type: "paragraph",
            text: "Claude Code is Anthropic's agentic coding tool — available as a CLI, VS Code extension, JetBrains plugin, and web app. It can read your entire codebase, make changes across multiple files, run commands, and work as an autonomous coding partner.",
          },
          { type: "heading", level: 3, text: "Key Concepts" },
          {
            type: "list",
            style: "unordered",
            items: [
              "**CLAUDE.md**: A markdown file at your project root that gives Claude persistent instructions — coding style, project conventions, tech stack, and rules",
              "**MCP Servers**: Model Context Protocol servers extend Claude's capabilities — connect to databases, APIs, browser tools, and more",
              "**Skills**: Reusable prompt packages (SKILL.md files) that teach Claude specialized workflows — like TDD, code review, or deployment",
              "**Sub-agents**: Claude Code can launch specialized agents for tasks like exploring the codebase, planning implementations, or running tests",
              "**Multi-surface**: Start a task in the terminal, continue in VS Code, review on the web — your context follows you",
            ],
          },
          {
            type: "code",
            language: "markdown",
            caption: "Example CLAUDE.md file",
            code: `# My Project

## Tech Stack
- React 19, TypeScript, Tailwind CSS
- FastAPI backend, PostgreSQL

## Rules
- Never expose API keys in frontend code
- Use conventional commits (feat:, fix:, etc.)
- All functions must have TypeScript types
- Test coverage minimum: 80%

## Commands
- Dev: \`pnpm dev\`
- Test: \`pnpm test\`
- Build: \`pnpm build\``,
          },
          {
            type: "callout",
            variant: "tip",
            title: "Getting Started with Claude Code",
            text: "Install with `npm install -g @anthropic-ai/claude-code`, then run `claude` in your project directory. Start by creating a CLAUDE.md file — it's the single most impactful thing you can do to improve Claude Code's effectiveness.",
          },
        ],
      },
      {
        id: "claude-api-basics",
        title: "Claude API Basics",
        blocks: [
          { type: "heading", level: 2, text: "Claude API Basics" },
          {
            type: "paragraph",
            text: "The Claude API lets you integrate Claude into your own applications. You send messages and receive responses programmatically. Here's the core concept.",
          },
          {
            type: "code",
            language: "python",
            caption: "Basic Claude API call in Python",
            code: `import anthropic

client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY env var

message = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    max_tokens=1024,
    system="You are a helpful coding assistant.",
    messages=[
        {"role": "user", "content": "Explain what a REST API is in 3 sentences."}
    ]
)

print(message.content[0].text)`,
          },
          {
            type: "code",
            language: "typescript",
            caption: "Basic Claude API call in TypeScript",
            code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // Uses ANTHROPIC_API_KEY env var

const message = await client.messages.create({
  model: "claude-sonnet-4-6-20250514",
  max_tokens: 1024,
  system: "You are a helpful coding assistant.",
  messages: [
    { role: "user", content: "Explain what a REST API is in 3 sentences." }
  ],
});

console.log(message.content[0].text);`,
          },
          {
            type: "list",
            style: "unordered",
            items: [
              "**model**: Which Claude model to use (e.g., claude-sonnet-4-6-20250514)",
              "**max_tokens**: Maximum length of the response",
              "**system**: System prompt — persistent instructions for the AI's behavior",
              "**messages**: The conversation history — alternating user and assistant messages",
            ],
          },
          {
            type: "callout",
            variant: "warning",
            title: "Security Rule",
            text: "Never put your API key directly in code. Always use environment variables. Never expose API keys in frontend/client-side code — make API calls through a backend proxy.",
          },
        ],
      },
    ],
  },

  // ━━━ Module 4: Responsible AI Use ━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "responsible-ai",
    slug: "responsible-ai",
    title: "Responsible AI Use",
    description:
      "Navigate AI's ethical dimensions — hallucinations, bias, privacy, academic integrity, and safety. Learn to use AI critically and responsibly.",
    icon: "Shield",
    roles: ["student", "professor", "developer"],
    estimatedMinutes: 25,
    prerequisites: ["ai-fundamentals"],
    sections: [
      {
        id: "hallucinations",
        title: "Hallucinations — Detection and Prevention",
        blocks: [
          { type: "heading", level: 2, text: "Hallucinations — Detection and Prevention" },
          {
            type: "paragraph",
            text: "AI hallucination occurs when a model generates information that sounds plausible but is factually incorrect, fabricated, or unsupported. This is one of the most critical risks of using AI, because hallucinated content often reads with high confidence.",
          },
          {
            type: "heading", level: 3, text: "Common Types of Hallucinations"
          },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Fabricated citations**: Inventing academic papers, authors, or publication dates that don't exist",
              "**False statistics**: Generating plausible-sounding numbers with no basis in reality",
              "**Conflated facts**: Mixing up details between similar topics, people, or events",
              "**Confident errors**: Stating incorrect information with no hedging or uncertainty signals",
              "**Outdated information**: Presenting old information as current when the model's training data is stale",
            ],
          },
          {
            type: "heading", level: 3, text: "How to Verify AI Output"
          },
          {
            type: "list",
            style: "ordered",
            items: [
              "**Cross-reference claims**: Check key facts against authoritative sources",
              "**Verify citations**: Look up every citation the AI provides — search for the paper title, author, and journal",
              "**Ask for sources**: Prompt the AI to cite its sources, then verify them independently",
              "**Check specifics**: Be extra skeptical of specific numbers, dates, quotes, and names",
              "**Use multiple models**: Cross-check important claims across different AI systems",
              "**Trust domain experts**: When the stakes are high, verify with human experts",
            ],
          },
          {
            type: "callout",
            variant: "warning",
            title: "Critical Rule",
            text: "Never submit AI-generated content — academic or professional — without verification. Treat every factual claim as unverified until you confirm it independently.",
          },
          {
            type: "quiz",
            id: "hallucination-1",
            question: "What should you do when Claude provides a citation for an academic paper?",
            options: [
              "Trust it — Claude's training data includes academic papers",
              "Include it in your bibliography directly",
              "Search for the exact paper title and author to verify it exists",
              "Assume it's incorrect and ignore it",
            ],
            correctIndex: 2,
            explanation:
              "Always verify citations independently. AI models can fabricate plausible-sounding paper titles, author names, and even DOIs. A quick search to confirm the paper exists is essential before including any AI-provided citation.",
          },
        ],
      },
      {
        id: "bias-in-ai",
        title: "Bias in AI Systems",
        blocks: [
          { type: "heading", level: 2, text: "Bias in AI Systems" },
          {
            type: "paragraph",
            text: "AI models reflect the biases present in their training data and the choices made during development. These biases can manifest in subtle ways — reinforcing stereotypes, underrepresenting certain groups, or producing skewed analyses.",
          },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Training data bias**: If the training data overrepresents certain perspectives, the model's outputs will too",
              "**Representation bias**: Certain cultures, languages, and viewpoints may be underrepresented",
              "**Confirmation bias**: AI may reinforce your existing views if you prompt it in a leading way",
              "**Linguistic bias**: Models may default to Western, English-speaking cultural norms",
            ],
          },
          {
            type: "callout",
            variant: "tip",
            title: "Mitigating Bias",
            text: "Actively seek diverse perspectives in your prompts. Ask the AI to consider alternative viewpoints, represent different cultural contexts, and flag potential biases in its own analysis.",
          },
        ],
      },
      {
        id: "privacy-and-data",
        title: "Privacy and Data Safety",
        blocks: [
          { type: "heading", level: 2, text: "Privacy and Data Safety" },
          {
            type: "paragraph",
            text: "When you interact with AI systems, you're sending data to external servers. Understanding what happens to that data is critical for protecting personal information and complying with regulations.",
          },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Don't share sensitive data**: Avoid sending passwords, API keys, financial data, or personally identifiable information (PII) in prompts",
              "**Understand data policies**: Read the AI provider's data usage and retention policies",
              "**Use enterprise tiers**: For business or institutional use, enterprise plans typically offer stronger data protections",
              "**Anonymize when possible**: Remove names, dates, and identifying details before sharing data with AI",
              "**Consider compliance**: FERPA (education), HIPAA (health), GDPR (EU) all have implications for AI use",
            ],
          },
          {
            type: "callout",
            variant: "important",
            title: "For Educators",
            text: "Student data is protected under FERPA. Never paste student names, grades, or other educational records into an AI tool unless your institution has an approved enterprise agreement with the provider.",
          },
        ],
      },
      {
        id: "academic-integrity",
        title: "AI and Academic Integrity",
        blocks: [
          { type: "heading", level: 2, text: "AI and Academic Integrity" },
          {
            type: "paragraph",
            text: "AI tools are changing what academic integrity means. The question is no longer whether students will use AI, but how to use it responsibly and transparently.",
          },
          {
            type: "heading", level: 3, text: "Guidelines for Students"
          },
          {
            type: "list",
            style: "ordered",
            items: [
              "**Know your institution's policy**: AI policies vary widely — from full prohibition to required use. Check your syllabus and department guidelines",
              "**Disclose AI use**: When allowed, always disclose how you used AI tools and to what extent",
              "**AI as a tool, not a shortcut**: Use AI to brainstorm, check understanding, or get feedback — not to generate your submissions",
              "**Your ideas matter**: The value of education is in developing YOUR thinking. AI can assist, but the intellectual work should be yours",
              "**Verify everything**: Any AI-assisted content should be fact-checked and refined by you",
            ],
          },
          {
            type: "heading", level: 3, text: "Guidelines for Professors"
          },
          {
            type: "list",
            style: "ordered",
            items: [
              "**Create clear AI policies**: State explicitly what AI use is and isn't allowed for each assignment",
              "**Design AI-resilient assignments**: Incorporate personal reflection, specific course material references, and higher-order thinking",
              "**Teach AI literacy**: Help students learn to use AI as a thinking tool rather than trying to police its use",
              "**Focus on process, not just product**: Require drafts, outlines, and reflection on the writing/thinking process",
            ],
          },
          {
            type: "callout",
            variant: "info",
            title: "The Bigger Picture",
            text: "AI detection tools are unreliable and can falsely accuse students. Rather than focusing on detection, many educators are shifting to assignment designs that make AI use transparent and learning-focused.",
          },
          {
            type: "quiz",
            id: "integrity-1",
            question: "What's the most effective approach to academic integrity in the age of AI?",
            options: [
              "Ban all AI use and use detection tools to catch violations",
              "Ignore the issue — students will figure it out",
              "Create clear policies, design AI-resilient assignments, and teach responsible AI use",
              "Require all work to be done in supervised, in-person settings",
            ],
            correctIndex: 2,
            explanation:
              "The most effective approach combines clear policies, thoughtful assignment design, and AI literacy education. Detection tools are unreliable, bans are difficult to enforce, and avoiding the topic leaves students unprepared for a world where AI is ubiquitous.",
          },
        ],
      },
    ],
  },

  // ━━━ Module 5: Practical Workflows ━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: "practical-workflows",
    slug: "practical-workflows",
    title: "Practical Workflows by Role",
    description:
      "Role-specific guides for using AI effectively — whether you're writing research papers, designing curricula, or building software.",
    icon: "Workflow",
    roles: ["student", "professor", "developer"],
    estimatedMinutes: 20,
    prerequisites: ["prompt-engineering"],
    sections: [
      {
        id: "student-workflows",
        title: "Student Workflows",
        blocks: [
          { type: "heading", level: 2, text: "Student Workflows" },
          {
            type: "paragraph",
            text: "AI can be a powerful study and research companion when used responsibly. Here are practical workflows that enhance your learning without compromising academic integrity.",
          },
          { type: "heading", level: 3, text: "Research and Writing" },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Brainstorming**: Use AI to generate thesis angles, explore counterarguments, and identify gaps in your thinking",
              "**Outlining**: Ask AI to help structure your argument — then fill in the content with your own research and analysis",
              "**Feedback**: Paste your draft and ask for specific feedback (\"Is my argument logical? Are there gaps in my evidence?\")",
              "**Editing**: Use AI for grammar, clarity, and style — but keep your voice and ideas",
            ],
          },
          { type: "heading", level: 3, text: "Study and Comprehension" },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Concept explanation**: Ask AI to explain difficult concepts at your level, with analogies",
              "**Study plans**: Generate structured study schedules based on your exam dates and topics",
              "**Practice questions**: Ask AI to create practice questions from your course material",
              "**Summarization**: Summarize long readings, then verify the summary against the original",
            ],
          },
          {
            type: "callout",
            variant: "tip",
            title: "The Learning Test",
            text: "After using AI for any study task, ask yourself: \"Can I explain this concept to someone else without looking at the AI's response?\" If not, you've relied on it too heavily.",
          },
        ],
      },
      {
        id: "professor-workflows",
        title: "Professor Workflows",
        blocks: [
          { type: "heading", level: 2, text: "Professor Workflows" },
          {
            type: "paragraph",
            text: "AI can dramatically reduce the administrative burden of teaching while helping you design more engaging and effective learning experiences.",
          },
          { type: "heading", level: 3, text: "Curriculum and Assessment" },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Lesson planning**: Generate structured lesson plans with learning objectives, activities, and assessments",
              "**Rubric creation**: Build detailed grading rubrics with specific criteria and performance levels",
              "**Assignment design**: Create AI-resilient assignments that test genuine understanding",
              "**Question banks**: Generate varied quiz and exam questions from your course material",
            ],
          },
          { type: "heading", level: 3, text: "Content and Communication" },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Lecture notes**: Draft lecture notes or presentation outlines from your key points",
              "**Case studies**: Generate realistic case studies relevant to your discipline",
              "**Email drafts**: Draft student communications, recommendation letters, and administrative emails",
              "**Syllabus review**: Ask AI to review your syllabus for clarity, completeness, and alignment with learning objectives",
            ],
          },
          {
            type: "callout",
            variant: "info",
            title: "Building an AI Literacy Module",
            text: "Consider incorporating an AI literacy module into your course. Use the frameworks from the 'How AI Works' module as a starting point, and adapt the content to your discipline.",
          },
        ],
      },
      {
        id: "developer-workflows",
        title: "Developer Workflows",
        blocks: [
          { type: "heading", level: 2, text: "Developer Workflows" },
          {
            type: "paragraph",
            text: "For developers, AI is rapidly becoming an essential part of the development workflow. Claude Code and the Claude API offer powerful tools for coding, reviewing, testing, and building.",
          },
          { type: "heading", level: 3, text: "Daily Development" },
          {
            type: "list",
            style: "unordered",
            items: [
              "**Code generation**: Describe what you need in natural language — Claude writes the implementation",
              "**Code review**: Paste code and get structured feedback on security, performance, and quality",
              "**Debugging**: Describe the bug and share error messages — Claude traces the issue and suggests fixes",
              "**Refactoring**: Ask Claude to modernize code, extract functions, or improve patterns",
              "**Testing**: Generate unit tests, integration tests, and edge case coverage",
            ],
          },
          { type: "heading", level: 3, text: "Advanced: Building with Claude" },
          {
            type: "list",
            style: "unordered",
            items: [
              "**System prompts**: Design system prompts for AI-powered features in your app",
              "**API integration**: Use the Claude API to add AI capabilities to your products",
              "**MCP servers**: Connect Claude to external tools, databases, and services",
              "**Agentic workflows**: Build multi-step automated workflows with Claude Code skills and sub-agents",
              "**Evaluation**: Build test harnesses to measure prompt quality across your use cases",
            ],
          },
          {
            type: "code",
            language: "bash",
            caption: "Getting started with Claude Code",
            code: `# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Navigate to your project
cd my-project

# Create a CLAUDE.md with your project conventions
claude "Create a CLAUDE.md for this project"

# Start coding with Claude
claude "Add user authentication with JWT"

# Use Claude Code in VS Code
# Install the Claude Code extension from the marketplace`,
          },
          {
            type: "callout",
            variant: "tip",
            title: "Pro Tip: CLAUDE.md Is Everything",
            text: "A well-written CLAUDE.md file is the single most impactful thing you can do to improve Claude Code's effectiveness in your project. Include your tech stack, conventions, rules, and common commands.",
          },
        ],
      },
    ],
  },
] as const
