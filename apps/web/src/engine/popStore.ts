import type { Pop } from "./types";
import { STARTER_POPS } from "@/packs/core/starterPops";

const KEY = "inkunzi.pops.v2";
const LEGACY_KEY = "inkunzi.pops.v1";

const NAME_TO_ID: Record<string, string> = {
  Vestoria: "vestoria",
  Tunnu: "tunnu",
  Rekolia: "rekolia",
  Unclaimed: "unclaimed",
  Horde: "unclaimed",
};

type LegacyPop = Pop & { owner?: string };

function resolveOwnerId(p: LegacyPop): string {
  const fromName = p.owner ? NAME_TO_ID[p.owner] : undefined;
  if (fromName && fromName !== "unclaimed") return fromName;
  if (p.ownerId && p.ownerId !== "unclaimed") return p.ownerId;
  return fromName || p.ownerId || "unclaimed";
}

function migrate(raw: unknown[]): Pop[] {
  return raw.map((row) => {
    const p = row as LegacyPop;
    return {
      id: p.id,
      x: p.x,
      y: p.y,
      ownerId: resolveOwnerId(p),
      culture: p.culture,
      religion: p.religion,
      settled: p.settled,
    };
  });
}

export function loadPops(): Pop[] {
  if (typeof window === "undefined") return STARTER_POPS;
  try {
    const current = window.localStorage.getItem(KEY);
    if (current) {
      const parsed = JSON.parse(current) as unknown[];
      if (Array.isArray(parsed) && parsed.length) return migrate(parsed);
    }
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as unknown[];
      if (Array.isArray(parsed) && parsed.length) return migrate(parsed);
    }
    return STARTER_POPS;
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
    ownerId: "unclaimed",
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