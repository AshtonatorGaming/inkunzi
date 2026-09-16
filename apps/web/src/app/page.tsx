import WorldMapLoader from "../components/WorldMapLoader";

export default function Home() {
  return (
    <main className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100">
        <h1 className="text-lg font-semibold">Inkunzi</h1>
        <span className="text-sm text-zinc-400">slice 1 — dead map</span>
      </header>
      <div className="min-h-0 flex-1">
        <WorldMapLoader />
      </div>
    </main>
  );
}