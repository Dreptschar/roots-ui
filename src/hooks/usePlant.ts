import { useEffect, useState } from 'react';
import type {
  ActionPlanCreateRequest,
  PlantActionCreateRequest,
  PlantDetailResponse,
  PlantCreateRequest,
  PlantUpdateRequest
} from '../types';
import { actionPlansApi, plantActionsApi, plantsApi } from '../lib/backend';

export function usePlant(id: number | undefined) {
  const [plant, setPlant] = useState<PlantDetailResponse | undefined>();
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (id === undefined) return;
    setLoading(true);
    try {
      setPlant(await plantsApi.plantsPlantIdGet({ plantId: id }));
    } catch {
      setPlant(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id === undefined) {
      setPlant(undefined);
      setLoading(false);
      return;
    }
    void refresh();
  }, [id]);

  return {
    plant,
    loading,
    refresh,
    savePlant: async (draft: PlantCreateRequest | PlantUpdateRequest, existingId?: number) => {
      const saved = existingId
        ? await plantsApi.plantsPlantIdPatch({ plantId: existingId, plantUpdateRequest: draft as PlantUpdateRequest })
        : await plantsApi.plantsPost({ plantCreateRequest: draft as PlantCreateRequest });
      await refresh();
      return saved;
    },
    removePlant: async () => {
      if (id === undefined) return;
      await plantsApi.plantsPlantIdDelete({ plantId: id });
    },
    createActionPlan: async (draft: ActionPlanCreateRequest) => {
      if (id === undefined) return;
      const saved = await actionPlansApi.plantsPlantIdActionPlansPost({ plantId: id, actionPlanCreateRequest: draft });
      await refresh();
      return saved;
    },
    logAction: async (draft: PlantActionCreateRequest) => {
      if (id === undefined) return;
      const saved = await plantActionsApi.plantsPlantIdActionsPost({ plantId: id, plantActionCreateRequest: draft });
      await refresh();
      return saved;
    }
  };
}
