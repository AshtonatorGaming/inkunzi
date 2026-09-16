"use client";

import type { Nation, Pop } from "@/engine/types";

export default function PopEditor({
  pop,
  nations,
  onChange,
  onDelete,
}: {
  pop: Pop;
  nations: Nation[];
  onChange: (patch: Partial<Pop>) => void;
  onDelete: () => void;
}) {
  const known = nations.some((n) => n.id === pop.ownerId);

  return (
    <div className="flex min-w-48 flex-col gap-1 text-sm">
      <label>
        Owner
        <select
          className="mt-0.5 w-full border px-1"
          value={pop.ownerId}
          onChange={(e) => onChange({ ownerId: e.target.value })}
        >
          {!known && (
            <option value={pop.ownerId}>{pop.ownerId} (missing)</option>
          )}
          {nations.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Culture
        <input
          className="mt-0.5 w-full border px-1"
          value={pop.culture}
          onChange={(e) => onChange({ culture: e.target.value })}
        />
      </label>
      <label>
        Religion
        <input
          className="mt-0.5 w-full border px-1"
          value={pop.religion}
          onChange={(e) => onChange({ religion: e.target.value })}
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={pop.settled}
          onChange={(e) => onChange({ settled: e.target.checked })}
        />
        Settled
      </label>
      <small>
        {pop.x.toFixed(0)}, {pop.y.toFixed(0)}
      </small>
      <button type="button" className="mt-1 text-left text-red-700" onClick={onDelete}>
        Delete pop
      </button>
    </div>
  );
}