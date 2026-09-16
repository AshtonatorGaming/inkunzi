"use client";

import type { Nation, ResourceNode } from "@/engine/types";
import { RESOURCES } from "@/packs/core/resources";

export default function NodeEditor({
  node,
  nations,
  onChange,
  onDelete,
}: {
  node: ResourceNode;
  nations: Nation[];
  onChange: (patch: Partial<ResourceNode>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex min-w-48 flex-col gap-1 text-sm">
      <label>
        Resource
        <select
          className="mt-0.5 w-full border px-1"
          value={node.resourceId}
          onChange={(e) => onChange({ resourceId: e.target.value })}
        >
          {RESOURCES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Owner
        <select
          className="mt-0.5 w-full border px-1"
          value={node.ownerId}
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
        Yield
        <input
          type="number"
          className="mt-0.5 w-full border px-1"
          value={node.yield}
          onChange={(e) => onChange({ yield: Number(e.target.value) })}
        />
      </label>
      <button type="button" className="mt-1 text-left text-red-700" onClick={onDelete}>
        Delete node
      </button>
    </div>
  );
}