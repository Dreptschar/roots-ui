export type RoomRecord = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ActionTypeRecord = {
    id: number;
    label: string;
    icon?: string;
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
};