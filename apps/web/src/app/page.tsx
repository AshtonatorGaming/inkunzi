"use client";

import WorldMapLoader from "@/components/WorldMapLoader";
import NationPanel from "@/components/NationPanel";
import { usePops } from "@/engine/usePops";
import { useNations } from "@/engine/useNations";
import { useNodes } from "@/engine/useNodes";
import { useArmies } from "@/engine/useArmies";
import { useSession } from "@/engine/useSession";
import { tickAll } from "@/engine/tick";
import { advanceDay, advanceTurn } from "@/engine/sessionStore";
import { buildSnapshot, downloadSnapshot, parseSnapshot } from "@/engine/worldIO";
import type { Session } from "@/engine/types";

export default function Home() {
  const { pops, setPops, place, update, remove } = usePops();
  const { nations, setNations, add } = useNations();
  const nodesState = useNodes();
  const armiesState = useArmies();
  const { session, setSession } = useSession();

  if (!session || !setSession) return null;

  const current: Session = session;

  function exportWorld() {
    downloadSnapshot(
      buildSnapshot(
        current,
        nations,
        pops,
        nodesState.nodes,
        armiesState.armies
      )
    );
  }

  async function importWorld(file: File) {
    const text = await file.text();
    const snap = parseSnapshot(text);
    setSession(snap.session);
    setNations(snap.nations);
    setPops(snap.pops);
    nodesState.setNodes(snap.nodes);
    armiesState.setArmies(snap.armies);
  }

  return (
    <main className="flex h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100">
        <h1 className="text-lg font-semibold">{current.name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
          <span>
            Turn {current.mechanicalTurn} · Day {current.calendarDay} ·{" "}
            {current.daysPerTurn}d/turn · march {current.pixelsPerDayMarch}px/day
          </span>
          <button
            type="button"
            className="rounded bg-zinc-800 px-2 py-1"
            onClick={() => setSession(advanceDay(current))}
          >
            +Day
          </button>
          <button
            type="button"
            className="rounded bg-zinc-800 px-2 py-1"
            onClick={exportWorld}
          >
            Export
          </button>
          <label className="rounded bg-zinc-800 px-2 py-1">
            Import
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void importWorld(file);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="min-w-0 flex-1">
          <WorldMapLoader
            mapWidth={current.mapWidth}
            mapHeight={current.mapHeight}
            pops={pops}
            nodes={nodesState.nodes}
            armies={armiesState.armies}
            nations={nations}
            onPlacePop={(y, x) => place(x, y)}
            onPlaceNode={(y, x) => nodesState.place(x, y)}
            onPlaceArmy={(y, x) => armiesState.place(x, y)}
            onUpdatePop={update}
            onRemovePop={remove}
            onUpdateNode={nodesState.update}
            onRemoveNode={nodesState.remove}
            onUpdateArmy={armiesState.update}
            onRemoveArmy={armiesState.remove}
          />
        </div>
        <NationPanel
          nations={nations}
          pops={pops}
          onTick={() => {
            setNations(
              tickAll(nations, pops, nodesState.nodes, armiesState.armies)
            );
            setSession(advanceTurn(current));
          }}
          onAdd={add}
        />
      </div>
    </main>
  );
}