import type { Nation, Pop } from "@/engine/types";
import { countPopsByOwner } from "@/engine/nationSummary";
import { RESOURCES } from "@/packs/core/resources";

export default function NationWindow({
  nation,
  pops,
}: {
  nation: Nation;
  pops: Pop[];
}) {
  const c = countPopsByOwner(pops).get(nation.id);
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ background: nation.color }}
        />
        <strong>{nation.name}</strong>
      </div>
      <div>Pops {c?.pops ?? 0}</div>
      <div>Treasury {nation.treasury}</div>
      <div>Stability {nation.stability}</div>
      <ul className="text-zinc-400">
        {RESOURCES.map((r) => (
          <li key={r.id}>
            {r.label}: {nation.resources[r.id] ?? 0}
          </li>
        ))}
      </ul>
    </div>
  );
}