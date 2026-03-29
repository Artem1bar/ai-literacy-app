import type { PromptFramework } from "./types"

export const PROMPT_FRAMEWORKS: readonly PromptFramework[] = [
  {
    id: "co-star",
    name: "CO-STAR",
    description:
      "Context, Objective, Style, Tone, Audience, Response — a comprehensive framework for structured prompts that covers all essential dimensions.",
    steps: [
      {
        key: "context",
        label: "Context",
        description: "Background information and relevant details",
        placeholder: "e.g., I'm a computer science student working on a final project about machine learning...",
      },
      {
        key: "objective",
        label: "Objective",
        description: "What you want the AI to accomplish",
        placeholder: "e.g., Explain the difference between supervised and unsupervised learning...",
      },
      {
        key: "style",
        label: "Style",
        description: "Writing style or format to use",
        placeholder: "e.g., Academic but accessible, with real-world examples...",
      },
      {
        key: "tone",
        label: "Tone",
        description: "Emotional quality of the response",
        placeholder: "e.g., Encouraging and educational...",
      },
      {
        key: "audience",
        label: "Audience",
        description: "Who the response is intended for",
        placeholder: "e.g., Undergraduate students with basic programming knowledge...",
      },
      {
        key: "response",
        label: "Response Format",
        description: "How the output should be structured",
        placeholder: "e.g., A comparison table followed by 2-3 paragraph explanation with code examples...",
      },
    ],
    assembler: (values) => {
      const parts: string[] = []
      if (values.context) parts.push(`<context>\n${values.context}\n</context>`)
      if (values.objective) parts.push(`<objective>\n${values.objective}\n</objective>`)
      if (values.style) parts.push(`<style>\n${values.style}\n</style>`)
      if (values.tone) parts.push(`<tone>\n${values.tone}\n</tone>`)
      if (values.audience) parts.push(`<audience>\n${values.audience}\n</audience>`)
      if (values.response) parts.push(`<response_format>\n${values.response}\n</response_format>`)
      return parts.join("\n\n")
    },
  },
  {
    id: "risen",
    name: "RISEN",
    description:
      "Role, Instructions, Steps, End goal, Narrowing — a goal-oriented framework ideal for task-focused prompts with clear deliverables.",
    steps: [
      {
        key: "role",
        label: "Role",
        description: "Who should the AI act as?",
        placeholder: "e.g., You are an experienced curriculum designer specializing in STEM education...",
      },
      {
        key: "instructions",
        label: "Instructions",
        description: "What task should be performed?",
        placeholder: "e.g., Create a week-long lesson plan on introduction to AI...",
      },
      {
        key: "steps",
        label: "Steps",
        description: "What specific steps should be followed?",
        placeholder: "e.g., 1. Define learning objectives 2. Outline daily topics 3. Design activities...",
      },
      {
        key: "end_goal",
        label: "End Goal",
        description: "What is the desired outcome?",
        placeholder: "e.g., A complete, ready-to-use lesson plan with assessment rubrics...",
      },
      {
        key: "narrowing",
        label: "Narrowing",
        description: "Constraints, boundaries, or limitations",
        placeholder: "e.g., Target audience: high school students. No prior coding experience required. Max 5 days...",
      },
    ],
    assembler: (values) => {
      const parts: string[] = []
      if (values.role) parts.push(`Role: ${values.role}`)
      if (values.instructions) parts.push(`Instructions: ${values.instructions}`)
      if (values.steps) parts.push(`Steps:\n${values.steps}`)
      if (values.end_goal) parts.push(`End Goal: ${values.end_goal}`)
      if (values.narrowing) parts.push(`Constraints: ${values.narrowing}`)
      return parts.join("\n\n")
    },
  },
  {
    id: "chain-of-thought",
    name: "Chain-of-Thought",
    description:
      "Guide the AI to think step-by-step through a problem, showing its reasoning process. Produces more accurate and transparent results for complex tasks.",
    steps: [
      {
        key: "problem",
        label: "Problem Statement",
        description: "Clearly define the problem or question",
        placeholder: "e.g., Evaluate whether this research paper's methodology is sound...",
      },
      {
        key: "approach",
        label: "Thinking Approach",
        description: "How should the AI reason through this?",
        placeholder: "e.g., Think through this step by step. First analyze the hypothesis, then examine the data collection method...",
      },
      {
        key: "criteria",
        label: "Evaluation Criteria",
        description: "What should be considered in the analysis?",
        placeholder: "e.g., Consider: sample size, control groups, statistical methods, potential biases, reproducibility...",
      },
      {
        key: "output",
        label: "Output Requirements",
        description: "What should the final output include?",
        placeholder: "e.g., Provide your reasoning at each step, then a final assessment with confidence level...",
      },
    ],
    assembler: (values) => {
      const parts: string[] = []
      if (values.problem) parts.push(values.problem)
      if (values.approach) parts.push(values.approach)
      if (values.criteria) parts.push(`Consider the following criteria:\n${values.criteria}`)
      if (values.output) parts.push(values.output)
      return parts.join("\n\n")
    },
  },
] as const
