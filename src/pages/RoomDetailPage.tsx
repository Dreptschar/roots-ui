import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PlantCard } from '../components/PlantCard';
import { usePlants } from '../hooks/usePlants';
import { useReferenceData } from '../hooks/useReferenceData';
import { deleteRoom, updateRoom } from '../lib/localDb';

export function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const roomId = id ? Number(id) : undefined;
  const { rooms, loading: referenceLoading, refresh } = useReferenceData();
  const { plants, loading: plantsLoading, refresh: refreshPlants } = usePlants();
  const [roomName, setRoomName] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const room = useMemo(() => rooms.find((item) => item.id === roomId), [rooms, roomId]);
  const plantsInRoom = useMemo(
    () => plants.filter((plant) => plant.roomId === roomId),
    [plants, roomId]
  );

  useEffect(() => {
    if (!room) return;
    setRoomName(room.name);
  }, [room]);

  useEffect(() => {
    if (!editModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [editModalOpen]);

  async function handleUpdateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!room) return;
    setSaving(true);
    try {
      await updateRoom(room.id, { name: roomName });
      await refresh();
      await refreshPlants();
      setEditModalOpen(false);
    } finally {
      setSaving(false);
    }
  }

  if (referenceLoading || plantsLoading) {
    return (
      <Layout title="Room">
        <p>Loading…</p>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout title="Room">
        <section className="panel">
          <p>Room not found.</p>
          <Link to="/">Back to dashboard</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      title="Room"
      actions={
        <>
          <button className="secondaryButton" type="button" onClick={() => setEditModalOpen(true)}>
            Edit
          </button>
          <button
            className="dangerButton"
            type="button"
            disabled={plantsInRoom.length > 0}
            onClick={async () => {
              await deleteRoom(room.id);
              await refresh();
              await refreshPlants();
              navigate('/rooms');
            }}
          >
            Delete
          </button>
        </>
      }
    >
      <section className="panel stack">
        <div className="roomSummary">
          <div className="roomSummaryTitle">
            <h2>{room.name}</h2>
            <p>{plantsInRoom.length} plant{plantsInRoom.length === 1 ? '' : 's'}</p>
          </div>
          <Link className="primaryButton" to={`/plants/new?roomId=${room.id}`}>
            Add plant
          </Link>
        </div>

        <div className="grid">
          {plantsInRoom.length ? (
            plantsInRoom.map((plant) => <PlantCard key={plant.id} plant={plant} showRoom={false} />)
          ) : (
            <p>No plants in this room yet.</p>
          )}
        </div>
      </section>

      {editModalOpen ? (
        <div className="modalBackdrop" role="presentation" onClick={() => setEditModalOpen(false)}>
          <section
            className="modalCard panel stack"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-room-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sectionHeading">
              <h3 id="edit-room-title">Edit room</h3>
              <button className="secondaryButton" type="button" onClick={() => setEditModalOpen(false)}>
                Close
              </button>
            </div>
            <form className="form compactForm" onSubmit={handleUpdateRoom}>
              <label>
                Room name
                <input value={roomName} onChange={(event) => setRoomName(event.target.value)} required autoFocus />
              </label>
              <button className="primaryButton" type="submit" disabled={saving || !roomName.trim()}>
                {saving ? 'Saving…' : 'Save room'}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </Layout>
  );
}
