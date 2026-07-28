import { expect, test } from '@playwright/test';
import { addActionPlan, createPlant, createRoom, logAction, swipeLeftToDelete } from './support/plant-helpers';

test('creates a custom action and uses it for a schedule and log entry', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Add action' }).click();

  const actionDialog = page.getByRole('dialog', { name: 'Add action' });
  await actionDialog.getByLabel('Name').fill('Misting');
  await actionDialog.getByRole('button', { name: 'Add action' }).click();

  await expect(page.getByText('Misting', { exact: true })).toBeVisible();

  await createRoom(page, 'Bathroom');
  await createPlant(page, {
    name: 'Boston Fern',
    species: 'Nephrolepis exaltata',
    room: 'Bathroom',
  });

  await addActionPlan(page, { label: 'Misting', intervalDays: 3 });
  await logAction(page, 'Misting');

  const actionPlans = page.getByRole('heading', { name: 'Action plans' }).locator('..').locator('..');
  const recentActions = page.getByRole('heading', { name: 'Recent actions' }).locator('..');

  await expect(actionPlans.locator('.scheduleCard')).toHaveCount(1);
  await expect(actionPlans).toContainText('Misting');
  await expect(actionPlans).toContainText('Every 3 days');
  await expect(recentActions.locator('.scheduleCard')).toHaveCount(1);
  await expect(recentActions).toContainText('Misting');

  await page.reload();

  await expect(page.getByRole('heading', { name: 'Boston Fern', level: 2 })).toBeVisible();
  await expect(actionPlans).toContainText('Misting');
  await expect(recentActions).toContainText('Misting');

  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Settings', level: 1 })).toBeVisible();
  const mistingRow = page.locator('.swipeRow').filter({ hasText: 'Misting' });
  await expect(mistingRow).toHaveCount(1);
  await swipeLeftToDelete(page, mistingRow);
  await expect(mistingRow).toHaveCount(0);

  await page.getByRole('link', { name: 'Plants', exact: true }).click();
  await page.getByRole('link', { name: /Boston Fern/ }).click();
  await expect(actionPlans).toContainText('No action plans yet.');
  await expect(recentActions).toContainText('No actions logged yet.');
});
