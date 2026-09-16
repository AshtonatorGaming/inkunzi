export type PopId = string;
export type NationId = string;

export type Nation = {
  id: NationId;
  name: string;
  color: string;
  treasury: number;
  stability: number;
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