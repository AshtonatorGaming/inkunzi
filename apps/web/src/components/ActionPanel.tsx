"use client";

import { useState } from "react";
import type { GameAction } from "@/engine/actionTypes";

export default function ActionPanel({
  actions,
  onSubmit,
  onAccept,
  onDeny,
}: {
  actions: GameAction[];
  onSubmit: (title: string, detail: string) => void;
  onAccept: (id: string) => void;
  onDeny: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const pending = actions.filter((a) => a.status === "pending");
  const recent = actions.filter((a) => a.status !== "pending").slice(0, 8);

  return (
    <aside className="h-full w-72 shrink-0 overflow-y-auto border-r border-zinc-700 bg-zinc-900 p-3 text-zinc-100">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Actions
      </h2>
      <form
        className="mb-3 space-y-1"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onSubmit(title.trim(), detail.trim());
          setTitle("");
          setDetail("");
        }}
      >
        <input
          className="w-full rounded bg-zinc-800 px-2 py-1 text-sm"
          placeholder="War / RP / claim"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full rounded bg-zinc-800 px-2 py-1 text-sm"
          placeholder="Detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
        <button type="submit" className="rounded bg-zinc-700 px-2 py-1 text-xs">
          Queue
        </button>
      </form>
      <ul className="space-y-2">
        {pending.map((a) => (
          <li key={a.id} className="rounded bg-zinc-800 px-2 py-1 text-xs">
            <div className="font-medium text-sm">{a.title}</div>
            <div className="text-zinc-400">{a.kind}</div>
            {a.detail && <div className="text-zinc-500">{a.detail}</div>}
            <div className="mt-1 flex gap-1">
              <button
                type="button"
                className="rounded bg-emerald-800 px-2 py-0.5"
                onClick={() => onAccept(a.id)}
              >
                Accept
              </button>
              <button
                type="button"
                className="rounded bg-red-900 px-2 py-0.5"
                onClick={() => onDeny(a.id)}
              >
                Deny
              </button>
            </div>
          </li>
        ))}
      </ul>
      {recent.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-1 text-xs uppercase text-zinc-500">Resolved</h3>
          <ul className="space-y-1 text-xs text-zinc-500">
            {recent.map((a) => (
              <li key={a.id}>
                {a.status} · {a.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}