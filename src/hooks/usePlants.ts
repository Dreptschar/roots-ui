import { useEffect, useState } from 'react';
import type { PlantViewModel } from '../types';
import { getActionTypes, getPlant, getPlants, getRooms } from '../lib/localDb';
import { DEFAULT_ACTION_TYPES } from '../lib/defaultTypes';
import { PlantRecord } from '../dbTypes';

function deriveWateringState(
  plant: PlantRecord,
  roomsById: Map<number, string>,
  actions: Array<{ actionTypeId: number; performedAt: Date }>,
  actionPlans: Array<{ actionTypeId: number; intervalDays: number; lastPerformedAt?: Date; nextDueAt?: Date }>,
): PlantViewModel {
  const wateringPlan = actionPlans.find((plan) => plan.actionTypeId === DEFAULT_ACTION_TYPES[0].id);
  const lastWateredAt =
    actions
      .filter((action) => action.actionTypeId === DEFAULT_ACTION_TYPES[0].id)
      .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime())[0]?.performedAt ??
    wateringPlan?.lastPerformedAt;

  const nextWateringDueAt =
    wateringPlan?.nextDueAt ??
    (lastWateredAt && wateringPlan
      ? new Date(lastWateredAt.getTime() + wateringPlan.intervalDays * 86400000)
      : new Date());

  return {
    ...plant,
    roomName: roomsById.get(plant.roomId),
    lastWateredAt,
    wateringIntervalDays: wateringPlan?.intervalDays,
    nextWateringDueAt,
  };
}

export function usePlants() {
  const [plants, setPlants] = useState<PlantViewModel[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [plantItems, rooms, actionTypes] = await Promise.all([getPlants(), getRooms(), getActionTypes()]);
      const roomNames = new Map(rooms.map((room) => [room.id, room.name]));
      const detailData = await Promise.all(
        plantItems.map(async (plant) => ({ plant, detail: await getPlant(plant.id) })),
      );
      setPlants(
        detailData.map(({ plant, detail }) =>
          deriveWateringState(plant, roomNames, detail?.actions ?? [], detail?.actionPlans ?? []),
        ),
      );
    } catch {
      // Keep the list that was already fetched.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { plants, loading, refresh };
}
