import { type FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { usePlants } from '../hooks/usePlants';
import { useReferenceData } from '../hooks/useReferenceData';
import { createRoom } from '../lib/localDb';

export function RoomsPage() {
  const { plants, loading: plantsLoading } = usePlants();
  const { rooms, loading: roomsLoading, refresh } = useReferenceData();
  const [roomName, setRoomName] = useState('');
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const loading = plantsLoading || roomsLoading;

  useEffect(() => {
    if (!roomModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [roomModalOpen]);

  async function handleAddRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await createRoom({ name: roomName });
      setRoomName('');
      setRoomModalOpen(false);
      await refresh(true, { silent: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title="Rooms">
      <section className="panel">
        <div className="panelHeader">
          <h2>Rooms</h2>
          <button className="primaryButton" type="button" onClick={() => setRoomModalOpen(true)}>
            Add room
          </button>
        </div>
        {loading ? <p>Loading rooms…</p> : null}
        <div className="roomGrid">
          {rooms.map((room) => {
            const plantCount = plants.filter((plant) => plant.roomId === room.id).length;
            return (
              <Link key={room.id} to={`/rooms/${room.id}`} className="card roomCard">
                <div className="roomCardHeader">
                  <div>
                    <h2>{room.name}</h2>
                  </div>
                  <span className="pill">
                    {plantCount} plant{plantCount === 1 ? '' : 's'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {roomModalOpen ? (
        <div className="modalBackdrop" role="presentation" onClick={() => setRoomModalOpen(false)}>
          <section
            className="modalCard panel stack"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-room-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sectionHeading">
              <h3 id="add-room-title">Add room</h3>
              <button className="secondaryButton" type="button" onClick={() => setRoomModalOpen(false)}>
                Close
              </button>
            </div>
            <form className="form compactForm" onSubmit={handleAddRoom}>
              <label>
                Room name
                <input value={roomName} onChange={(event) => setRoomName(event.target.value)} required autoFocus />
              </label>
              <button className="primaryButton" type="submit" disabled={saving || !roomName.trim()}>
                {saving ? 'Saving…' : 'Add room'}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </Layout>
  );
}
