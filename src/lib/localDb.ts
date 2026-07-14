import type {
  ActionPlanCreateRequest,
  ActionPlanRecord,
  ActionTypeCreateRequest,
  ActionTypeRecord,
  PlantActionCreateRequest,
  PlantActionRecord,
  PlantCreateRequest,
  PlantDetailRecord,
  PlantRecord,
  PlantUpdateRequest,
  RoomCreateRequest,
  RoomRecord
} from '../types';

const DB_NAME = 'roots-ui';
const DB_VERSION = 3;

const ROOMS_STORE = 'rooms';
const ACTION_TYPES_STORE = 'actionTypes';
const PLANTS_STORE = 'plants';
const ACTION_PLANS_STORE = 'actionPlans';
const ACTIONS_STORE = 'actions';

let dbPromise: Promise<IDBDatabase> | undefined;

function trimText(value: string) {
  return value.trim();
}

function requireText(value: string, fieldName: string) {
  const trimmed = trimText(value);
  if (!trimmed) {
    throw new Error(`${fieldName} is required`);
  }
  return trimmed;
}

function now() {
  return new Date();
}

function addDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

function request<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

function txComplete(transaction: IDBTransaction): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'));
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'));
  });
}

function ensureIndex(
  store: IDBObjectStore,
  indexName: string,
  keyPath: string,
  options?: IDBIndexParameters
) {
  if (!store.indexNames.contains(indexName)) {
    store.createIndex(indexName, keyPath, options);
  }
}

async function openDatabase(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

      openRequest.onupgradeneeded = () => {
        const db = openRequest.result;
        const transaction = openRequest.transaction;

        const roomsStore = db.objectStoreNames.contains(ROOMS_STORE)
          ? transaction?.objectStore(ROOMS_STORE)
          : db.createObjectStore(ROOMS_STORE, { keyPath: 'id' });
        const actionTypesStore = db.objectStoreNames.contains(ACTION_TYPES_STORE)
          ? transaction?.objectStore(ACTION_TYPES_STORE)
          : db.createObjectStore(ACTION_TYPES_STORE, { keyPath: 'id' });
        const plantsStore = db.objectStoreNames.contains(PLANTS_STORE)
          ? transaction?.objectStore(PLANTS_STORE)
          : db.createObjectStore(PLANTS_STORE, { keyPath: 'id' });
        const actionPlansStore = db.objectStoreNames.contains(ACTION_PLANS_STORE)
          ? transaction?.objectStore(ACTION_PLANS_STORE)
          : db.createObjectStore(ACTION_PLANS_STORE, { keyPath: 'id' });
        const actionsStore = db.objectStoreNames.contains(ACTIONS_STORE)
          ? transaction?.objectStore(ACTIONS_STORE)
          : db.createObjectStore(ACTIONS_STORE, { keyPath: 'id' });

        if (!roomsStore || !actionTypesStore || !plantsStore || !actionPlansStore || !actionsStore) {
          throw new Error('Failed to initialize IndexedDB stores');
        }

        ensureIndex(actionPlansStore, 'plantId', 'plantId', { unique: false });
        ensureIndex(actionsStore, 'plantId', 'plantId', { unique: false });
        ensureIndex(actionsStore, 'performedAt', 'performedAt', { unique: false });
      };

      openRequest.onsuccess = () => {
        const db = openRequest.result;
        db.onversionchange = () => {
          db.close();
          dbPromise = undefined;
        };
        resolve(db);
      };

      openRequest.onerror = () => {
        dbPromise = undefined;
        reject(openRequest.error ?? new Error('Failed to open IndexedDB'));
      };
    });
  }

  return dbPromise;
}

export async function __resetLocalDbForTests() {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
    dbPromise = undefined;
  }

  await new Promise<void>((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
    deleteRequest.onsuccess = () => resolve();
    deleteRequest.onerror = () => reject(deleteRequest.error ?? new Error('Failed to delete IndexedDB database'));
    deleteRequest.onblocked = () => resolve();
  });
}

async function readAll<T>(db: IDBDatabase, storeName: string) {
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  const items = (await request(store.getAll())) as T[];
  await txComplete(transaction);
  return items;
}

async function readOne<T>(db: IDBDatabase, storeName: string, key: IDBValidKey) {
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  const item = (await request(store.get(key))) as T | undefined;
  await txComplete(transaction);
  return item;
}

async function getRoomById(db: IDBDatabase, id: number) {
  return readOne<RoomRecord>(db, ROOMS_STORE, id);
}

async function getActionPlansForPlant(db: IDBDatabase, plantId: number) {
  const transaction = db.transaction(ACTION_PLANS_STORE, 'readonly');
  const store = transaction.objectStore(ACTION_PLANS_STORE);
  const index = store.index('plantId');
  const plans = (await request(index.getAll(plantId))) as ActionPlanRecord[];
  await txComplete(transaction);
  return plans.sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime());
}

