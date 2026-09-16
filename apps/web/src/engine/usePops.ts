"use client";

import { useEffect, useState } from "react";
import type { Pop } from "./types";
import { loadPops, savePops, makePop, updatePop, removePop } from "./popStore";

export function usePops() {
  const [pops, setPops] = useState<Pop[]>([]);

  useEffect(() => {
    setPops(loadPops());
  }, []);

  useEffect(() => {
    if (pops.length === 0) return;
    savePops(pops);
  }, [pops]);

  return {
    pops,
    place: (x: number, y: number) =>
      setPops((cur) => [...cur, makePop(x, y)]),
    update: (id: string, patch: Partial<Pop>) =>
      setPops((cur) => updatePop(cur, id, patch)),
    remove: (id: string) => setPops((cur) => removePop(cur, id)),
  };
}