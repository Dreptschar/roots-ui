import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SettingsPage } from '../src/pages/SettingsPage';
import { __resetLocalDbForTests } from '../src/lib/localDb';

beforeEach(async () => {
  await __resetLocalDbForTests();
});

describe('SettingsPage', () => {
  it('creates a new action type and refreshes the list', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /add action/i }));
    const dialog = await screen.findByRole('dialog', { name: /add action/i });
    await user.type(within(dialog).getByLabelText(/name/i), 'Misting');
    await user.click(within(dialog).getByRole('button', { name: /^add action$/i }));

    await waitFor(() => {
      expect(screen.getByText('Misting')).toBeInTheDocument();
    });
  });
});
