import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RoomsPage } from '../src/pages/RoomsPage';
import { __resetLocalDbForTests } from '../src/lib/localDb';

beforeEach(async () => {
  await __resetLocalDbForTests();
});

describe('RoomsPage', () => {
  it('creates a room through the local data layer and shows it immediately', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RoomsPage />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /add room/i }));
    const dialog = await screen.findByRole('dialog', { name: /add room/i });
    await user.type(within(dialog).getByLabelText(/room name/i), 'Kitchen');
    await user.click(within(dialog).getByRole('button', { name: /^add room$/i }));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /kitchen/i })).toBeInTheDocument();
    });
  });
});
