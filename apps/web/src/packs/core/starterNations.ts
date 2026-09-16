import type { Nation } from "@/engine/types";
import { emptyLedger } from "./resources";

export const STARTER_NATIONS: Nation[] = [
  {
    id: "unclaimed",
    name: "Unclaimed",
    color: "#cccccc",
    treasury: 0,
    stability: 50,
    resources: emptyLedger(),
  },
  {
    id: "vestoria",
    name: "Vestoria",
    color: "#66bb44",
    treasury: 100,
    stability: 50,
    resources: { ...emptyLedger(), food: 20, lumber: 4, stone: 4, metal: 2 },
  },
  {
    id: "tunnu",
    name: "Tunnu",
    color: "#4488aa",
    treasury: 80,
    stability: 50,
    resources: { ...emptyLedger(), food: 20, lumber: 4, stone: 4, metal: 2 },
  },
  {
    id: "rekolia",
    name: "Rekolia",
    color: "#c88444",
    treasury: 40,
    stability: 45,
    resources: { ...emptyLedger(), food: 10, lumber: 2, stone: 2, metal: 1 },
  },
];