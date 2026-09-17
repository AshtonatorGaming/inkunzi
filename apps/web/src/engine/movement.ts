import type { Army, Session } from "./types";

export function turnMarchRange(session: Session): number {
  return session.pixelsPerDayMarch * session.daysPerTurn;
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}

export function canMarch(
  army: Army,
  x: number,
  y: number,
  session: Session
): boolean {
  return distance(army.x, army.y, x, y) <= turnMarchRange(session);
}