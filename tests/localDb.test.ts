import { beforeEach, describe, expect, it } from 'vitest';
import {
  __resetLocalDbForTests,
  createActionPlan,
  createActionType,
  createPlant,
  createRoom,
  deletePlant,
  getPlant,
  getRooms,
  logAction,
  updatePlant,
} from '../src/lib/localDb';

beforeEach(async () => {
  await __resetLocalDbForTests();
});

async function getStoreCount(storeName: string) {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('roots-ui');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open test database'));
  });

  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  const items = await new Promise<unknown[]>((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to read test store'));
  });

  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Failed to finish test transaction'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Test transaction aborted'));
  });

  db.close();
  return items.length;
}

async function seedVersion4DatabaseWithDuplicateActions() {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const openRequest = indexedDB.open('roots-ui', 4);
    openRequest.onupgradeneeded = () => {
      const database = openRequest.result;
      database.createObjectStore('rooms', { keyPath: 'id', autoIncrement: true });
      database.createObjectStore('actionTypes', { keyPath: 'id', autoIncrement: true });
      database.createObjectStore('plants', { keyPath: 'id', autoIncrement: true });
      const actionPlans = database.createObjectStore('actionPlans', { keyPath: 'id', autoIncrement: true });
      const actions = database.createObjectStore('actions', { keyPath: 'id', autoIncrement: true });
      actionPlans.createIndex('plantId', 'plantId', { unique: false });
      actions.createIndex('plantId', 'plantId', { unique: false });
      actions.createIndex('performedAt', 'performedAt', { unique: false });
      actions.createIndex('actionPlanId', 'actionPlanId', { unique: false });
    };
    openRequest.onsuccess = () => resolve(openRequest.result);
    openRequest.onerror = () => reject(openRequest.error ?? new Error('Failed to seed version 4 database'));
  });

  const transaction = db.transaction(['rooms', 'actionTypes', 'plants', 'actions'], 'readwrite');
  transaction.objectStore('rooms').add({
    id: 1,
    name: 'Office',
    createdAt: new Date(2026, 6, 1),
    updatedAt: new Date(2026, 6, 1),
  });
  transaction.objectStore('actionTypes').add({
    id: 1,
    label: '💧 Watering',
  });
  transaction.objectStore('plants').add({
    id: 1,
    name: 'Fern',
    species: 'Nephrolepis exaltata',
    roomId: 1,
    notes: '',
    createdAt: new Date(2026, 6, 1),
    updatedAt: new Date(2026, 6, 1),
  });
  transaction.objectStore('actions').add({
    id: 1,
    plantId: 1,
    actionTypeId: 1,
    performedAt: new Date(2026, 6, 14, 8, 0),
  });
  transaction.objectStore('actions').add({
    id: 2,
    plantId: 1,
    actionTypeId: 1,
    performedAt: new Date(2026, 6, 14, 18, 0),
  });

  await new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Failed to seed version 4 records'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Version 4 seed transaction aborted'));
  });
  db.close();
}

