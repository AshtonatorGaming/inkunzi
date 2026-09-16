import type { Army, Nation, Pop, ResourceNode } from "./types";

export function taxFromPops(popCount: number): number {
  return popCount * 1;
}

export function foodProduced(settledCount: number): number {
  return settledCount * 2;
}

export function foodEaten(popCount: number): number {
  return popCount * 1;
}

export function armyUpkeep(strength: number): number {
  return strength;
}

export function tickNation(
  nation: Nation,
  pops: Pop[],
  nodes: ResourceNode[],
  armies: Army[]
): Nation {
  if (nation.id === "unclaimed") return nation;

  const owned = pops.filter((p) => p.ownerId === nation.id);
  const settled = owned.filter((p) => p.settled).length;
  const host = armies.filter((a) => a.ownerId === nation.id);
  const resources = { ...nation.resources };

  resources.food =
    (resources.food ?? 0) + foodProduced(settled) - foodEaten(owned.length);

  for (const node of nodes) {
    if (node.ownerId !== nation.id) continue;
    resources[node.resourceId] = (resources[node.resourceId] ?? 0) + node.yield;
  }

  const upkeep = host.reduce((sum, a) => sum + armyUpkeep(a.strength), 0);
  const starving = (resources.food ?? 0) < 0;

  return {
    ...nation,
    treasury: nation.treasury + taxFromPops(owned.length) - upkeep,
    resources,
    stability: starving ? nation.stability - 5 : nation.stability,
  };
}

export function tickAll(
  nations: Nation[],
  pops: Pop[],
  nodes: ResourceNode[],
  armies: Army[]
): Nation[] {
  return nations.map((n) => tickNation(n, pops, nodes, armies));
}