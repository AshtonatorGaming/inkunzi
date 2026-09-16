"use client";

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
          type="number"
          className="mt-0.5 w-full border px-1"
          value={army.strength}
          onChange={(e) => onChange({ strength: Number(e.target.value) })}
        />
      </label>
      <button type="button" className="mt-1 text-left text-red-700" onClick={onDelete}>
        Delete army
      </button>
    </div>
  );
}