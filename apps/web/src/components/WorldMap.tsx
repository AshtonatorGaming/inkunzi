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
import type { Pop } from "@/engine/types";
import PopEditor from "./PopEditor";

const WIDTH = 6145;
const HEIGHT = 3530;
const PAD = 400;
const BOUNDS = new LatLngBounds([0, 0], [HEIGHT, WIDTH]);
const VIEW_BOUNDS = new LatLngBounds(
  [-PAD, -PAD],
  [HEIGHT + PAD, WIDTH + PAD]
);

type Props = {
  pops: Pop[];
  onPlace: (y: number, x: number) => void;
  onUpdate: (id: string, patch: Partial<Pop>) => void;
  onRemove: (id: string) => void;
};

function ownerColor(owner: string): string {
  if (owner === "Vestoria") return "#6b4";
  if (owner === "Tunnu") return "#48a";
  if (owner === "Unclaimed") return "#ccc";
  return "#c84";
}

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

export default function WorldMap({ pops, onPlace, onUpdate, onRemove }: Props) {
  const [placing, setPlacing] = useState(false);

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
        key="inkunzi-world"
        crs={CRS.Simple}
        bounds={BOUNDS}
        maxBounds={VIEW_BOUNDS}
        maxBoundsViscosity={0.6}
        minZoom={-3}
        maxZoom={3}
        style={{ height: "100%", width: "100%", background: "#1a1a16" }}
      >
        <ImageOverlay url="/maps/world.png" bounds={BOUNDS} />
        <PlacePops enabled={placing} onPlace={onPlace} />
        {pops.map((pop) => (
          <CircleMarker
            key={pop.id}
            center={[pop.y, pop.x]}
            radius={8}
            pathOptions={{
              color: pop.settled ? "#111" : "#a33",
              fillColor: ownerColor(pop.owner),
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <PopEditor
                pop={pop}
                onChange={(patch) => onUpdate(pop.id, patch)}
                onDelete={() => onRemove(pop.id)}
              />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}