import type { Pop } from "./types";
import { STARTER_POPS } from "@/packs/core/starterPops";

const KEY = "inkunzi.pops.v1";

export function loadPops(): Pop[] {
  if (typeof window === "undefined") return STARTER_POPS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return STARTER_POPS;
    const parsed = JSON.parse(raw) as Pop[];
    if (!Array.isArray(parsed)) return STARTER_POPS;
    return parsed;
  } catch {
    return STARTER_POPS;
  }
}

export function savePops(pops: Pop[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(pops));
}

export function makePop(x: number, y: number): Pop {
  return {
    id: crypto.randomUUID(),
    x,
    y,
    owner: "Unclaimed",
    culture: "Unknown",
    religion: "Unknown",
    settled: true,
  };
}

export function updatePop(pops: Pop[], id: string, patch: Partial<Pop>): Pop[] {
  return pops.map((pop) => (pop.id === id ? { ...pop, ...patch } : pop));
}

export function removePop(pops: Pop[], id: string): Pop[] {
  return pops.filter((pop) => pop.id !== id);
}