"use client";

import WorldMapLoader from "@/components/WorldMapLoader";
import NationPanel from "@/components/NationPanel";
import { usePops } from "@/engine/usePops";
import { useNations } from "@/engine/useNations";
import { useNodes } from "@/engine/useNodes";
import { tickAll } from "@/engine/tick";

export default function Home() {
  const { pops, place, update, remove } = usePops();
  const { nations, setNations, add } = useNations();
  const nodesState = useNodes();

  return (
    <main className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100">
        <h1 className="text-lg font-semibold">Inkunzi</h1>
        <span className="text-sm text-zinc-400">slice 5 — add nation</span>
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <WorldMapLoader
            pops={pops}
            nodes={nodesState.nodes}
            nations={nations}
            onPlacePop={(y, x) => place(x, y)}
            onPlaceNode={(y, x) => nodesState.place(x, y)}
            onUpdatePop={update}
            onRemovePop={remove}
            onUpdateNode={nodesState.update}
            onRemoveNode={nodesState.remove}
          />
        </div>
        <NationPanel
          nations={nations}
          pops={pops}
          onTick={() => setNations(tickAll(nations, pops, nodesState.nodes))}
          onAdd={add}
        />
      </div>
    </main>
  );
}