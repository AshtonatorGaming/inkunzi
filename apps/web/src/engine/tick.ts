import type { Nation, Pop } from "./types";

export function taxFromPops(popCount: number): number {
  return popCount * 1;
}

export function tickNation(nation: Nation, pops: Pop[]): Nation {
  const owned = pops.filter((p) => p.ownerId === nation.id).length;
  return {
    ...nation,
    treasury: nation.treasury + taxFromPops(owned),
  };
}

export function tickAll(nations: Nation[], pops: Pop[]): Nation[] {
  return nations.map((n) => tickNation(n, pops));
}