import type { NationSummary } from "@/engine/nationSummary";

export default function NationPanel({ nations }: { nations: NationSummary[] }) {
  return (
    <aside className="h-full w-72 shrink-0 overflow-y-auto border-l border-zinc-700 bg-zinc-900 p-3 text-zinc-100">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Nations
      </h2>
      <ul className="space-y-2">
        {nations.map((n) => (
          <li key={n.name} className="rounded bg-zinc-800 px-2 py-1">
            <div className="font-medium">{n.name}</div>
            <div className="text-xs text-zinc-400">
              {n.pops} pops · {n.settled} settled · {n.nomad} nomad
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}