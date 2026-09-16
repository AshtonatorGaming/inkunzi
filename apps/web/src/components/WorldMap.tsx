"use client";

import { useState } from "react";
import {
  MapContainer,
  ImageOverlay,
  CircleMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { CRS, LatLngBounds } from "leaflet";

const WIDTH = 6145;
const HEIGHT = 3530;
const PAD = 400;
const BOUNDS = new LatLngBounds([0, 0], [HEIGHT, WIDTH]);
const VIEW_BOUNDS = new LatLngBounds(
  [-PAD, -PAD],
  [HEIGHT + PAD, WIDTH + PAD]
);

type Pop = {
  id: string;
  y: number;
  x: number;
  owner: string;
  culture: string;
  religion: string;
  settled: boolean;
};

const STARTER_POPS: Pop[] = [
  { id: "p1", y: 420, x: 610, owner: "Vestoria", culture: "Eldari", religion: "Solar", settled: true },
  { id: "p2", y: 455, x: 640, owner: "Vestoria", culture: "Eldari", religion: "Solar", settled: true },
  { id: "p3", y: 700, x: 1100, owner: "Tunnu", culture: "Tunnu", religion: "Mountain Folk", settled: true },
  { id: "p4", y: 280, x: 1500, owner: "Horde", culture: "Steppe", religion: "Sky", settled: false },
];

function PlacePops({
  enabled,
  onPlace,
}: {
  enabled: boolean;
  onPlace: (y: number, x: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (!enabled) return;
      onPlace(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function WorldMap() {
  const [pops, setPops] = useState<Pop[]>(STARTER_POPS);
  const [placing, setPlacing] = useState(false);

  function placePop(y: number, x: number) {
    setPops((current) => [
      ...current,
      {
        id: `p${Date.now()}`,
        y,
        x,
        owner: "Unclaimed",
        culture: "Unknown",
        religion: "Unknown",
        settled: true,
      },
    ]);
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1/2 top-3 z-[1000] flex -translate-x-1/2 gap-2 rounded bg-zinc-900/80 px-2 py-1">
        <button
          type="button"
          onClick={() => setPlacing((on) => !on)}
          className={`rounded px-3 py-1 text-sm font-medium ${
            placing ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-100"
          }`}
        >
          {placing ? "Placing…" : "Place pop"}
        </button>
        <span className="self-center text-xs text-zinc-300">
          {pops.length} pops
        </span>
      </div>
      <MapContainer
        crs={CRS.Simple}
        bounds={BOUNDS}
        maxBounds={VIEW_BOUNDS}
        maxBoundsViscosity={0.6}
        minZoom={-3}
        maxZoom={3}
        style={{ height: "100%", width: "100%", background: "#1a1a16" }}
      >
        <ImageOverlay url="/maps/world.png" bounds={BOUNDS} />
        <PlacePops enabled={placing} onPlace={placePop} />
        {pops.map((pop) => (
          <CircleMarker
            key={pop.id}
            center={[pop.y, pop.x]}
            radius={8}
            pathOptions={{
              color: pop.settled ? "#111" : "#a33",
              fillColor:
                pop.owner === "Vestoria"
                  ? "#6b4"
                  : pop.owner === "Tunnu"
                    ? "#48a"
                    : pop.owner === "Unclaimed"
                      ? "#ccc"
                      : "#c84",
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <strong>{pop.owner}</strong>
              <br />
              {pop.culture} / {pop.religion}
              <br />
              {pop.settled ? "settled" : "nomad"}
              <br />
              <small>
                {pop.x.toFixed(0)}, {pop.y.toFixed(0)}
              </small>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}