import { Configuration, ActionPlansApi, ActionTypesApi, PlantActionsApi, PlantsApi, RoomsApi } from '../generated/openapi';

const basePath = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');

const config = new Configuration({
  basePath
});

export const roomsApi = new RoomsApi(config);
export const actionTypesApi = new ActionTypesApi(config);
export const plantsApi = new PlantsApi(config);
export const actionPlansApi = new ActionPlansApi(config);
export const plantActionsApi = new PlantActionsApi(config);
