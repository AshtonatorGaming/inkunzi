"use client";

import dynamic from "next/dynamic";
import type { Nation, Pop, ResourceNode } from "@/engine/types";

const WorldMap = dynamic(() => import("./WorldMap"), { ssr: false });

type Props = {
  pops: Pop[];
  nodes: ResourceNode[];
  nations: Nation[];
  onPlacePop: (y: number, x: number) => void;
  onPlaceNode: (y: number, x: number) => void;
  onUpdatePop: (id: string, patch: Partial<Pop>) => void;
  onRemovePop: (id: string) => void;
  onUpdateNode: (id: string, patch: Partial<ResourceNode>) => void;
  onRemoveNode: (id: string) => void;
};

export default function WorldMapLoader(props: Props) {
  return <WorldMap {...props} />;
}