async function getActionsForPlant(db: IDBDatabase, plantId: number) {
  const transaction = db.transaction(ACTIONS_STORE, 'readonly');
  const store = transaction.objectStore(ACTIONS_STORE);
  const index = store.index('plantId');
  const actions = (await request(index.getAll(plantId))) as PlantActionRecord[];
  await txComplete(transaction);
  return actions.sort((left, right) => right.performedAt.getTime() - left.performedAt.getTime());
}

function nextId<T extends { id: number }>(items: T[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

function toDetail(
  plant: PlantRecord,
  room: RoomRecord | undefined,
  actionPlans: ActionPlanRecord[],
  actions: PlantActionRecord[]
): PlantDetailRecord {
  return {
    ...plant,
    room,
    actionPlans,
    actions
  };
}

export async function getRooms() {
  const db = await openDatabase();
  const rooms = await readAll<RoomRecord>(db, ROOMS_STORE);
  return rooms.sort((left, right) => left.name.localeCompare(right.name));
}

export async function createRoom(draft: RoomCreateRequest) {
  const db = await openDatabase();
  const currentRooms = await readAll<RoomRecord>(db, ROOMS_STORE);
  const id = nextId(currentRooms);
  const name = requireText(draft.name, 'Room name');

  const transaction = db.transaction(ROOMS_STORE, 'readwrite');
  const store = transaction.objectStore(ROOMS_STORE);
  const timestamp = now();
  const room: RoomRecord = {
    id,
    name,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  await request(store.put(room));
  await txComplete(transaction);
  return room;
}

export async function updateRoom(roomId: number, draft: RoomCreateRequest) {
  const db = await openDatabase();
  const existing = await readOne<RoomRecord>(db, ROOMS_STORE, roomId);
  if (!existing) {
    return undefined;
  }
  const name = requireText(draft.name, 'Room name');

  const transaction = db.transaction(ROOMS_STORE, 'readwrite');
  const store = transaction.objectStore(ROOMS_STORE);
  const room: RoomRecord = {
    ...existing,
    name,
    updatedAt: now()
  };

  await request(store.put(room));
  await txComplete(transaction);
  return room;
}

export async function deleteRoom(roomId: number) {
  const db = await openDatabase();
  const transaction = db.transaction(ROOMS_STORE, 'readwrite');
  const store = transaction.objectStore(ROOMS_STORE);
  await request(store.delete(roomId));
  await txComplete(transaction);
}

export async function getActionTypes() {
  const db = await openDatabase();
  const actionTypes = await readAll<ActionTypeRecord>(db, ACTION_TYPES_STORE);
  return actionTypes.sort((left, right) => left.label.localeCompare(right.label));
}

export async function createActionType(draft: ActionTypeCreateRequest) {
  const db = await openDatabase();
  const existingItems = await readAll<ActionTypeRecord>(db, ACTION_TYPES_STORE);
  const id = nextId(existingItems);
  const label = requireText(draft.label, 'Action type label');
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const uniqueKey = existingItems.some((item) => item.key === slug)
    ? `${slug || 'action'}-${id}`
    : slug || `action-${id}`;

  const transaction = db.transaction(ACTION_TYPES_STORE, 'readwrite');
  const store = transaction.objectStore(ACTION_TYPES_STORE);
  const actionType: ActionTypeRecord = {
    id,
    key: uniqueKey,
    label,
    icon: undefined
  };

  await request(store.put(actionType));
  await txComplete(transaction);
  return actionType;
}

export async function getPlants() {
  const db = await openDatabase();
  const plants = await readAll<PlantRecord>(db, PLANTS_STORE);
  return plants.sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime());
}

export async function getPlant(plantId: number) {
  const db = await openDatabase();

  const plant = await readOne<PlantRecord>(db, PLANTS_STORE, plantId);
  if (!plant) {
    return undefined;
  }

  const [room, actionPlans, actions] = await Promise.all([
    getRoomById(db, plant.roomId),
    getActionPlansForPlant(db, plantId),
    getActionsForPlant(db, plantId)
  ]);

  return toDetail(plant, room, actionPlans, actions);
}

export async function savePlant(draft: PlantCreateRequest | PlantUpdateRequest, existingId?: number) {
  const db = await openDatabase();
  const currentPlants = await readAll<PlantRecord>(db, PLANTS_STORE);
  const existing = existingId !== undefined ? await readOne<PlantRecord>(db, PLANTS_STORE, existingId) : undefined;
  const id = existing?.id ?? nextId(currentPlants);
  const timestamp = now();
  const createdAt = existing?.createdAt ?? timestamp;
  const name = requireText(draft.name, 'Plant name');
  const species = requireText(draft.species, 'Plant species');

  const transaction = db.transaction(PLANTS_STORE, 'readwrite');
  const store = transaction.objectStore(PLANTS_STORE);
  const plant: PlantRecord = {
    id,
    name,
    species,
    roomId: draft.roomId,
    notes: trimText(draft.notes),
    photoBlob: draft.photoFile ?? existing?.photoBlob,
    createdAt,
    updatedAt: timestamp
  };

  await request(store.put(plant));
  await txComplete(transaction);
  return plant;
}

export async function deletePlant(plantId: number) {
  const db = await openDatabase();
  const [plans, actions] = await Promise.all([getActionPlansForPlant(db, plantId), getActionsForPlant(db, plantId)]);

  const transaction = db.transaction([PLANTS_STORE, ACTION_PLANS_STORE, ACTIONS_STORE], 'readwrite');
  transaction.objectStore(PLANTS_STORE).delete(plantId);

  const actionPlansStore = transaction.objectStore(ACTION_PLANS_STORE);
  plans.forEach((plan) => actionPlansStore.delete(plan.id));

  const actionsStore = transaction.objectStore(ACTIONS_STORE);
  actions.forEach((action) => actionsStore.delete(action.id));

  await txComplete(transaction);
}

export async function createActionPlan(plantId: number, draft: ActionPlanCreateRequest) {
  const db = await openDatabase();
  const existingPlans = await getActionPlansForPlant(db, plantId);
  const plant = await readOne<PlantRecord>(db, PLANTS_STORE, plantId);
  const matchingPlan = existingPlans.find((plan) => plan.actionTypeId === draft.actionTypeId);
  const timestamp = now();
  const resolvedLastPerformedAt = draft.lastPerformedAt ?? matchingPlan?.lastPerformedAt;
  const resolvedNextDueAt =
    draft.nextDueAt ?? (resolvedLastPerformedAt ? addDays(resolvedLastPerformedAt, draft.intervalDays) : undefined);

  const transaction = db.transaction([PLANTS_STORE, ACTION_PLANS_STORE], 'readwrite');
  const plantsStore = transaction.objectStore(PLANTS_STORE);
  const actionPlansStore = transaction.objectStore(ACTION_PLANS_STORE);

  const record: ActionPlanRecord = {
    id: matchingPlan?.id ?? nextId(existingPlans),
    plantId,
    actionTypeId: draft.actionTypeId,
    intervalDays: draft.intervalDays,
    lastPerformedAt: resolvedLastPerformedAt,
    nextDueAt: resolvedNextDueAt,
    active: draft.active,
    notes: draft.notes?.trim() || undefined,
    createdAt: matchingPlan?.createdAt ?? timestamp,
    updatedAt: timestamp
  };

  await request(actionPlansStore.put(record));

  if (plant) {
    await request(
      plantsStore.put({
        ...plant,
        updatedAt: timestamp
      })
    );
  }

  await txComplete(transaction);
  return record;
}

export async function logAction(plantId: number, draft: PlantActionCreateRequest) {
  const db = await openDatabase();
  const existingActions = await getActionsForPlant(db, plantId);
  const plant = await readOne<PlantRecord>(db, PLANTS_STORE, plantId);
  const plan = draft.actionPlanId ? await readOne<ActionPlanRecord>(db, ACTION_PLANS_STORE, draft.actionPlanId) : undefined;
  const timestamp = now();

  const transaction = db.transaction([PLANTS_STORE, ACTION_PLANS_STORE, ACTIONS_STORE], 'readwrite');
  const plantsStore = transaction.objectStore(PLANTS_STORE);
  const actionPlansStore = transaction.objectStore(ACTION_PLANS_STORE);
  const actionsStore = transaction.objectStore(ACTIONS_STORE);

  const action: PlantActionRecord = {
    id: nextId(existingActions),
    plantId,
    actionTypeId: plan?.actionTypeId ?? draft.actionTypeId,
    actionPlanId: draft.actionPlanId,
    performedAt: draft.performedAt,
    notes: draft.notes?.trim() || undefined
  };

  await request(actionsStore.put(action));

  if (plan) {
    const updatedPlan: ActionPlanRecord = {
      ...plan,
      lastPerformedAt: draft.performedAt,
      nextDueAt: addDays(draft.performedAt, plan.intervalDays),
      updatedAt: timestamp
    };
    await request(actionPlansStore.put(updatedPlan));
  }

  if (plant) {
    await request(
      plantsStore.put({
        ...plant,
        updatedAt: timestamp
      })
    );
  }

  await txComplete(transaction);
  return action;
}
