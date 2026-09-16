import type { Pop } from "./types";

export type NationSummary = {
  name: string;
  pops: number;
  settled: number;
  nomad: number;
};

export function summarizeNations(pops: Pop[]): NationSummary[] {
  const byName = new Map<string, NationSummary>();
  for (const pop of pops) {
    const name = pop.owner || "Unclaimed";
    const row = byName.get(name) ?? {
      name,
      pops: 0,
      settled: 0,
      nomad: 0,
    };
    row.pops += 1;
    if (pop.settled) row.settled += 1;
    else row.nomad += 1;
    byName.set(name, row);
  }
  return [...byName.values()].sort((a, b) => b.pops - a.pops);
}