"use client";

import dynamic from "next/dynamic";
import type { Army, Nation, Pop, ResourceNode } from "@/engine/types";

const WorldMap = dynamic(() => import("./WorldMap"), { ssr: false });

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

export default function WorldMapLoader(props: Props) {
  return <WorldMap {...props} />;
}