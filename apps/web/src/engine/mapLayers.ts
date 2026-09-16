export type MapLayer =
  | "all"
  | "political"
  | "culture"
  | "religion"
  | "resources"
  | "military";

export const MAP_LAYERS: { id: MapLayer; label: string }[] = [
  { id: "all", label: "All" },
  { id: "political", label: "Political" },
  { id: "culture", label: "Culture" },
  { id: "religion", label: "Religion" },
  { id: "resources", label: "Resources" },
  { id: "military", label: "Military" },
];

const UNSET = new Set(["", "unknown", "unclaimed", "none", "unset"]);

const PALETTE = [
  "#66bb44",
  "#4488aa",
  "#c88444",
  "#aa4488",
  "#44aaaa",
  "#888844",
  "#8866cc",
  "#cc6666",
];

export function colorFromKey(key: string): string {
  const normalized = key.trim().toLowerCase();
  if (UNSET.has(normalized)) return "#cccccc";
  let h = 0;
  for (let i = 0; i < normalized.length; i++) {
    h = (h * 31 + normalized.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(h) % PALETTE.length];
}