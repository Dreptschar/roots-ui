import { expect, test } from '@playwright/test';

test('creates and persists a plant with a watering schedule and action history', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/plants$/);
  await expect(page.getByRole('heading', { name: 'Plants', level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Rooms' }).click();
  await page.getByRole('button', { name: 'Add room' }).click();

  const roomDialog = page.getByRole('dialog', { name: 'Add room' });
  await roomDialog.getByLabel('Room name').fill('Kitchen');
  await roomDialog.getByRole('button', { name: 'Add room' }).click();

  const kitchenRoom = page.getByRole('link', { name: /Kitchen/ });
  await expect(kitchenRoom).toContainText('0 plants');

  await page.getByRole('link', { name: 'Plants', exact: true }).click();
  await page.getByRole('link', { name: 'Add plant' }).click();

  await page.getByLabel('Name').fill('Monstera');
  await page.getByLabel('Species').fill('Monstera deliciosa');
  await page.getByLabel('Room').selectOption({ label: 'Kitchen' });
  await page.getByLabel('Notes').fill('Keep near the east-facing window.');
  await page.getByRole('button', { name: 'Add plant' }).click();

  const plantCard = page.getByRole('article').filter({ hasText: 'Monstera' });
  await expect(plantCard).toContainText('Kitchen');
  await plantCard.getByRole('link', { name: /Monstera/ }).click();

  await expect(page.getByRole('heading', { name: 'Monstera', level: 2 })).toBeVisible();
  await expect(page.getByText('Keep near the east-facing window.')).toBeVisible();

  await page.getByRole('button', { name: 'Add action plan' }).click();
  const planDialog = page.getByRole('dialog', { name: 'Add action plan' });
  await planDialog.getByLabel('Action').selectOption({ label: '💧 Watering' });
  await planDialog.getByLabel('Interval days').fill('7');
  await planDialog.getByLabel('Notes').fill('Weekly watering');
  await planDialog.getByRole('button', { name: 'Save plan' }).click();

  const actionPlans = page.getByRole('heading', { name: 'Action plans' }).locator('..').locator('..');
  await expect(actionPlans).toContainText('Watering');
  await expect(actionPlans).toContainText('Every 7 days');

  await page.getByRole('button', { name: 'Log action' }).click();
  const logDialog = page.getByRole('dialog', { name: 'Log action' });
  await logDialog.getByLabel('Action').selectOption({ label: '💧 Watering' });
  await logDialog.getByRole('button', { name: 'Save action' }).click();

  const recentActions = page.getByRole('heading', { name: 'Recent actions' }).locator('..');
  await expect(recentActions).toContainText('Watering');

  await page.reload();

  await expect(page.getByRole('heading', { name: 'Monstera', level: 2 })).toBeVisible();
  await expect(actionPlans).toContainText('Every 7 days');
  await expect(recentActions).toContainText('Watering');
});
