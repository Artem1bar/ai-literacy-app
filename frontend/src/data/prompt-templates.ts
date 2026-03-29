import type { PromptTemplate } from "./types"

export const PROMPT_TEMPLATES: readonly PromptTemplate[] = [
  // ─── Student Templates ─────────────────────────────────────
  {
    id: "essay-brainstorm",
    title: "Essay Brainstorm",
    description: "Generate thesis angles and argument structures for a given topic.",
    category: "student",
    roles: ["student"],
    framework: "CO-STAR",
    template: `<context>
I am a {{level}} student studying {{subject}}. I need to write a {{length}} essay on the topic: "{{topic}}"
</context>

<objective>
Generate 3-5 distinct thesis angles I could take on this topic. For each, provide:
1. A clear thesis statement
2. Three supporting arguments
3. One potential counterargument to address
</objective>

<style>
Academic but accessible. Use clear, direct language.
</style>

<response_format>
Organize each thesis option as a numbered section with clear subheadings.
</response_format>`,
    placeholders: [
      { key: "level", label: "Academic Level", type: "select", options: ["undergraduate", "graduate", "high school"] },
      { key: "subject", label: "Subject Area", type: "text", defaultValue: "e.g., Political Science" },
      { key: "topic", label: "Essay Topic", type: "textarea" },
      { key: "length", label: "Essay Length", type: "select", options: ["1000-word", "2000-word", "5000-word", "10-page"] },
    ],
  },
  {
    id: "study-plan",
    title: "Study Plan Generator",
    description: "Create a structured study plan for an upcoming exam or learning goal.",
    category: "student",
    roles: ["student"],
    framework: "RISEN",
    template: `Role: You are an expert academic tutor and study coach.

Instructions: Create a detailed study plan for the following:
- Subject: {{subject}}
- Exam/Goal: {{goal}}
- Available time: {{time_available}}
- Current knowledge level: {{knowledge_level}}

Steps:
1. Break down the subject into key topics
2. Prioritize topics by difficulty and exam weight
3. Create a day-by-day schedule
4. Include active recall and spaced repetition sessions
5. Add practice test checkpoints

End Goal: A complete, actionable study plan that maximizes retention and covers all key topics.

Constraints: The plan must be realistic for a student with other classes. Include breaks and buffer time.`,
    placeholders: [
      { key: "subject", label: "Subject", type: "text" },
      { key: "goal", label: "Exam or Goal", type: "text", defaultValue: "e.g., Final exam on Dec 15" },
      { key: "time_available", label: "Time Available", type: "text", defaultValue: "e.g., 2 weeks, 3 hours per day" },
      { key: "knowledge_level", label: "Current Level", type: "select", options: ["beginner", "intermediate", "advanced", "mixed"] },
    ],
  },
  {
    id: "source-evaluator",
    title: "Source Evaluator",
    description: "Critically evaluate a source or claim using structured reasoning.",
    category: "student",
    roles: ["student", "professor"],
    framework: "Chain-of-Thought",
    template: `I need you to critically evaluate the following source/claim:

"{{source_text}}"

{{#if source_url}}Source URL: {{source_url}}{{/if}}

Think through this step by step:

1. **Identify the claim**: What specific claims are being made?
2. **Check the source**: Who is making this claim? What are their credentials and potential biases?
3. **Examine the evidence**: What evidence supports the claim? Is it empirical, anecdotal, or theoretical?
4. **Look for logical fallacies**: Are there any logical errors in the reasoning?
5. **Consider alternative explanations**: What other interpretations exist?
6. **Assess reliability**: On a scale of 1-10, how reliable is this source?

Provide your reasoning at each step, then a final assessment with your confidence level.`,
    placeholders: [
      { key: "source_text", label: "Source Text or Claim", type: "textarea" },
      { key: "source_url", label: "Source URL (optional)", type: "text" },
    ],
  },
  {
    id: "concept-explainer",
    title: "Concept Explainer",
    description: "Explain a complex concept at your chosen level of detail.",
    category: "student",
    roles: ["student"],
    framework: "Plain",
    template: `Explain the concept of "{{concept}}" in the field of {{field}}.

Target level: {{level}}

Please include:
- A clear definition in plain language
- An analogy or real-world example that makes it intuitive
- Why this concept matters (practical relevance)
- Common misconceptions to avoid
- How it connects to related concepts: {{related_concepts}}

Keep the explanation {{length}} and use {{style}} language.`,
    placeholders: [
      { key: "concept", label: "Concept", type: "text" },
      { key: "field", label: "Field of Study", type: "text" },
      { key: "level", label: "Explanation Level", type: "select", options: ["ELI5 (very simple)", "high school", "undergraduate", "graduate", "expert"] },
      { key: "related_concepts", label: "Related Concepts", type: "text", defaultValue: "e.g., regression, neural networks" },
      { key: "length", label: "Length", type: "select", options: ["concise (1-2 paragraphs)", "moderate (3-5 paragraphs)", "detailed (full explainer)"] },
      { key: "style", label: "Style", type: "select", options: ["conversational", "academic", "technical"] },
    ],
  },

  // ─── Professor Templates ───────────────────────────────────
  {
    id: "assignment-designer",
    title: "Assignment Designer",
    description: "Design an AI-resilient assignment that tests genuine understanding.",
    category: "professor",
    roles: ["professor"],
    framework: "CO-STAR",
    template: `<context>
I teach {{course}} at the {{level}} level. I need to design an assignment that is meaningful in the age of AI — it should test genuine understanding and be difficult to complete by simply prompting an AI tool.
Topic: {{topic}}
</context>

<objective>
Design a complete assignment that:
1. Tests higher-order thinking (analysis, synthesis, evaluation)
2. Incorporates personal reflection or lived experience
3. Requires engagement with specific course materials
4. Has clear rubric criteria
5. Optionally includes a component where students USE AI as a tool (not a shortcut)
</objective>

<style>
Professional academic tone suitable for a course syllabus.
</style>

<response_format>
Provide:
- Assignment title and description
- Learning objectives (3-5)
- Detailed instructions for students
- Grading rubric (table format)
- AI use policy for this assignment
- Estimated completion time
</response_format>`,
    placeholders: [
      { key: "course", label: "Course Name", type: "text", defaultValue: "e.g., Introduction to Sociology" },
      { key: "level", label: "Level", type: "select", options: ["introductory undergraduate", "upper-division undergraduate", "graduate", "professional"] },
      { key: "topic", label: "Assignment Topic", type: "textarea" },
    ],
  },
  {
    id: "rubric-builder",
    title: "Rubric Builder",
    description: "Create a detailed grading rubric for any assignment type.",
    category: "professor",
    roles: ["professor"],
    framework: "RISEN",
    template: `Role: You are an expert in educational assessment and rubric design, well-versed in Bloom's taxonomy.

Instructions: Create a detailed grading rubric for the following assignment:
- Assignment type: {{assignment_type}}
- Subject: {{subject}}
- Description: {{description}}

Steps:
1. Identify 4-6 key assessment criteria based on the learning objectives
2. Define 4 performance levels for each criterion (Excellent, Good, Developing, Inadequate)
3. Write specific, observable descriptors for each cell
4. Assign point weights reflecting importance

End Goal: A complete rubric in table format that provides clear expectations for students and consistent grading for instructors.

Constraints: Total points should sum to {{total_points}}. Use specific, measurable language — avoid vague terms like "good" or "adequate" without qualification.`,
    placeholders: [
      { key: "assignment_type", label: "Assignment Type", type: "select", options: ["essay", "research paper", "presentation", "lab report", "project", "discussion post"] },
      { key: "subject", label: "Subject", type: "text" },
      { key: "description", label: "Assignment Description", type: "textarea" },
      { key: "total_points", label: "Total Points", type: "text", defaultValue: "100" },
    ],
  },
  {
    id: "lesson-plan",
    title: "Lesson Plan Generator",
    description: "Build a complete lesson plan with learning objectives and activities.",
    category: "professor",
    roles: ["professor"],
    framework: "RISEN",
    template: `Role: You are an experienced instructional designer specializing in {{discipline}} education.

Instructions: Create a detailed lesson plan for:
- Topic: {{topic}}
- Duration: {{duration}}
- Class size: {{class_size}}
- Modality: {{modality}}

Steps:
1. Define 3-5 measurable learning objectives using Bloom's taxonomy verbs
2. Design an engaging opening activity (hook)
3. Plan the main instructional content with varied activities
4. Include at least one active learning exercise
5. Design a formative assessment to check understanding
6. Plan a closing summary and preview of next session

End Goal: A complete, ready-to-use lesson plan with timing for each section.

Constraints: Include at least one activity where students interact with each other. Consider diverse learning styles. Suggest one way AI tools could optionally enhance the lesson.`,
    placeholders: [
      { key: "discipline", label: "Discipline", type: "text" },
      { key: "topic", label: "Lesson Topic", type: "textarea" },
      { key: "duration", label: "Duration", type: "select", options: ["50 minutes", "75 minutes", "90 minutes", "3-hour seminar"] },
      { key: "class_size", label: "Class Size", type: "select", options: ["small (under 20)", "medium (20-50)", "large (50-100)", "lecture hall (100+)"] },
      { key: "modality", label: "Modality", type: "select", options: ["in-person", "online synchronous", "hybrid", "asynchronous"] },
    ],
  },

  // ─── Developer Templates ───────────────────────────────────
  {
    id: "system-prompt-scaffold",
    title: "System Prompt Scaffold",
    description: "Write a system prompt for an AI-powered application.",
    category: "developer",
    roles: ["developer"],
    framework: "CO-STAR",
    template: `<context>
I'm building {{app_description}}. The AI component needs to {{ai_role}}.
Tech stack: {{tech_stack}}
</context>

<objective>
Write a complete system prompt for this application that:
1. Clearly defines the AI's role and persona
2. Sets behavioral boundaries (what it should and shouldn't do)
3. Specifies the output format
4. Includes error handling instructions
5. Addresses edge cases
</objective>

<style>
Follow Anthropic's best practices for system prompts:
- Use XML tags for structure
- Be explicit about constraints
- Include examples of expected input/output
- Use positive instructions ("do X") over negative ("don't do Y")
</style>

<response_format>
Provide:
1. The complete system prompt (ready to copy-paste)
2. Brief rationale for key design decisions
3. 2-3 test cases to verify the prompt works correctly
</response_format>`,
    placeholders: [
      { key: "app_description", label: "App Description", type: "textarea", defaultValue: "e.g., a customer support chatbot for a SaaS product" },
      { key: "ai_role", label: "AI's Role", type: "text", defaultValue: "e.g., answer customer questions about billing and features" },
      { key: "tech_stack", label: "Tech Stack", type: "text", defaultValue: "e.g., Next.js, Claude API, PostgreSQL" },
    ],
  },
  {
    id: "code-review-assistant",
    title: "Code Review Assistant",
    description: "Get structured code review with reasoning about quality, security, and performance.",
    category: "developer",
    roles: ["developer"],
    framework: "Chain-of-Thought",
    template: `Review the following {{language}} code. Think through each aspect step by step.

\`\`\`{{language}}
{{code}}
\`\`\`

Context: {{context}}

Step-by-step review process:

1. **Correctness**: Does the code do what it's supposed to? Are there logic errors?
2. **Security**: Are there injection vulnerabilities, hardcoded secrets, unsafe patterns?
3. **Performance**: Are there N+1 queries, unnecessary allocations, or algorithmic issues?
4. **Readability**: Is the code clear? Are names descriptive? Is there appropriate abstraction?
5. **Error Handling**: Are errors handled properly? Are edge cases covered?
6. **Testing**: How testable is this code? What tests would you write?

For each issue found, provide:
- Severity: CRITICAL / HIGH / MEDIUM / LOW
- Location: line number or function name
- Problem description
- Suggested fix with code example`,
    placeholders: [
      { key: "language", label: "Language", type: "select", options: ["typescript", "python", "go", "rust", "java", "javascript"] },
      { key: "code", label: "Code to Review", type: "textarea" },
      { key: "context", label: "Context", type: "text", defaultValue: "e.g., This is a REST API endpoint handling user authentication" },
    ],
  },
  {
    id: "api-integration-helper",
    title: "API Integration Helper",
    description: "Generate Claude API integration code with best practices.",
    category: "developer",
    roles: ["developer"],
    framework: "Plain",
    template: `Write production-ready code to integrate the Claude API for the following use case:

Use case: {{use_case}}
Language: {{language}}
Framework: {{framework}}

Requirements:
- Use the official Anthropic SDK (@anthropic-ai/sdk for TypeScript, anthropic for Python)
- Model: claude-sonnet-4-6-20250514
- Include proper error handling (rate limits, timeouts, API errors)
- Never hardcode API keys — use environment variables
- Include TypeScript types / Python type hints
- Add retry logic with exponential backoff
- Include usage tracking (token counts)

{{additional_requirements}}

Provide:
1. Complete, runnable code
2. Required environment variables
3. Example usage
4. Common pitfalls to avoid`,
    placeholders: [
      { key: "use_case", label: "Use Case", type: "textarea", defaultValue: "e.g., Summarize uploaded documents and extract key entities" },
      { key: "language", label: "Language", type: "select", options: ["TypeScript", "Python"] },
      { key: "framework", label: "Framework", type: "text", defaultValue: "e.g., Next.js, FastAPI, Express" },
      { key: "additional_requirements", label: "Additional Requirements (optional)", type: "textarea" },
    ],
  },
  {
    id: "claude-md-generator",
    title: "CLAUDE.md Generator",
    description: "Generate a CLAUDE.md configuration file for your project.",
    category: "developer",
    roles: ["developer"],
    framework: "Plain",
    template: `Generate a CLAUDE.md file for the following project:

Project name: {{project_name}}
Description: {{description}}
Tech stack: {{tech_stack}}
Key conventions: {{conventions}}

The CLAUDE.md should follow Anthropic's best practices:
1. Project overview and purpose
2. Tech stack with specific versions
3. Folder structure conventions
4. Code style rules (formatting, naming, patterns)
5. Testing requirements and commands
6. Build and deployment commands
7. Critical rules (security, never-do items)
8. Common workflows

Keep it concise but comprehensive. Use markdown formatting. Focus on information that Claude Code needs to work effectively in this codebase.`,
    placeholders: [
      { key: "project_name", label: "Project Name", type: "text" },
      { key: "description", label: "Project Description", type: "textarea" },
      { key: "tech_stack", label: "Tech Stack", type: "textarea", defaultValue: "e.g., React 19, TypeScript, Tailwind CSS, FastAPI, PostgreSQL" },
      { key: "conventions", label: "Key Conventions", type: "textarea", defaultValue: "e.g., Feature-based folder structure, TDD, conventional commits" },
    ],
  },

  // ─── General Templates ─────────────────────────────────────
  {
    id: "decision-framework",
    title: "Decision Framework",
    description: "Systematically evaluate a complex decision with multiple options.",
    category: "general",
    roles: ["student", "professor", "developer"],
    framework: "Tree-of-Thought",
    template: `I need to make a decision about: {{decision}}

Context: {{context}}

Options I'm considering:
{{options}}

Please analyze this decision using a structured approach:

**For each option, explore three branches of thinking:**

Branch 1 — Optimistic scenario: What happens if everything goes well?
Branch 2 — Realistic scenario: What's the most likely outcome?
Branch 3 — Pessimistic scenario: What could go wrong?

**Then synthesize:**
1. Create a comparison matrix with criteria: {{criteria}}
2. Rate each option on each criterion (1-5)
3. Identify the top recommendation with reasoning
4. List 2-3 questions I should answer before deciding
5. Suggest a reversibility check — how easy is it to undo each option?`,
    placeholders: [
      { key: "decision", label: "Decision to Make", type: "textarea" },
      { key: "context", label: "Context and Constraints", type: "textarea" },
      { key: "options", label: "Options (one per line)", type: "textarea", defaultValue: "1. Option A\n2. Option B\n3. Option C" },
      { key: "criteria", label: "Evaluation Criteria", type: "text", defaultValue: "e.g., cost, time, risk, impact, reversibility" },
    ],
  },
  {
    id: "research-summary",
    title: "Research Summary",
    description: "Progressively compress a document into a dense, information-rich summary.",
    category: "general",
    roles: ["student", "professor"],
    framework: "Chain-of-Density",
    template: `Summarize the following text using the Chain-of-Density approach:

<document>
{{document}}
</document>

Produce 3 increasingly dense summaries:

**Summary 1 (Overview)**: ~{{length}} words. Capture the main topic and key argument. Use plain, accessible language.

**Summary 2 (Detailed)**: Same length (~{{length}} words). Now pack in more entities, data points, and specific claims. Remove filler words. Every sentence should be information-dense.

**Summary 3 (Maximum Density)**: Same length (~{{length}} words). This version should be as dense as an abstract — no word wasted. Include specific numbers, names, findings, and conclusions.

After the 3 summaries, provide:
- **Key takeaways** (3-5 bullet points)
- **Missing context** — what important context is NOT in the original text?
- **Questions raised** — what would a critical reader want to know next?`,
    placeholders: [
      { key: "document", label: "Text to Summarize", type: "textarea" },
      { key: "length", label: "Target Length per Summary", type: "select", options: ["50", "100", "150", "200"] },
    ],
  },
  {
    id: "prompt-debugger",
    title: "Prompt Debugger",
    description: "Diagnose why a prompt is underperforming and get an improved version.",
    category: "general",
    roles: ["student", "professor", "developer"],
    framework: "ReAct",
    template: `My prompt isn't working well. Help me debug it.

**Original prompt:**
{{original_prompt}}

**What I expected:**
{{expected_output}}

**What I actually got:**
{{actual_output}}

Use the Observe → Think → Act pattern:

**Observe**: Identify specific problems in the prompt:
- Is the task ambiguous?
- Is context missing?
- Is the format unclear?
- Are there conflicting instructions?

**Think**: For each problem, reason about why it causes the bad output.

**Act**: Provide a rewritten, improved prompt that fixes all identified issues.

After the improved prompt, explain:
1. What you changed and why
2. What makes the new version more effective
3. One tip for avoiding this type of issue in the future`,
    placeholders: [
      { key: "original_prompt", label: "Your Original Prompt", type: "textarea" },
      { key: "expected_output", label: "What You Expected", type: "textarea" },
      { key: "actual_output", label: "What You Got Instead", type: "textarea" },
    ],
  },
  {
    id: "persona-creator",
    title: "Persona Creator",
    description: "Design a reusable AI persona for a specific workflow.",
    category: "general",
    roles: ["professor", "developer"],
    framework: "RISEN",
    template: `Role: You are an expert in AI persona design and prompt architecture.

Instructions: Design a detailed, reusable AI persona for the following use case:
- Purpose: {{purpose}}
- Domain: {{domain}}
- Target users: {{target_users}}

Steps:
1. Define the persona's identity (name, role, expertise, personality traits)
2. Write the system prompt that establishes this persona
3. Define 5-10 behavioral rules (what the persona always/never does)
4. Specify the persona's knowledge boundaries
5. Include 3 example interactions showing the persona in action

End Goal: A complete persona specification that can be copy-pasted as a system prompt and reused across conversations.

Constraints: The persona must be helpful but honest about its limitations. It should never claim to be human or pretend to have experiences it doesn't have.`,
    placeholders: [
      { key: "purpose", label: "Persona Purpose", type: "textarea", defaultValue: "e.g., Act as a writing tutor for ESL students" },
      { key: "domain", label: "Domain", type: "text", defaultValue: "e.g., Academic writing, creative writing" },
      { key: "target_users", label: "Target Users", type: "text", defaultValue: "e.g., International graduate students" },
    ],
  },
] as const
