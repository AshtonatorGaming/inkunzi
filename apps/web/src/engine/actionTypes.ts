export type ActionKind = "flavor" | "march" | "war" | "claim";
export type ActionStatus = "pending" | "accepted" | "denied";

export type GameAction = {
  id: string;
  kind: ActionKind;
  title: string;
  detail: string;
  status: ActionStatus;
  armyId?: string;
  toX?: number;
  toY?: number;
  nationId?: string;
};