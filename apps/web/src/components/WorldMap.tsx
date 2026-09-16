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

function ClickLog() {
  useMapEvents({
    click(e) {
      console.log("map click", { y: e.latlng.lat, x: e.latlng.lng });
    },
  });
  return null;
}

export default function WorldMap() {
  const [pops] = useState(STARTER_POPS);

  return (
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
      <ClickLog />
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
  );
}