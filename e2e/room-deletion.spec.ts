import { expect, test } from '@playwright/test';
import { createPlant, createRoom } from './support/plant-helpers';

test('only allows deleting an empty room', async ({ page }) => {
  await page.goto('/');
  await createRoom(page, 'Office');
  await createPlant(page, {
    name: 'Pothos',
    species: 'Epipremnum aureum',
    room: 'Office',
  });

  await page.getByRole('link', { name: 'Office', exact: true }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('alert')).toHaveText('Move or delete the 1 plant in this room first.');
  await expect(page).toHaveURL(/\/rooms\/\d+$/);

  await page.getByRole('link', { name: /Pothos/ }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('link', { name: 'Rooms', exact: true }).click();
  await page.getByRole('link', { name: /Office/ }).click();

  await expect(page.getByRole('button', { name: 'Delete' })).toBeEnabled();
  await page.getByRole('button', { name: 'Delete' }).click();

  await expect(page).toHaveURL(/\/rooms$/);
  await expect(page.getByRole('link', { name: /Office/ })).toHaveCount(0);
});
