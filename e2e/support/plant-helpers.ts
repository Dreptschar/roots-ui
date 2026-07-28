import { expect, type Locator, type Page } from '@playwright/test';

export async function createRoom(page: Page, name: string) {
  await page.getByRole('link', { name: 'Rooms', exact: true }).click();
  await page.getByRole('button', { name: 'Add room' }).click();

  const roomDialog = page.getByRole('dialog', { name: 'Add room' });
  await roomDialog.getByLabel('Room name').fill(name);
  await roomDialog.getByRole('button', { name: 'Add room' }).click();
}

export async function createPlant(
  page: Page,
  plant: { name: string; species: string; room: string; photoPath?: string },
) {
  await page.getByRole('link', { name: 'Plants', exact: true }).click();
  await page.getByRole('link', { name: 'Add plant' }).click();

  await page.getByLabel('Name').fill(plant.name);
  await page.getByLabel('Species').fill(plant.species);
  await page.getByLabel('Room').selectOption({ label: plant.room });
  if (plant.photoPath) {
    await page.getByLabel('Plant photo').setInputFiles(plant.photoPath);
  }
  await page.getByRole('button', { name: 'Add plant' }).click();

  const plantCard = page.getByRole('article').filter({ hasText: plant.name });
  await expect(plantCard.locator('.inlineMeta')).toHaveText(plant.room);
  await expect(plantCard.getByText('Room', { exact: true })).toHaveCount(0);
  await plantCard.getByRole('link', { name: new RegExp(plant.name) }).click();
}

export async function addActionPlan(page: Page, action: { label: string; intervalDays: number }) {
  await page.getByRole('button', { name: 'Add action plan' }).click();

  const planDialog = page.getByRole('dialog', { name: 'Add action plan' });
  await planDialog.getByLabel('Action').selectOption({ label: action.label });
  await planDialog.getByLabel('Interval days').fill(String(action.intervalDays));
  await planDialog.getByRole('button', { name: 'Save plan' }).click();
}

export async function addWateringPlan(page: Page, intervalDays: number) {
  await addActionPlan(page, { label: '💧 Watering', intervalDays });
}

export async function logAction(page: Page, actionLabel: string) {
  await page.getByRole('button', { name: 'Log action' }).click();

  const logDialog = page.getByRole('dialog', { name: 'Log action' });
  await logDialog.getByLabel('Action').selectOption({ label: actionLabel });
  await logDialog.getByRole('button', { name: 'Save action' }).click();
}

export async function logWatering(page: Page) {
  await logAction(page, '💧 Watering');
}

export async function swipeLeftToDelete(page: Page, row: Locator) {
  await row.scrollIntoViewIfNeeded();
  const bounds = await row.boundingBox();

  expect(bounds).not.toBeNull();
  if (!bounds) return;

  const startX = bounds.x + bounds.width * 0.9;
  const endX = bounds.x + bounds.width * 0.1;
  const y = bounds.y + bounds.height / 2;
  const hasTouch = await page.evaluate(() => navigator.maxTouchPoints > 0);

  if (hasTouch) {
    await row.locator('.swipeRowContent').evaluate(
      (element, coordinates) => {
        const createTouch = (clientX: number) =>
          new Touch({
            identifier: 1,
            target: element,
            clientX,
            clientY: coordinates.y,
          });
        const dispatch = (type: string, clientX: number, active: boolean) => {
          const touch = createTouch(clientX);
          element.dispatchEvent(
            new TouchEvent(type, {
              bubbles: true,
              cancelable: true,
              touches: active ? [touch] : [],
              targetTouches: active ? [touch] : [],
              changedTouches: [touch],
            }),
          );
        };

        dispatch('touchstart', coordinates.startX, true);
        for (let step = 1; step <= 12; step += 1) {
          dispatch('touchmove', coordinates.startX + ((coordinates.endX - coordinates.startX) * step) / 12, true);
        }
        dispatch('touchend', coordinates.endX, false);
      },
      { startX, endX, y },
    );
    return;
  }

  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(endX, y, { steps: 12 });
  await page.mouse.up();
}
