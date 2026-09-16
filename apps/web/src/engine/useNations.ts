"use client";

import { useEffect, useState } from "react";
import type { Nation } from "./types";
import { loadNations, saveNations, updateNation } from "./nationStore";

export function useNations() {
  const [nations, setNations] = useState<Nation[]>([]);

  useEffect(() => {
    setNations(loadNations());
  }, []);

  useEffect(() => {
    if (nations.length === 0) return;
    saveNations(nations);
  }, [nations]);

  return {
    nations,
    update: (id: string, patch: Partial<Nation>) =>
      setNations((cur) => updateNation(cur, id, patch)),
    setNations,
  };
}