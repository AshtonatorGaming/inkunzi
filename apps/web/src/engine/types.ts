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