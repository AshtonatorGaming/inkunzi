"use client";

import { useState } from "react";
import WorldMapLoader from "@/components/WorldMapLoader";
import NationPanel from "@/components/NationPanel";
import ActionPanel from "@/components/ActionPanel";
import WindowFrame from "@/components/WindowFrame";
import NationWindow from "@/components/NationWindow";
import { usePops } from "@/engine/usePops";
import { useNations } from "@/engine/useNations";
import { useNodes } from "@/engine/useNodes";
import { useArmies } from "@/engine/useArmies";
import { useSession } from "@/engine/useSession";
import { useActions } from "@/engine/useActions";
import { tickAll } from "@/engine/tick";
import { advanceDay, advanceTurn } from "@/engine/sessionStore";
import { buildSnapshot, downloadSnapshot, parseSnapshot } from "@/engine/worldIO";
import { makeWindow, type GameWindow } from "@/engine/windows";
import { turnMarchRange } from "@/engine/movement";
import { applyMoveBattles } from "@/engine/battle";
import { makeAction } from "@/engine/actionStore";
import type { Session } from "@/engine/types";

export default function Home() {
  const { pops, setPops, place, update, remove } = usePops();
  const { nations, setNations, add } = useNations();
  const nodesState = useNodes();
  const armiesState = useArmies();
  const { session, setSession } = useSession();
  const { actions, add: addAction, setStatus } = useActions();
  const [windows, setWindows] = useState<GameWindow[]>([]);
  const [selectedArmyId, setSelectedArmyId] = useState<string | null>(null);
  const [marchingArmyId, setMarchingArmyId] = useState<string | null>(null);
  const [log, setLog] = useState<string>("");
  const [staffLive, setStaffLive] = useState(true);

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

  function openNation(id: string) {
    const n = nations.find((x) => x.id === id);
    if (!n) return;
    setWindows((cur) => [
      ...cur,
      makeWindow("nation", n.name, n.id, 72, 72 + cur.length * 24),
    ]);
  }

  function applyMarch(armyId: string, x: number, y: number) {
    const moved = armiesState.armies.map((a) =>
      a.id === armyId ? { ...a, x, y } : a
    );
    const result = applyMoveBattles(moved, armyId);
    armiesState.setArmies(result.armies);
    setLog(result.log[0] ?? "Marched.");
    setMarchingArmyId(null);
    setSelectedArmyId(null);
  }

  function moveArmy(id: string, x: number, y: number) {
    const army = armiesState.armies.find((a) => a.id === id);
    const title = `March ${army?.ownerId ?? "army"}`;
    const detail = `to ${Math.round(x)}, ${Math.round(y)}`;
    if (staffLive) {
      addAction({
        ...makeAction("march", title, detail, { armyId: id, toX: x, toY: y }),
        status: "accepted",
      });
      applyMarch(id, x, y);
      return;
    }
    addAction(makeAction("march", title, detail, { armyId: id, toX: x, toY: y }));
    setLog("March queued for staff.");
    setMarchingArmyId(null);
  }

  function acceptAction(id: string) {
    const action = actions.find((a) => a.id === id);
    if (!action) return;
    if (
      action.kind === "march" &&
      action.armyId != null &&
      action.toX != null &&
      action.toY != null
    ) {
      applyMarch(action.armyId, action.toX, action.toY);
    }
    setStatus(id, "accepted");
  }

  return (
    <main className="relative flex h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100">
        <h1 className="text-lg font-semibold">{current.name}</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300">
          <span>
            Turn {current.mechanicalTurn} · Day {current.calendarDay}
          </span>
          {log && <span className="text-amber-300">{log}</span>}
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={staffLive}
              onChange={(e) => setStaffLive(e.target.checked)}
            />
            Staff live
          </label>
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
        <ActionPanel
          actions={actions}
          onSubmit={(title, detail) =>
            addAction(makeAction("flavor", title, detail))
          }
          onAccept={acceptAction}
          onDeny={(id) => setStatus(id, "denied")}
        />
        <div className="min-w-0 flex-1">
          <WorldMapLoader
            mapWidth={current.mapWidth}
            mapHeight={current.mapHeight}
            marchRange={turnMarchRange(current)}
            selectedArmyId={selectedArmyId}
            marchingArmyId={marchingArmyId}
            pops={pops}
            nodes={nodesState.nodes}
            armies={armiesState.armies}
            nations={nations}
            onSelectArmy={(id) => {
              setSelectedArmyId(id);
              setMarchingArmyId(null);
            }}
            onStartMarch={(id) => {
              setSelectedArmyId(id);
              setMarchingArmyId(id);
            }}
            onMoveArmy={moveArmy}
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
          onOpenNation={openNation}
        />
      </div>
      {windows.map((win) => {
        const nation = nations.find((n) => n.id === win.payload);
        if (win.kind !== "nation" || !nation) return null;
        return (
          <WindowFrame
            key={win.id}
            win={win}
            onMove={(id, x, y) =>
              setWindows((cur) =>
                cur.map((w) => (w.id === id ? { ...w, x, y } : w))
              )
            }
            onClose={(id) => setWindows((cur) => cur.filter((w) => w.id !== id))}
          >
            <NationWindow nation={nation} pops={pops} />
          </WindowFrame>
        );
      })}
    </main>
  );
}