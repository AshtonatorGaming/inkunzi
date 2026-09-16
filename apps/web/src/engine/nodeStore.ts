import type { ResourceId, ResourceNode } from "./types";

const KEY = "inkunzi.nodes.v1";

export function loadNodes(): ResourceNode[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ResourceNode[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveNodes(nodes: ResourceNode[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(nodes));
}

export function makeNode(
  x: number,
  y: number,
  resourceId: ResourceId = "food"
): ResourceNode {
  return {
    id: crypto.randomUUID(),
    x,
    y,
    resourceId,
    ownerId: "unclaimed",
    yield: 2,
  };
}

export function updateNode(
  nodes: ResourceNode[],
  id: string,
  patch: Partial<ResourceNode>
): ResourceNode[] {
  return nodes.map((n) => (n.id === id ? { ...n, ...patch } : n));
}

export function removeNode(nodes: ResourceNode[], id: string): ResourceNode[] {
  return nodes.filter((n) => n.id !== id);
}