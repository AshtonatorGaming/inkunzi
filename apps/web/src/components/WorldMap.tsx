function MapClicks({
  tool,
  selectedArmyId,
  armies,
  marchRange,
  onPlacePop,
  onPlaceNode,
  onPlaceArmy,
  onMoveArmy,
  onSelectArmy,
}: {
  tool: Tool;
  selectedArmyId: string | null;
  armies: Army[];
  marchRange: number;
  onPlacePop: (y: number, x: number) => void;
  onPlaceNode: (y: number, x: number) => void;
  onPlaceArmy: (y: number, x: number) => void;
  onMoveArmy: (id: string, x: number, y: number) => void;
  onSelectArmy: (id: string | null) => void;
}) {
  useMapEvents({
    click(e) {
      const y = e.latlng.lat;
      const x = e.latlng.lng;
      if (tool === "pop") {
        onPlacePop(y, x);
        return;
      }
      if (tool === "node") {
        onPlaceNode(y, x);
        return;
      }
      if (tool === "army") {
        onPlaceArmy(y, x);
        return;
      }
      const hit = armies.find((a) => distance(a.x, a.y, x, y) <= 16);
      if (hit) {
        onSelectArmy(hit.id);
        return;
      }
      if (selectedArmyId) {
        const army = armies.find((a) => a.id === selectedArmyId);
        if (army && distance(army.x, army.y, x, y) <= marchRange) {
          onMoveArmy(selectedArmyId, x, y);
        }
        onSelectArmy(null);
      }
    },
  });
  return null;
}