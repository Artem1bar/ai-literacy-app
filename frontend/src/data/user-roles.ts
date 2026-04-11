import type { RoleConfig } from "./types"

export const USER_ROLES: readonly RoleConfig[] = [
  {
    id: "student",
    label: "Student",
    description:
      "You're writing essays, studying for exams, or working through research. You want AI to make you sharper, not to do your thinking for you — and you'd rather know where the integrity lines are than find out later.",
    icon: "GraduationCap",
    color: "blue",
  },
  {
    id: "professor",
    label: "Professor / Educator",
    description:
      "You teach. You're designing assignments that still mean something in a world where every student has access to a competent writer, planning assessments that are hard to fake, and trying to decide what AI literacy looks like in your own classroom.",
    icon: "BookOpen",
    color: "purple",
  },
  {
    id: "developer",
    label: "Developer",
    description:
      "You build things. You want the practical stuff: writing system prompts that hold up under pressure, using the Claude API and Claude Code without wasting tokens, and understanding what happens when you give a model tools and let it run.",
    icon: "Code",
    color: "green",
  },
] as const
