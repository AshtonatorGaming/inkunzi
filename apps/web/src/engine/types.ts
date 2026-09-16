export type PopId = string;
export type NationId = string;
export type ResourceId = string;
export type NodeId = string;

export type ResourceDef = {
  id: ResourceId;
  label: string;
  kind: "food" | "material" | "wealth" | "military";
};

export type ResourceLedger = Record<ResourceId, number>;

export type Nation = {
  id: NationId;
  name: string;
  color: string;
  treasury: number;
  stability: number;
  resources: ResourceLedger;
};

export type Pop = {
  id: PopId;
  x: number;
  y: number;
  ownerId: NationId;
  culture: string;
  religion: string;
  settled: boolean;
};

export type ResourceNode = {
  id: NodeId;
  x: number;
  y: number;
  resourceId: ResourceId;
  ownerId: NationId;
  yield: number;
};