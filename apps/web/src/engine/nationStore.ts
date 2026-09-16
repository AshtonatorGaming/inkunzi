import type { Nation } from "./types";
import { STARTER_NATIONS } from "@/packs/core/starterNations";
import { emptyLedger } from "@/packs/core/resources";

const KEY = "inkunzi.nations.v2";
const LEGACY_KEY = "inkunzi.nations.v1";

type LegacyNation = Nation & { grain?: number };

function normalize(n: LegacyNation): Nation {
  const resources = { ...emptyLedger(), ...(n.resources ?? {}) };
  if (n.grain != null && resources.food === 0) resources.food = n.grain;
  return {
    id: n.id,
    name: n.name,
    color: n.color,
    treasury: n.treasury ?? 0,
    stability: n.stability ?? 50,
    resources,
  };
}

function mergeWithSeed(saved: Nation[]): Nation[] {
  const byId = new Map(saved.map((n) => [n.id, n]));
  for (const seed of STARTER_NATIONS) {
    if (!byId.has(seed.id)) byId.set(seed.id, seed);
  }
  return STARTER_NATIONS.map((seed) => byId.get(seed.id) ?? seed).concat(
    saved.filter((n) => !STARTER_NATIONS.some((s) => s.id === n.id))
  );
}

function read(): Nation[] | null {
  if (typeof window === "undefined") return null;
  for (const key of [KEY, LEGACY_KEY]) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;
    const parsed = JSON.parse(raw) as LegacyNation[];
    if (Array.isArray(parsed) && parsed.length) return parsed.map(normalize);
  }
  return null;
}

export function loadNations(): Nation[] {
  try {
    const saved = read();
    if (!saved) return STARTER_NATIONS;
    return mergeWithSeed(saved);
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