describe('localDb', () => {
  it('creates and updates local records with trimmed input', async () => {
    const room = await createRoom({ name: '  Living room  ' });
    const actionType = await createActionType({ label: '  Watering  ' });
    const plant = await createPlant({
      name: '  Monstera  ',
      species: 'deliciosa',
      roomId: room.id,
      notes: '  near the window  ',
    });

    expect(room.name).toBe('Living room');
    expect(actionType.label).toBe('Watering');
    expect(plant.name).toBe('Monstera');
    expect(plant.species).toBe('deliciosa');
    expect(plant.notes).toBe('near the window');

    const updatedPlant = await updatePlant(
      {
        name: 'Monstera Thai Constellation',
        species: plant.species,
        roomId: room.id,
        notes: plant.notes,
      },
      plant.id,
    );

    expect(updatedPlant.name).toBe('Monstera Thai Constellation');

    const rooms = await getRooms();
    expect(rooms).toHaveLength(1);
    expect(rooms[0].name).toBe('Living room');
  });

  it('keeps action plans and logged actions aligned for a plant', async () => {
    const room = await createRoom({ name: 'Office' });
    const watering = await createActionType({ label: 'Watering' });
    const plant = await createPlant({
      name: 'Snake Plant',
      species: 'Dracaena trifasciata',
      roomId: room.id,
      notes: '',
    });

    const plan = await createActionPlan(plant.id, {
      actionTypeId: watering.id,
      intervalDays: 7,
      active: true,
      notes: 'weekly',
    });

    expect(plan.nextDueAt).toBeUndefined();

    const performedAt = new Date('2026-07-14T09:30:00.000Z');
    const result = await logAction(plant.id, {
      actionTypeId: watering.id,
      performedAt,
    });

    const detail = await getPlant(plant.id);
    expect(result.status).toBe('created');
    expect(result.action.actionPlanId).toBe(plan.id);
    expect(result.action.performedOn).toBe('2026-07-14');
    expect(detail?.actions?.[0].performedAt.getTime()).toBe(performedAt.getTime());
    expect(detail?.actionPlans?.[0].lastPerformedAt?.getTime()).toBe(performedAt.getTime());
    expect(detail?.actionPlans?.[0].nextDueAt?.getTime()).toBe(new Date('2026-07-21T09:30:00.000Z').getTime());
  });

  it('does not log the same action twice for a plant on the same local day', async () => {
    const room = await createRoom({ name: 'Office' });
    const watering = await createActionType({ label: 'Watering' });
    const plant = await createPlant({
      name: 'Fern',
      species: 'Nephrolepis exaltata',
      roomId: room.id,
      notes: '',
    });
    const plan = await createActionPlan(plant.id, {
      actionTypeId: watering.id,
      intervalDays: 3,
      active: true,
    });
    const firstPerformedAt = new Date(2026, 6, 14, 8, 0);
    const duplicatePerformedAt = new Date(2026, 6, 14, 18, 0);

    const firstResult = await logAction(plant.id, {
      actionTypeId: watering.id,
      performedAt: firstPerformedAt,
    });
    const duplicateResult = await logAction(plant.id, {
      actionTypeId: watering.id,
      performedAt: duplicatePerformedAt,
    });

    expect(firstResult.status).toBe('created');
    expect(duplicateResult.status).toBe('already-logged');
    expect(duplicateResult.action.id).toBe(firstResult.action.id);

    const detail = await getPlant(plant.id);
    expect(detail?.actions).toHaveLength(1);
    expect(detail?.actionPlans?.find((item) => item.id === plan.id)?.lastPerformedAt?.getTime()).toBe(
      firstPerformedAt.getTime(),
    );
    expect(detail?.actionPlans?.find((item) => item.id === plan.id)?.nextDueAt?.getTime()).toBe(
      new Date(2026, 6, 17, 8, 0).getTime(),
    );
  });

  it('migrates legacy same-day duplicates by keeping the newest action', async () => {
    await seedVersion4DatabaseWithDuplicateActions();

    const detail = await getPlant(1);

    expect(detail?.actions).toHaveLength(1);
    expect(detail?.actions?.[0].id).toBe(2);
    expect(detail?.actions?.[0].performedOn).toBe('2026-07-14');
  });

  it('deletes a plant and its dependent records', async () => {
    const room = await createRoom({ name: 'Bedroom' });
    const watering = await createActionType({ label: 'Watering' });
    const plant = await createPlant({
      name: 'Pothos',
      species: 'Epipremnum aureum',
      roomId: room.id,
      notes: '',
    });

    await createActionPlan(plant.id, {
      actionTypeId: watering.id,
      intervalDays: 10,
      active: true,
    });
    await logAction(plant.id, {
      actionTypeId: watering.id,
      performedAt: new Date('2026-07-14T09:00:00.000Z'),
    });

    await deletePlant(plant.id);

    const deletedPlant = await getPlant(plant.id);
    expect(deletedPlant).toBeUndefined();
    expect(await getStoreCount('plants')).toBe(0);
    expect(await getStoreCount('actionPlans')).toBe(0);
    expect(await getStoreCount('actions')).toBe(0);
  });
});
