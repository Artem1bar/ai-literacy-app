import type { RoleConfig } from "./types"

export const USER_ROLES: readonly RoleConfig[] = [
  {
    id: "student",
    label: "Student",
    description:
      "Essays, exams, research. Use AI to sharpen your thinking — and know where the integrity lines sit before you cross them.",
    icon: "GraduationCap",
    color: "blue",
  },
  {
    id: "professor",
    label: "Professor / Educator",
    description:
      "Design assignments that still mean something. Plan assessments that are hard to fake. Teach AI literacy without winging it.",
    icon: "BookOpen",
    color: "purple",
  },
  {
    id: "developer",
    label: "Developer",
    description:
      "System prompts that hold up. The API without wasted tokens. Agents and tool use without the footguns.",
    icon: "Code",
    color: "green",
  },
] as const
