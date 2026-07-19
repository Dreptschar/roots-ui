import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ActionPlanCreateRequest,
  PlantActionCreateRequest,
  PlantCreateRequest,
  PlantDetailViewModel,
  PlantUpdateRequest,
} from '../types';
import {
  createActionPlan,
  createPlant,
  deleteActionPlan,
  deleteLoggedAction,
  deletePlant,
  getPlant,
  logAction,
  updatePlant,
} from '../lib/localDb';

export function usePlant(id: number | undefined) {
  const [plant, setPlant] = useState<PlantDetailViewModel | undefined>();
  const [loading, setLoading] = useState(true);

  const refreshVersion = useRef(0);

  const refresh = useCallback(async () => {
    if (id === undefined) {
      setPlant(undefined);
      setLoading(false);
      return undefined;
    }

    const currentVersion = ++refreshVersion.current;

    setLoading(true);

    try {
      const refreshedPlant = await getPlant(id);

      // Another refresh started while this one was running.
      // Do not let the older result overwrite the newer one.
      if (currentVersion !== refreshVersion.current) {
        return refreshedPlant;
      }

      setPlant(refreshedPlant);
      return refreshedPlant;
    } catch (error) {
      console.error(`Failed to load plant ${id}`, error);

      // Keep the currently displayed plant instead of removing its photo.
      return undefined;
    } finally {
      if (currentVersion === refreshVersion.current) {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    void refresh();

    return () => {
      // Invalidates a running refresh when the component unmounts
      // or when the plant ID changes.
      refreshVersion.current += 1;
    };
  }, [refresh]);

  return {
    plant,
    loading,
    refresh,
    savePlant: async (draft: PlantCreateRequest | PlantUpdateRequest, existingId?: number) => {
      if (existingId !== undefined) {
        const saved = await updatePlant(draft, existingId);
        await refresh();
        return saved;
      }

      return createPlant(draft);
    },
    removePlant: async () => {
      if (id === undefined) return;
      await deletePlant(id);
    },
    deleteActionPlan: async (actionPlanId: number, plantId: number) => {
      if (id === undefined) return;
      await deleteActionPlan(actionPlanId, plantId);
      await refresh();
      return;
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
    deleteLoggedAction: async (plantId: number, plantActionId: number, actionPlanId?: number) => {
      if (id === undefined) return;
      await deleteLoggedAction(plantId, plantActionId, actionPlanId);
      await refresh();
      return;
    },
  };
}
