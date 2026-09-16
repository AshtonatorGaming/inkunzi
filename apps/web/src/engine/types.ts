export type PopId = string;

export type Pop = {
  id: PopId;
  x: number;
  y: number;
  owner: string;
  culture: string;
  religion: string;
  settled: boolean;
};

export type NationId = string;

export type Nation = {
  id: NationId;
  name: string;
  color: string;
  treasury: number;
  stability: number;
};