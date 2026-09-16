import type { Army, Nation, Pop, ResourceNode, Session, WorldSnapshot } from "./types";

export function buildSnapshot(
  session: Session,
  nations: Nation[],
  pops: Pop[],
  nodes: ResourceNode[],
  armies: Army[]
): WorldSnapshot {
  return { version: 1, session, nations, pops, nodes, armies };
}

export function parseSnapshot(raw: string): WorldSnapshot {
  const data = JSON.parse(raw) as WorldSnapshot;
  if (!data || data.version !== 1 || !data.session) {
    throw new Error("Not an Inkunzi world file");
  }
  return data;
}

export function downloadSnapshot(snap: WorldSnapshot): void {
  const blob = new Blob([JSON.stringify(snap, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${snap.session.name.replace(/\s+/g, "-").toLowerCase()}-t${snap.session.mechanicalTurn}.json`;
  a.click();
  URL.revokeObjectURL(url);
}