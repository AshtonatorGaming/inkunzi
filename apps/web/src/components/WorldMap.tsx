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
import type { Army, Nation, Pop, ResourceNode } from "@/engine/types";
import { MAP_LAYERS, colorFromKey, type MapLayer } from "@/engine/mapLayers";
import PopEditor from "./PopEditor";
import NodeEditor from "./NodeEditor";
import ArmyEditor from "./ArmyEditor";

const WIDTH = 6145;
const HEIGHT = 3530;
const PAD = 400;
const BOUNDS = new LatLngBounds([0, 0], [HEIGHT, WIDTH]);
const VIEW_BOUNDS = new LatLngBounds(
  [-PAD, -PAD],
  [HEIGHT + PAD, WIDTH + PAD]
);

type Tool = "none" | "pop" | "node" | "army";

type Props = {
  pops: Pop[];
  nodes: ResourceNode[];
  armies: Army[];
  nations: Nation[];
  onPlacePop: (y: number, x: number) => void;
  onPlaceNode: (y: number, x: number) => void;
  onPlaceArmy: (y: number, x: number) => void;
  onUpdatePop: (id: string, patch: Partial<Pop>) => void;
  onRemovePop: (id: string) => void;
  onUpdateNode: (id: string, patch: Partial<ResourceNode>) => void;
  onRemoveNode: (id: string) => void;
  onUpdateArmy: (id: string, patch: Partial<Army>) => void;
  onRemoveArmy: (id: string) => void;
};

function PlaceTool({
  tool,
  onPlacePop,
  onPlaceNode,
  onPlaceArmy,
}: {
  tool: Tool;
  onPlacePop: (y: number, x: number) => void;
  onPlaceNode: (y: number, x: number) => void;
  onPlaceArmy: (y: number, x: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (tool === "pop") onPlacePop(e.latlng.lat, e.latlng.lng);
      if (tool === "node") onPlaceNode(e.latlng.lat, e.latlng.lng);
      if (tool === "army") onPlaceArmy(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function WorldMap({
  pops,
  nodes,
  armies,
  nations,
  onPlacePop,
  onPlaceNode,
  onPlaceArmy,
  onUpdatePop,
  onRemovePop,
  onUpdateNode,
  onRemoveNode,
  onUpdateArmy,
  onRemoveArmy,
}: Props) {
  const [tool, setTool] = useState<Tool>("none");
  const [layer, setLayer] = useState<MapLayer>("all");
  const colorById = new Map(nations.map((n) => [n.id, n.color]));

  const showPops = layer === "all" || layer === "political" || layer === "culture" || layer === "religion";
  const showNodes = layer === "all" || layer === "resources";
  const showArmies = layer === "all" || layer === "military";

  function popFill(pop: Pop): string {
    if (layer === "culture") return colorFromKey(pop.culture);
    if (layer === "religion") return colorFromKey(pop.religion);
    return colorById.get(pop.ownerId) ?? "#ccc";
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1/2 top-3 z-[1000] flex -translate-x-1/2 flex-wrap justify-center gap-2 rounded bg-zinc-900/80 px-2 py-1">
        <button
          type="button"
          onClick={() => setTool((t) => (t === "pop" ? "none" : "pop"))}
          className={`rounded px-3 py-1 text-sm font-medium ${
            tool === "pop" ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-100"
          }`}
        >
          Place pop
        </button>
        <button
          type="button"
          onClick={() => setTool((t) => (t === "node" ? "none" : "node"))}
          className={`rounded px-3 py-1 text-sm font-medium ${
            tool === "node" ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-100"
          }`}
        >
          Place node
        </button>
        <button
          type="button"
          onClick={() => setTool((t) => (t === "army" ? "none" : "army"))}
          className={`rounded px-3 py-1 text-sm font-medium ${
            tool === "army" ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-100"
          }`}
        >
          Place army
        </button>
        {MAP_LAYERS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLayer(l.id)}
            className={`rounded px-2 py-1 text-xs ${
              layer === l.id ? "bg-zinc-100 text-zinc-900" : "bg-zinc-800 text-zinc-100"
            }`}
          >
            {l.label}
          </button>
        ))}
        <span className="self-center text-xs text-zinc-300">
          {pops.length} pops · {nodes.length} nodes · {armies.length} armies
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
        <PlaceTool
          tool={tool}
          onPlacePop={onPlacePop}
          onPlaceNode={onPlaceNode}
          onPlaceArmy={onPlaceArmy}
        />
        {showPops &&
          pops.map((pop) => (
            <CircleMarker
              key={pop.id}
              center={[pop.y, pop.x]}
              radius={8}
              pathOptions={{
                color: pop.settled ? "#111" : "#a33",
                fillColor: popFill(pop),
                fillOpacity: 0.9,
                weight: 2,
              }}
            >
              <Popup>
                <PopEditor
                  pop={pop}
                  nations={nations}
                  onChange={(patch) => onUpdatePop(pop.id, patch)}
                  onDelete={() => onRemovePop(pop.id)}
                />
              </Popup>
            </CircleMarker>
          ))}
        {showNodes &&
          nodes.map((node) => (
            <CircleMarker
              key={node.id}
              center={[node.y, node.x]}
              radius={6}
              pathOptions={{
                color: "#222",
                fillColor: colorFromKey(node.resourceId),
                fillOpacity: 0.95,
                weight: 2,
              }}
            >
              <Popup>
                <NodeEditor
                  node={node}
                  nations={nations}
                  onChange={(patch) => onUpdateNode(node.id, patch)}
                  onDelete={() => onRemoveNode(node.id)}
                />
              </Popup>
            </CircleMarker>
          ))}
        {showArmies &&
          armies.map((army) => (
            <CircleMarker
              key={army.id}
              center={[army.y, army.x]}
              radius={10}
              pathOptions={{
                color: "#111",
                fillColor: colorById.get(army.ownerId) ?? "#ccc",
                fillOpacity: 0.95,
                weight: 3,
              }}
            >
              <Popup>
                <ArmyEditor
                  army={army}
                  nations={nations}
                  onChange={(patch) => onUpdateArmy(army.id, patch)}
                  onDelete={() => onRemoveArmy(army.id)}
                />
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
}