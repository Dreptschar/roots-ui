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
    const action = await logAction(plant.id, {
      actionTypeId: watering.id,
      performedAt,
    });

    const detail = await getPlant(plant.id);
    expect(action.actionPlanId).toBe(plan.id);
    expect(detail?.actions?.[0].performedAt.getTime()).toBe(performedAt.getTime());
    expect(detail?.actionPlans?.[0].lastPerformedAt?.getTime()).toBe(performedAt.getTime());
    expect(detail?.actionPlans?.[0].nextDueAt?.getTime()).toBe(new Date('2026-07-21T09:30:00.000Z').getTime());
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
