"use client";

import { useEffect, useState } from "react";
import type { Army, Nation } from "@/engine/types";

export default function ArmyEditor({
  army,
  nations,
  onChange,
  onDelete,
}: {
  army: Army;
  nations: Nation[];
  onChange: (patch: Partial<Army>) => void;
  onDelete: () => void;
}) {
  const [strengthText, setStrengthText] = useState(String(army.strength));

  useEffect(() => {
    setStrengthText(String(army.strength));
  }, [army.id, army.strength]);

  function commitStrength() {
    const value = Number(strengthText);
    if (!Number.isFinite(value)) {
      setStrengthText(String(army.strength));
      return;
    }
    onChange({ strength: Math.max(0, value) });
  }

  return (
    <div className="flex min-w-48 flex-col gap-1 text-sm">
      <label>
        Owner
        <select
          className="mt-0.5 w-full border px-1"
          value={army.ownerId}
          onChange={(e) => onChange({ ownerId: e.target.value })}
        >
          {nations.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Strength
        <input
          type="text"
          inputMode="numeric"
          className="mt-0.5 w-full border px-1"
          value={strengthText}
          onChange={(e) => setStrengthText(e.target.value)}
          onBlur={commitStrength}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitStrength();
          }}
        />
      </label>
      <button type="button" className="mt-1 text-left text-red-700" onClick={onDelete}>
        Delete army
      </button>
    </div>
  );
}