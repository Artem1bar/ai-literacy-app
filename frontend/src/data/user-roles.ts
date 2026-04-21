import type { RoleConfig } from "./types"

export const USER_ROLES: readonly RoleConfig[] = [
  {
    id: "student",
    label: "Student",
    description:
      "Undergraduate or graduate learner using AI for coursework, research, and writing. Learn to use AI tools effectively while maintaining academic integrity.",
    icon: "GraduationCap",
    color: "blue",
  },
  {
    id: "professor",
    label: "Professor / Educator",
    description:
      "Faculty integrating AI into curriculum design, assessment, and classroom instruction. Design AI-resilient assignments and teach AI literacy.",
    icon: "BookOpen",
    color: "purple",
  },
  {
    id: "developer",
    label: "Developer",
    description:
      "Software engineers building with the Claude API, Claude Code, or MCP ecosystem. Master prompt engineering, system prompts, and agentic workflows.",
    icon: "Code",
    color: "green",
  },
  {
    id: "worker",
    label: "Louisiana Worker",
    description:
      "Working in a Louisiana industry — energy, manufacturing, healthcare, logistics, or skilled trades. Learn how AI will change your occupation and what skills hold the most value.",
    icon: "HardHat",
    color: "amber",
  },
] as const
