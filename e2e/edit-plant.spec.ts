import { expect, test } from '@playwright/test';
import { createPlant, createRoom } from './support/plant-helpers';

test('edits a plant, moves it to another room, and persists the changes', async ({ page }) => {
  await page.goto('/');
  await createRoom(page, 'Office');
  await createRoom(page, 'Living Room');
  await createPlant(page, {
    name: 'Pothos',
    species: 'Epipremnum aureum',
    room: 'Office',
  });

  await page.getByRole('link', { name: 'Edit', exact: true }).click();
  await page.getByLabel('Name').fill('Golden Pothos');
  await page.getByLabel('Species').fill('Epipremnum aureum Golden');
  await page.getByLabel('Room').selectOption({ label: 'Living Room' });
  await page.getByLabel('Notes').fill('Keep near the east-facing window.');
  await page.getByRole('button', { name: 'Save changes' }).click();

  await expect(page.getByRole('heading', { name: 'Golden Pothos', level: 2 })).toBeVisible();
  await expect(page.getByText('Epipremnum aureum Golden', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Living Room', exact: true })).toBeVisible();
  await expect(page.getByText('Keep near the east-facing window.', { exact: true })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('heading', { name: 'Golden Pothos', level: 2 })).toBeVisible();
  await expect(page.getByText('Epipremnum aureum Golden', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Living Room', exact: true })).toBeVisible();
  await expect(page.getByText('Keep near the east-facing window.', { exact: true })).toBeVisible();
});
