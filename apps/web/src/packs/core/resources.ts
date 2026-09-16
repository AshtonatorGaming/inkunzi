import type { ResourceDef } from "@/engine/types";

export const RESOURCES: ResourceDef[] = [
  { id: "food", label: "Grain", kind: "food" },
  { id: "lumber", label: "Lumber", kind: "material" },
  { id: "stone", label: "Stone", kind: "material" },
  { id: "metal", label: "Metal", kind: "military" },
];

export function emptyLedger(): Record<string, number> {
  return Object.fromEntries(RESOURCES.map((r) => [r.id, 0]));
}