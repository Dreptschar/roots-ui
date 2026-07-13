import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import type { PlantCreateRequest, RoomResponse } from '../types';

type PlantFormProps = {
  initialValues?: PlantCreateRequest;
  rooms: RoomResponse[];
  onSubmit: (draft: PlantCreateRequest) => Promise<void> | void;
  submitLabel: string;
};

const emptyDraft: PlantCreateRequest = {
  name: '',
  species: '',
  roomId: 0,
  notes: '',
  photoPath: ''
};

export function PlantForm({ initialValues, rooms, onSubmit, submitLabel }: PlantFormProps) {
  const [draft, setDraft] = useState<PlantCreateRequest>(initialValues ?? emptyDraft);
  const [saving, setSaving] = useState(false);

  const selectedRoomId = useMemo(() => String(draft.roomId || rooms[0]?.id || ''), [draft.roomId, rooms]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    await onSubmit({
      ...draft,
      roomId: Number(selectedRoomId),
      photoPath: draft.photoPath ?? ''
    });
    setSaving(false);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Name
        <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required />
      </label>
      <label>
        Species
        <input value={draft.species} onChange={(event) => setDraft({ ...draft, species: event.target.value })} required />
      </label>
      <label>
        Room
        <select value={selectedRoomId} onChange={(event) => setDraft({ ...draft, roomId: Number(event.target.value) })} required>
          <option value="" disabled>
            Choose a room
          </option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Notes
        <textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} rows={5} />
      </label>
      <label>
        Photo path
        <input
          value={draft.photoPath ?? ''}
          onChange={(event) => setDraft({ ...draft, photoPath: event.target.value })}
          placeholder="/uploads/plant.jpg"
        />
      </label>
      <button className="primaryButton" type="submit" disabled={saving || !rooms.length}>
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
