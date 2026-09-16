import type { Nation } from "./types";
import { STARTER_NATIONS } from "@/packs/core/starterNations";

const KEY = "inkunzi.nations.v1";

export function loadNations(): Nation[] {
  if (typeof window === "undefined") return STARTER_NATIONS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return STARTER_NATIONS;
    const parsed = JSON.parse(raw) as Nation[];
    if (!Array.isArray(parsed) || parsed.length === 0) return STARTER_NATIONS;
    return parsed;
  } catch {
    return STARTER_NATIONS;
  }
}

export function saveNations(nations: Nation[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(nations));
}

export function updateNation(
  nations: Nation[],
  id: string,
  patch: Partial<Nation>
): Nation[] {
  return nations.map((n) => (n.id === id ? { ...n, ...patch } : n));
}