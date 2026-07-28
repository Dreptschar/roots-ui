import { expect, test } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { addWateringPlan, createPlant, createRoom, logWatering, swipeLeftToDelete } from './support/plant-helpers';

test('deletes a watering log, schedule, and plant', async ({ page }) => {
  const photoPath = fileURLToPath(new URL('./fixtures/pothos.svg', import.meta.url));

  await page.goto('/');
  await createRoom(page, 'Office');
  await createPlant(page, {
    name: 'Pothos',
    species: 'Epipremnum aureum',
    room: 'Office',
    photoPath,
  });
  await addWateringPlan(page, 8);
  await logWatering(page);
  await logWatering(page);

  const plantPhoto = page.getByRole('img', { name: 'Pothos' });
  const actionPlans = page.getByRole('heading', { name: 'Action plans' }).locator('..').locator('..');
  const recentActions = page.getByRole('heading', { name: 'Recent actions' }).locator('..');
  const actionRows = recentActions.locator('.swipeRow');
  const planRows = actionPlans.locator('.swipeRow');

  await expect(plantPhoto).toBeVisible();
  await expect
    .poll(() => plantPhoto.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0))
    .toBe(true);

  await expect(actionRows).toHaveCount(2);
  await swipeLeftToDelete(page, actionRows.first());
  await expect(actionRows).toHaveCount(1);
  await expect(plantPhoto).toBeVisible();

  await expect(planRows).toHaveCount(1);
  await swipeLeftToDelete(page, planRows.first());
  await expect(planRows).toHaveCount(0);
  await expect(actionPlans).toContainText('No action plans yet.');
  await expect(plantPhoto).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Pothos', level: 2 })).toBeVisible();
  await expect(plantPhoto).toBeVisible();
  await expect
    .poll(() => plantPhoto.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0))
    .toBe(true);

  await page.getByRole('button', { name: 'Delete' }).click();

  await expect(page).toHaveURL(/\/plants$/);
  await expect(page.getByRole('link', { name: /Pothos/ })).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole('link', { name: /Pothos/ })).toHaveCount(0);
});
