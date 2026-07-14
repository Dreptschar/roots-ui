import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PlantForm } from '../components/PlantForm';
import { usePlant } from '../hooks/usePlant';
import { useReferenceData } from '../hooks/useReferenceData';
import type { PlantCreateRequest } from '../types';

type PlantEditorPageProps = {
  mode: 'create' | 'edit';
};

export function PlantEditorPage({ mode }: PlantEditorPageProps) {
  const emptyDraft: PlantCreateRequest = {
    name: '',
    species: '',
    roomId: 0,
    notes: ''
  };
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plantId = id ? Number(id) : undefined;
  const { rooms, loading: referenceLoading, refresh } = useReferenceData();
  const { plant, loading: plantLoading, savePlant } = usePlant(mode === 'edit' ? plantId : undefined);
  const roomIdFromQuery = Number(searchParams.get('roomId'));
  const defaultRoomId = useMemo(() => {
    if (mode !== 'create') {
      return undefined;
    }
    return rooms.find((room) => room.id === roomIdFromQuery)?.id ?? rooms[0]?.id;
  }, [mode, roomIdFromQuery, rooms]);

  const [createDraft, setCreateDraft] = useState<PlantCreateRequest>(emptyDraft);

  useEffect(() => {
    if (mode !== 'create') {
      setCreateDraft(emptyDraft);
      return;
    }
    setCreateDraft((current) => {
      if (current.name || current.species || current.notes || current.roomId !== 0) {
        return current;
      }
      return {
        name: '',
        species: '',
        roomId: defaultRoomId ?? 0,
        notes: ''
      };
    });
  }, [mode, defaultRoomId]);

  useEffect(() => {
    if (mode !== 'create' || createDraft.roomId !== 0 || !defaultRoomId) {
      return;
    }
    setCreateDraft((current) => (current && current.roomId === 0 ? { ...current, roomId: defaultRoomId } : current));
  }, [mode, createDraft.roomId, defaultRoomId]);

  const initialValues: PlantCreateRequest | undefined =
    mode === 'edit' && plant
      ? {
          name: plant.name,
          species: plant.species,
          roomId: plant.roomId,
          notes: plant.notes
        }
      : undefined;

  return (
    <Layout title={mode === 'create' ? 'Add plant' : 'Edit plant'}>
      <section className="panel">
        {referenceLoading || (mode === 'edit' && plantLoading) ? (
          <p>Loading…</p>
        ) : mode === 'edit' && !plant ? (
          <p>Plant not found.</p>
        ) : (
          <PlantForm
            rooms={rooms}
            initialValues={initialValues}
            draft={mode === 'create' ? createDraft : undefined}
            onDraftChange={mode === 'create' ? setCreateDraft : undefined}
            initialPhotoBlob={plant?.photoBlob}
            onRoomCreated={() => refresh(true, { silent: true })}
            submitLabel={mode === 'create' ? 'Add plant' : 'Save changes'}
            onSubmit={async (draft) => {
              const saved = await savePlant(draft, plant?.id);
              navigate(saved ? (mode === 'create' ? `/rooms/${saved.roomId}` : `/plants/${saved.id}`) : '/');
            }}
          />
        )}
      </section>
    </Layout>
  );
}
