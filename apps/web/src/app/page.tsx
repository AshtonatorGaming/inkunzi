"use client";

import WorldMapLoader from "@/components/WorldMapLoader";
import NationPanel from "@/components/NationPanel";
import { usePops } from "@/engine/usePops";
import { summarizeNations } from "@/engine/nationSummary";

export default function Home() {
  const { pops, place, update, remove } = usePops();
  const nations = summarizeNations(pops);

  return (
    <main className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100">
        <h1 className="text-lg font-semibold">Inkunzi</h1>
        <span className="text-sm text-zinc-400">slice 2 — nations from pops</span>
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <WorldMapLoader
            pops={pops}
            onPlace={(y, x) => place(x, y)}
            onUpdate={update}
            onRemove={remove}
          />
        </div>
        <NationPanel nations={nations} />
      </div>
    </main>
  );
}