"use client";

import { useState } from "react";
import type { GameWindow } from "@/engine/windows";

export default function WindowFrame({
  win,
  onMove,
  onClose,
  children,
}: {
  win: GameWindow;
  onMove: (id: string, x: number, y: number) => void;
  onClose: (id: string) => void;
  children: React.ReactNode;
}) {
  const [drag, setDrag] = useState<{ dx: number; dy: number } | null>(null);

  return (
    <div
      className="absolute z-[2000] w-72 rounded border border-zinc-600 bg-zinc-900 text-zinc-100 shadow-xl"
      style={{ left: win.x, top: win.y }}
    >
      <div
        className="flex cursor-move items-center justify-between bg-zinc-800 px-2 py-1 text-sm"
        onMouseDown={(e) => {
          setDrag({ dx: e.clientX - win.x, dy: e.clientY - win.y });
        }}
        onMouseMove={(e) => {
          if (!drag) return;
          onMove(win.id, e.clientX - drag.dx, e.clientY - drag.dy);
        }}
        onMouseUp={() => setDrag(null)}
        onMouseLeave={() => setDrag(null)}
      >
        <span>{win.title}</span>
        <button type="button" onClick={() => onClose(win.id)}>
          ×
        </button>
      </div>
      <div className="p-2 text-sm">{children}</div>
    </div>
  );
}