import { expect, test } from '@playwright/test';
import { addWateringPlan, createPlant, createRoom } from './support/plant-helpers';

test('waters from an overview card and prevents another same-day watering', async ({ page }) => {
  await page.goto('/');
  await createRoom(page, 'Living room');
  await createPlant(page, {
    name: 'Monstera',
    species: 'Monstera deliciosa',
    room: 'Living room',
  });
  await addWateringPlan(page, 7);

  await page.getByRole('link', { name: 'Plants', exact: true }).click();

  const dashboardCard = page.getByRole('article').filter({ hasText: 'Monstera' });
  await expect(dashboardCard.getByRole('button', { name: 'Water Monstera' })).toContainText('💧');
  await dashboardCard.getByRole('button', { name: 'Water Monstera' }).click();

  await expect(page).toHaveURL(/\/plants$/);
  await expect(dashboardCard).toContainText('today');
  await expect(dashboardCard).toContainText('In 7 days');
  const wateredDashboardButton = dashboardCard.getByRole('button', { name: 'Monstera watered today' });
  await expect(wateredDashboardButton).toContainText('Watered today');
  await expect(wateredDashboardButton).toBeDisabled();

  await page.getByRole('link', { name: 'Rooms', exact: true }).click();
  await page.getByRole('link', { name: /Living room/ }).click();

  const roomCard = page.getByRole('article').filter({ hasText: 'Monstera' });
  const wateredRoomButton = roomCard.getByRole('button', { name: 'Monstera watered today' });

  await expect(page).toHaveURL(/\/rooms\/\d+$/);
  await expect(roomCard).toContainText('today');
  await expect(wateredRoomButton).toContainText('Watered today');
  await expect(wateredRoomButton).toBeDisabled();

  await roomCard.getByRole('link', { name: /Monstera/ }).click();
  const recentActions = page.getByRole('heading', { name: 'Recent actions' }).locator('..');
  await expect(recentActions.locator('.scheduleCard')).toHaveCount(1);
});
