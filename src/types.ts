import { ActionPlanRecord, PlantActionRecord, PlantRecord, RoomRecord } from './dbTypes';

export type ActionTypeCreateRequest = {
  label: string;
};

export type PlantDetailViewModel = PlantRecord & {
  room?: RoomRecord;
  actionPlans?: ActionPlanRecord[];
  actions?: PlantActionRecord[];
};

export type PlantCreateRequest = {
  name: string;
  species: string;
  roomId: number;
  notes: string;
  photoFile?: File | null;
};

export type PlantUpdateRequest = PlantCreateRequest;

export type ActionPlanCreateRequest = {
  actionTypeId: number;
  intervalDays: number;
  active: boolean;
  notes?: string;
};

export type PlantActionCreateRequest = {
  actionTypeId: number;
  performedAt: Date;
};

export type PlantViewModel = PlantRecord & {
  roomName?: string;
  lastWateredAt?: Date;
  wateringIntervalDays?: number;
  nextWateringDueAt?: Date;
};

export type RoomCreateRequest = {
  name: string;
};
