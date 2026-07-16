import { useEffect, useState } from 'react';
import type {
  ActionPlanCreateRequest,
  PlantActionCreateRequest,
  PlantCreateRequest,
  PlantDetailViewModel,
  PlantUpdateRequest,
} from '../types';
import { createActionPlan, createPlant, deletePlant, getPlant, logAction, updatePlant } from '../lib/localDb';

export function usePlant(id: number | undefined) {
  const [plant, setPlant] = useState<PlantDetailViewModel | undefined>();
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (id === undefined) return;
    setLoading(true);
    try {
      setPlant(await getPlant(id));
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
      const saved = existingId ? await updatePlant(draft, existingId) : await createPlant(draft);
      await refresh();
      return saved;
    },
    removePlant: async () => {
      if (id === undefined) return;
      await deletePlant(id);
    },
    createActionPlan: async (draft: ActionPlanCreateRequest) => {
      if (id === undefined) return;
      const saved = await createActionPlan(id, draft);
      await refresh();
      return saved;
    },
    logAction: async (draft: PlantActionCreateRequest) => {
      if (id === undefined) return;
      const saved = await logAction(id, draft);
      await refresh();
      return saved;
    },
  };
}
