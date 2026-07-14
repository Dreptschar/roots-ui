import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import type { PlantCreateRequest, RoomRecord } from '../types';
import { createRoom } from '../lib/localDb';
import { useObjectUrl } from '../hooks/useObjectUrl';

type PlantFormProps = {
  initialValues?: PlantCreateRequest;
  initialPhotoBlob?: Blob;
  rooms: RoomRecord[];
  draft?: PlantCreateRequest;
  onDraftChange?: (draft: PlantCreateRequest) => void;
  onSubmit: (draft: PlantCreateRequest) => Promise<void> | void;
  onRoomCreated?: () => Promise<void> | void;
  submitLabel: string;
};

const emptyDraft: PlantCreateRequest = {
  name: '',
  species: '',
  roomId: 0,
  notes: ''
};

const ADD_ROOM_VALUE = '__add_room__';

export function PlantForm({
  initialValues,
  initialPhotoBlob,
  rooms,
  draft: controlledDraft,
  onDraftChange,
  onSubmit,
  onRoomCreated,
  submitLabel
}: PlantFormProps) {
  const [internalDraft, setInternalDraft] = useState<PlantCreateRequest>(initialValues ?? emptyDraft);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [availableRooms, setAvailableRooms] = useState<RoomRecord[]>(rooms);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomSaving, setRoomSaving] = useState(false);
  const draft = controlledDraft ?? internalDraft;
  const setDraft = onDraftChange ?? setInternalDraft;

  useEffect(() => {
    if (controlledDraft) {
      return;
    }
    setInternalDraft(initialValues ?? emptyDraft);
    setPhotoFile(null);
  }, [initialValues, controlledDraft]);

  useEffect(() => {
    setAvailableRooms((current) => {
      const merged = new Map(current.map((room) => [room.id, room]));
      rooms.forEach((room) => merged.set(room.id, room));
      return Array.from(merged.values()).sort((left, right) => left.name.localeCompare(right.name));
    });
  }, [rooms]);

  useEffect(() => {
    if (!roomModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [roomModalOpen]);

  const photoPreviewUrl = useObjectUrl(photoFile ?? initialPhotoBlob);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...draft,
        roomId: draft.roomId,
        photoFile
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateRoom() {
    setRoomSaving(true);
    try {
      const room = await createRoom({ name: roomName });
      setAvailableRooms((current) => [...current.filter((item) => item.id !== room.id), room].sort((left, right) => left.name.localeCompare(right.name)));
      const nextDraft = { ...draft, roomId: room.id };
      setDraft(nextDraft);
      await onRoomCreated?.();
      setRoomName('');
      setRoomModalOpen(false);
    } finally {
      setRoomSaving(false);
    }
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
        <select
          value={draft.roomId ? String(draft.roomId) : ''}
          onChange={(event) => {
            const value = event.target.value;
            if (value === ADD_ROOM_VALUE) {
              setRoomModalOpen(true);
              return;
            }
            setDraft({ ...draft, roomId: Number(value) });
          }}
          required
        >
          <option value="" disabled>
            Choose a room
          </option>
          {availableRooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
          <option value={ADD_ROOM_VALUE}>Add room…</option>
        </select>
      </label>
      <label>
        Notes
        <textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} rows={5} />
      </label>
      <label>
        Plant photo
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
        />
      </label>
      {photoPreviewUrl ? (
        <img className="photoPreview" src={photoPreviewUrl} alt="Selected plant" />
      ) : null}
      <button className="primaryButton" type="submit" disabled={saving || !draft.roomId}>
        {saving ? 'Saving…' : submitLabel}
      </button>

      {roomModalOpen ? (
        <div className="modalBackdrop" role="presentation" onClick={() => setRoomModalOpen(false)}>
          <section
            className="modalCard panel stack"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-room-from-plant-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sectionHeading">
              <h3 id="add-room-from-plant-title">Add room</h3>
              <button className="secondaryButton" type="button" onClick={() => setRoomModalOpen(false)}>
                Close
              </button>
            </div>
            <div className="form compactForm">
              <label>
                Room name
                <input value={roomName} onChange={(event) => setRoomName(event.target.value)} required autoFocus />
              </label>
              <button
                className="primaryButton"
                type="button"
                disabled={roomSaving || !roomName.trim()}
                onClick={() => void handleCreateRoom()}
              >
                {roomSaving ? 'Saving…' : 'Add room'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </form>
  );
}
