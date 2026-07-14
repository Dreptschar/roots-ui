export type RoomRecord = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ActionTypeRecord = {
  id: number;
  key: string;
  label: string;
  icon?: string;
};

export type ActionTypeCreateRequest = {
  label: string;
};

export type PlantRecord = {
  id: number;
  name: string;
  species: string;
  roomId: number;
  notes: string;
  photoBlob?: Blob;
  createdAt: Date;
  updatedAt: Date;
};

export type ActionPlanRecord = {
  id: number;
  plantId: number;
  actionTypeId: number;
  intervalDays: number;
  lastPerformedAt?: Date;
  nextDueAt?: Date;
  active: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PlantActionRecord = {
  id: number;
  plantId: number;
  actionTypeId: number;
  actionPlanId?: number;
  performedAt: Date;
  notes?: string;
};

export type PlantDetailRecord = PlantRecord & {
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
  lastPerformedAt?: Date;
  nextDueAt?: Date;
  active: boolean;
  notes?: string;
};

export type PlantActionCreateRequest = {
  actionTypeId: number;
  actionPlanId?: number;
  performedAt: Date;
  notes?: string;
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
