import type { Army, Session } from "./types";

export const ZOC_PX = 64;

export function turnMarchRange(session: Session): number {
  return session.pixelsPerDayMarch * session.daysPerTurn;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

function projectOnSegment(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  px: number,
  py: number
): { x: number; y: number; t: number } {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return { x: ax, y: ay, t: 0 };
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
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
  let best = { x: toX, y: toY, blockerId: null as string | null, t: 2 };

  for (const b of blockers) {
    const p = projectOnSegment(fromX, fromY, toX, toY, b.x, b.y);
    if (distance(p.x, p.y, b.x, b.y) > radius) continue;
    if (p.t >= best.t) continue;
    const dx = fromX - b.x;
    const dy = fromY - b.y;
    const d = Math.hypot(dx, dy) || 1;
    best = {
      x: b.x + (dx / d) * radius,
      y: b.y + (dy / d) * radius,
      blockerId: b.id,
      t: p.t,
    };
  }

  return { x: best.x, y: best.y, blockerId: best.blockerId };
}