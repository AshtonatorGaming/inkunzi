import type { Nation, Pop } from "./types";

export function taxFromPops(popCount: number): number {
  return popCount * 1;
}

export function foodProduced(settledCount: number): number {
  return settledCount * 2;
}

export function foodEaten(popCount: number): number {
  return popCount * 1;
}

export function tickNation(nation: Nation, pops: Pop[]): Nation {
  if (nation.id === "unclaimed") return nation;

  const owned = pops.filter((p) => p.ownerId === nation.id);
  const settled = owned.filter((p) => p.settled).length;
  const food =
    (nation.resources.food ?? 0) +
    foodProduced(settled) -
    foodEaten(owned.length);
  const starving = food < 0;

  return {
    ...nation,
    treasury: nation.treasury + taxFromPops(owned.length),
    resources: { ...nation.resources, food },
    stability: starving ? nation.stability - 5 : nation.stability,
  };
}

export function tickAll(nations: Nation[], pops: Pop[]): Nation[] {
  return nations.map((n) => tickNation(n, pops));
}