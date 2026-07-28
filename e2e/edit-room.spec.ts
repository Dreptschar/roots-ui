import { expect, test } from '@playwright/test';
import { createRoom } from './support/plant-helpers';

test('edits a room and persists its new name', async ({ page }) => {
  await page.goto('/');
  await createRoom(page, 'Office');
  await page.getByRole('link', { name: /Office/ }).click();

  await page.getByRole('button', { name: 'Edit' }).click();
  const editDialog = page.getByRole('dialog', { name: 'Edit room' });
  await editDialog.getByLabel('Room name').fill('Home Office');
  await editDialog.getByRole('button', { name: 'Save room' }).click();

  await expect(editDialog).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Home Office', level: 2 })).toBeVisible();

  await page.reload();

  await expect(page.getByRole('heading', { name: 'Home Office', level: 2 })).toBeVisible();
  await expect(page.getByText('Office', { exact: true })).toHaveCount(0);
});
