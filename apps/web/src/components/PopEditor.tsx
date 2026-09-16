"use client";

import type { Pop } from "@/engine/types";

export default function PopEditor({
  pop,
  onChange,
  onDelete,
}: {
  pop: Pop;
  onChange: (patch: Partial<Pop>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex min-w-48 flex-col gap-1 text-sm">
      <label>
        Owner
        <input
          className="mt-0.5 w-full border px-1"
          value={pop.owner}
          onChange={(e) => onChange({ owner: e.target.value })}
        />
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