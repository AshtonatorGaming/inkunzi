import type { Army } from "./types";
import { distance } from "./movement";

export const CONTACT_PX = 48;

export type BattleResult = {
  attacker: Army;
  defender: Army;
  attackerLoss: number;
  defenderLoss: number;
  winnerId: string;
};

export function armiesInContact(a: Army, b: Army): boolean {
  if (a.id === b.id) return false;
  if (a.ownerId === b.ownerId) return false;
  if (a.ownerId === "unclaimed" || b.ownerId === "unclaimed") return false;
  return distance(a.x, a.y, b.x, b.y) <= CONTACT_PX;
}

export function resolveBattle(attacker: Army, defender: Army): BattleResult {
  const attackerWins = attacker.strength >= defender.strength;
  const attackerLoss = Math.max(
    1,
    Math.floor(defender.strength * (attackerWins ? 0.1 : 0.25))
  );
  const defenderLoss = Math.max(
    1,
    Math.floor(attacker.strength * (attackerWins ? 0.25 : 0.1))
  );
  return {
    attacker: {
      ...attacker,
      strength: Math.max(0, attacker.strength - attackerLoss),
    },
    defender: {
      ...defender,
      strength: Math.max(0, defender.strength - defenderLoss),
    },
    attackerLoss,
    defenderLoss,
    winnerId: attackerWins ? attacker.id : defender.id,
  };
}

export function applyMoveBattles(
  armies: Army[],
  movedId: string
): { armies: Army[]; log: string[] } {
  const moved = armies.find((a) => a.id === movedId);
  if (!moved) return { armies, log: [] };

  let next = armies;
  const log: string[] = [];
  const foes = next.filter((a) => armiesInContact(moved, a));

  for (const foe of foes) {
    const liveMoved = next.find((a) => a.id === movedId);
    const liveFoe = next.find((a) => a.id === foe.id);
    if (!liveMoved || !liveFoe || liveMoved.strength <= 0 || liveFoe.strength <= 0) {
      continue;
    }
    const result = resolveBattle(liveMoved, liveFoe);
    log.push(
      `Battle ${result.winnerId === liveMoved.id ? "won" : "lost"} (−${result.attackerLoss}/−${result.defenderLoss})`
    );
    next = next
      .map((a) => {
        if (a.id === result.attacker.id) return result.attacker;
        if (a.id === result.defender.id) return result.defender;
        return a;
      })
      .filter((a) => a.strength > 0);
  }

  return { armies: next, log };
}