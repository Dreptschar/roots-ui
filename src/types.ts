export type {
  ActionPlanCreateRequest,
  ActionPlanResponse,
  ActionTypeResponse,
  PlantActionCreateRequest,
  PlantActionResponse,
  PlantCreateRequest,
  PlantDetailResponse,
  PlantSummaryResponse,
  PlantUpdateRequest,
  RoomCreateRequest,
  RoomResponse,
  RoomUpdateRequest
} from './generated/openapi';

export type PlantViewModel = {
  id: number;
  name: string;
  species: string;
  roomId: number;
  notes: string;
  photoPath: string;
  createdAt: Date;
  updatedAt: Date;
  roomName?: string;
  lastWateredAt?: Date;
  wateringIntervalDays?: number;
  nextWateringDueAt?: Date;
};
