export const APP_NAME = "AI Literacy"

export const ROUTES = {
  HOME: "/",
  LEARN: "/learn",
  MODULE: "/learn/:slug",
  LAB: "/lab",
  RESOURCES: "/resources",
  PROFILE: "/profile",
} as const

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"
