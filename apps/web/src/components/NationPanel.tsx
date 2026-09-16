import type { Nation, Pop } from "@/engine/types";
import { countPopsByOwner } from "@/engine/nationSummary";
import { RESOURCES } from "@/packs/core/resources";

export default function NationPanel({
  nations,
  pops,
  onTick,
}: {
  nations: Nation[];
  pops: Pop[];
  onTick: () => void;
}) {
  const counts = countPopsByOwner(pops);
  const foodLabel = RESOURCES.find((r) => r.id === "food")?.label ?? "food";

  return (
    <aside className="h-full w-72 shrink-0 overflow-y-auto border-l border-zinc-700 bg-zinc-900 p-3 text-zinc-100">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Nations
        </h2>
        <button
          type="button"
          onClick={onTick}
          className="rounded bg-zinc-700 px-2 py-1 text-xs"
        >
          Run tick
        </button>
      </div>
      <ul className="space-y-2">
        {nations.map((n) => {
          const c = counts.get(n.id);
          return (
            <li key={n.id} className="rounded bg-zinc-800 px-2 py-1">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ background: n.color }}
                />
                <span className="font-medium">{n.name}</span>
              </div>
              <div className="text-xs text-zinc-400">
                {c?.pops ?? 0} pops · treasury {n.treasury} · {foodLabel}{" "}
                {n.resources.food ?? 0} · stab {n.stability}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}