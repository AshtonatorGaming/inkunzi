import type { Session } from "./types";

const KEY = "inkunzi.session.v1";

export const DEFAULT_SESSION: Session = {
  name: "Inkunzi",
  mechanicalTurn: 1,
  calendarDay: 1,
  daysPerTurn: 14,
  mapWidth: 6145,
  mapHeight: 3530,
  pixelsPerDayMarch: 80,
};

export function loadSession(): Session {
  if (typeof window === "undefined") return DEFAULT_SESSION;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SESSION;
    return { ...DEFAULT_SESSION, ...(JSON.parse(raw) as Session) };
  } catch {
    return DEFAULT_SESSION;
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(session));
}

export function advanceDay(session: Session): Session {
  return { ...session, calendarDay: session.calendarDay + 1 };
}

export function advanceTurn(session: Session): Session {
  return {
    ...session,
    mechanicalTurn: session.mechanicalTurn + 1,
    calendarDay: session.calendarDay + session.daysPerTurn,
  };
}

export function marchRangePx(session: Session, days: number): number {
  return session.pixelsPerDayMarch * days;
}