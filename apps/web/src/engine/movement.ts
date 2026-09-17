import type { Army, Session } from "./types";

export const ZOC_PX = 64;

export function turnMarchRange(session: Session): number {
  return session.pixelsPerDayMarch * session.daysPerTurn;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

function firstCircleHit(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  radius: number
): { x: number; y: number; t: number } | null {
  const dx = bx - ax;
  const dy = by - ay;
  const fx = ax - cx;
  const fy = ay - cy;
  const a = dx * dx + dy * dy;
  if (a === 0) return null;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radius * radius;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const root = Math.sqrt(disc);
  const t1 = (-b - root) / (2 * a);
  const t2 = (-b + root) / (2 * a);
  const t = [t1, t2]
    .filter((n) => n >= 0 && n <= 1)
    .sort((l, r) => l - r)[0];
  if (t == null) return null;
  return { x: ax + dx * t, y: ay + dy * t, t };
}

export function stopForZoc(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  blockers: Army[],
  radius = ZOC_PX
): { x: number; y: number; blockerId: string | null } {
  let best: { x: number; y: number; blockerId: string | null; t: number } = {
    x: toX,
    y: toY,
    blockerId: null,
    t: 2,
  };

  for (const b of blockers) {
    if (distance(fromX, fromY, b.x, b.y) <= radius) {
      return { x: fromX, y: fromY, blockerId: b.id };
    }
    const hit = firstCircleHit(fromX, fromY, toX, toY, b.x, b.y, radius);
    if (!hit || hit.t >= best.t) continue;
    best = { x: hit.x, y: hit.y, blockerId: b.id, t: hit.t };
  }

  return { x: best.x, y: best.y, blockerId: best.blockerId };
}