"use client";

import dynamic from "next/dynamic";
import type { Nation, Pop } from "@/engine/types";

const WorldMap = dynamic(() => import("./WorldMap"), { ssr: false });

type Props = {
  pops: Pop[];
  nations: Nation[];
  onPlace: (y: number, x: number) => void;
  onUpdate: (id: string, patch: Partial<Pop>) => void;
  onRemove: (id: string) => void;
};

export default function WorldMapLoader(props: Props) {
  return <WorldMap {...props} />;
}