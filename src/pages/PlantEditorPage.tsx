import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PlantForm } from '../components/PlantForm';
import { usePlant } from '../hooks/usePlant';
import { useReferenceData } from '../hooks/useReferenceData';
import type { PlantCreateRequest } from '../types';

type PlantEditorPageProps = {
  mode: 'create' | 'edit';
};

export function PlantEditorPage({ mode }: PlantEditorPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const plantId = id ? Number(id) : undefined;
  const { rooms, loading: referenceLoading } = useReferenceData();
  const { plant, loading: plantLoading, savePlant } = usePlant(mode === 'edit' ? plantId : undefined);

  const initialValues: PlantCreateRequest | undefined =
    mode === 'edit' && plant
      ? {
          name: plant.name,
          species: plant.species,
          roomId: plant.roomId,
          notes: plant.notes,
          photoPath: plant.photoPath
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
            submitLabel={mode === 'create' ? 'Create plant' : 'Save changes'}
            onSubmit={async (draft) => {
              const saved = await savePlant(draft, plant?.id);
              navigate(saved ? `/plants/${saved.id}` : '/');
            }}
          />
        )}
      </section>
    </Layout>
  );
}
