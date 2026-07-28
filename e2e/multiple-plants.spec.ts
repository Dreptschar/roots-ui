import { expect, test } from '@playwright/test';
import { addWateringPlan, createPlant, createRoom, logWatering } from './support/plant-helpers';

test('creates two plants with watering schedules and two log entries each', async ({ page }) => {
  const plants = [
    { name: 'Monstera', species: 'Monstera deliciosa', intervalDays: 7 },
    { name: 'Snake Plant', species: 'Dracaena trifasciata', intervalDays: 10 },
  ];

  await page.goto('/');
  await createRoom(page, 'Living room');

  for (const plant of plants) {
    await createPlant(page, { ...plant, room: 'Living room' });
    await expect(page.getByRole('heading', { name: plant.name, level: 2 })).toBeVisible();

    await addWateringPlan(page, plant.intervalDays);
    await logWatering(page);
    await logWatering(page);

    const actionPlans = page.getByRole('heading', { name: 'Action plans' }).locator('..').locator('..');
    const recentActions = page.getByRole('heading', { name: 'Recent actions' }).locator('..');

    await expect(actionPlans.locator('.scheduleCard')).toHaveCount(1);
    await expect(actionPlans).toContainText(`Every ${plant.intervalDays} days`);
    await expect(recentActions.locator('.scheduleCard')).toHaveCount(2);
    await expect(recentActions.locator('.scheduleCard')).toHaveText([/Watering/, /Watering/]);

    await page.reload();

    await expect(page.getByRole('heading', { name: plant.name, level: 2 })).toBeVisible();
    await expect(recentActions.locator('.scheduleCard')).toHaveCount(2);
  }

  await page.getByRole('link', { name: 'Plants', exact: true }).click();
  await expect(page.getByRole('link', { name: /Monstera/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Snake Plant/ })).toBeVisible();
});
