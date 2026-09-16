import type { Nation } from "./types";
import { STARTER_NATIONS } from "@/packs/core/starterNations";

const KEY = "inkunzi.nations.v1";

function mergeWithSeed(saved: Nation[]): Nation[] {
  const byId = new Map(saved.map((n) => [n.id, n]));
  for (const seed of STARTER_NATIONS) {
    if (!byId.has(seed.id)) byId.set(seed.id, seed);
  }
  return STARTER_NATIONS.map((seed) => byId.get(seed.id) ?? seed).concat(
    saved.filter((n) => !STARTER_NATIONS.some((s) => s.id === n.id))
  );
}

export function loadNations(): Nation[] {
  if (typeof window === "undefined") return STARTER_NATIONS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return STARTER_NATIONS;
    const parsed = JSON.parse(raw) as Nation[];
    if (!Array.isArray(parsed) || parsed.length === 0) return STARTER_NATIONS;
    return mergeWithSeed(parsed);
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