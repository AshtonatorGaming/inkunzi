import type { Army } from "./types";

const KEY = "inkunzi.armies.v1";

export function loadArmies(): Army[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Army[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveArmies(armies: Army[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(armies));
}

export function makeArmy(x: number, y: number): Army {
  return {
    id: crypto.randomUUID(),
    x,
    y,
    ownerId: "unclaimed",
    strength: 10,
  };
}

export function updateArmy(
  armies: Army[],
  id: string,
  patch: Partial<Army>
): Army[] {
  return armies.map((a) => (a.id === id ? { ...a, ...patch } : a));
}

export function removeArmy(armies: Army[], id: string): Army[] {
  return armies.filter((a) => a.id !== id);
}