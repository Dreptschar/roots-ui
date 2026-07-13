import { useEffect, useMemo, useState } from 'react';
import type { PlantCreateRequest, PlantSummaryResponse, PlantUpdateRequest, PlantViewModel } from '../types';
import { actionTypesApi, plantsApi, roomsApi } from '../lib/backend';

function deriveWateringState(
  plant: PlantSummaryResponse,
  roomsById: Map<number, string>,
  wateringActionTypeId: number | undefined,
  actions: Array<{ actionTypeId: number; performedAt: Date }>,
  actionPlans: Array<{ actionTypeId: number; intervalDays: number; lastPerformedAt?: Date; nextDueAt?: Date }>
): PlantViewModel {
  const wateringPlan = actionPlans.find((plan) => plan.actionTypeId === wateringActionTypeId);
  const lastWateredAt =
    actions
      .filter((action) => action.actionTypeId === wateringActionTypeId)
      .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime())[0]?.performedAt ?? wateringPlan?.lastPerformedAt;

  const nextWateringDueAt =
    wateringPlan?.nextDueAt ??
    (lastWateredAt && wateringPlan ? new Date(lastWateredAt.getTime() + wateringPlan.intervalDays * 86400000) : undefined);

  return {
    ...plant,
    roomName: roomsById.get(plant.roomId),
    lastWateredAt,
    wateringIntervalDays: wateringPlan?.intervalDays,
    nextWateringDueAt
  };
}

export function usePlants() {
  const [plants, setPlants] = useState<PlantViewModel[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [plantItems, rooms, actionTypes] = await Promise.all([
        plantsApi.plantsGet().catch(() => []),
        roomsApi.roomsGet().catch(() => []),
        actionTypesApi.actionTypesGet().catch(() => [])
      ]);
      const roomNames = new Map(rooms.map((room) => [room.id, room.name]));
      const wateringActionTypeId = actionTypes.find((actionType) => actionType.key === 'watering')?.id;

      setPlants(
        plantItems.map((plant) => ({
          ...plant,
          roomName: roomNames.get(plant.roomId)
        }))
      );

      const detailData = await Promise.all(
        plantItems.map(async (plant) => {
          const detail = await plantsApi.plantsPlantIdGet({ plantId: plant.id }).catch(() => undefined);
          return { plant, detail };
        })
      );
      setPlants(
        detailData.map(({ plant, detail }) =>
          deriveWateringState(
            plant,
            roomNames,
            wateringActionTypeId,
            detail?.actions ?? [],
            detail?.actionPlans ?? []
          )
        )
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

  const actions = useMemo(
    () => ({
      refresh,
      save: async (draft: PlantCreateRequest | PlantUpdateRequest, existing?: PlantSummaryResponse) => {
        const saved = existing
          ? await plantsApi.plantsPlantIdPatch({ plantId: existing.id, plantUpdateRequest: draft as PlantUpdateRequest })
          : await plantsApi.plantsPost({ plantCreateRequest: draft as PlantCreateRequest });
        await refresh();
        return saved;
      },
      remove: async (id: number) => {
        await plantsApi.plantsPlantIdDelete({ plantId: id });
        await refresh();
      }
    }),
    []
  );

  return { plants, loading, ...actions };
}
