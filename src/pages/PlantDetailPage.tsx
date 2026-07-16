import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { formatDate } from '../lib/date';
import { useObjectUrl } from '../hooks/useObjectUrl';
import { usePlant } from '../hooks/usePlant';
import { useReferenceData } from '../hooks/useReferenceData';
import { DEFAULT_ACTION_TYPES } from '../lib/defaultTypes';
import { SwipeableCard } from '../components/SwipeableCard';

export function PlantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plantId = id ? Number(id) : undefined;
  const { plant, loading, removePlant, createActionPlan, logAction } = usePlant(plantId);
  const { rooms, actionTypes, loading: referenceLoading } = useReferenceData();
  const [planActionTypeId, setPlanActionTypeId] = useState<number | undefined>();
  const [planIntervalDays, setPlanIntervalDays] = useState(7);
  const [planNotes, setPlanNotes] = useState('');
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [manualActionTypeId, setManualActionTypeId] = useState<number | undefined>();
  const [manualLogModalOpen, setManualLogModalOpen] = useState(false);
  const photoUrl = useObjectUrl(plant?.photoBlob);

  useEffect(() => {
    if (!planModalOpen && !manualLogModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [planModalOpen, manualLogModalOpen]);

  if (loading || referenceLoading) {
    return (
      <Layout title="Plant">
        <p>Loading…</p>
      </Layout>
    );
  }

  if (!plant) {
    return (
      <Layout title="Plant">
        <section className="panel">
          <p>Plant not found.</p>
          <Link to="/">Back to dashboard</Link>
        </section>
      </Layout>
    );
  }

  const wateringPlan = plant.actionPlans?.find((plan) => plan.actionTypeId === DEFAULT_ACTION_TYPES[0].id);
  const room = plant.room ?? rooms.find((item) => item.id === plant.roomId);

  return (
    <Layout
      title="Plant"
      actions={
        <>
          <Link className="secondaryButton" to={`/plants/${plant.id}/edit`}>
            Edit
          </Link>
          <button
            className="dangerButton"
            type="button"
            onClick={async () => {
              await removePlant();
              navigate('/');
            }}
          >
            Delete
          </button>
        </>
      }
    >
      <section className="panel stack detailPage">
        <div className="detailHero">
          <div>
            <div className="detailTitleRow">
              <h2>{plant.name}</h2>
              {room ? (
                <Link className="inlineMeta inlineMetaLink" to={`/rooms/${room.id}`}>
                  {room.name}
                </Link>
              ) : (
                <span className="inlineMeta">Unassigned</span>
              )}
            </div>
            <p className="detailSubtitle">{plant.species}</p>
          </div>
        </div>

        <div className="detailPhoto">
          {photoUrl ? (
            <img src={photoUrl} alt={plant.name} />
          ) : (
            <div className="photoPlaceholder large">No photo yet</div>
          )}
        </div>

        <section>
          <div className="sectionHeading">
            <h3>Action plans</h3>
            <button className="secondaryButton" type="button" onClick={() => setPlanModalOpen(true)}>
              Add action plan
            </button>
          </div>
          <div className="scheduleList">
            {plant.actionPlans?.length ? (
              plant.actionPlans.map((plan) => {
                const actionType = actionTypes.find((item) => item.id === plan.actionTypeId);
                return (
                  <SwipeableCard key={plan.id} onDelete={() => console.log('delete')}>
                    <div key={plan.id} className="scheduleCard">
                      <div className="compactRow">
                        <strong>{actionType?.label ?? `Action ${plan.actionTypeId}`}</strong>
                        <span>Every {plan.intervalDays} days</span>
                      </div>
                      <span>Last done {plan.lastPerformedAt ? formatDate(plan.lastPerformedAt) : 'Not set'}</span>
                    </div>
                  </SwipeableCard>
                );
              })
            ) : (
              <p>No action plans yet.</p>
            )}
          </div>
          <button
            className="secondaryButton manualActionButton"
            type="button"
            onClick={() => {
              setManualActionTypeId(undefined);
              setManualLogModalOpen(true);
            }}
          >
            Log action
          </button>
        </section>

        <section>
          <h3>Recent actions</h3>
          <div className="scheduleList compactList">
            {plant.actions?.length ? (
              plant.actions.map((entry) => {
                const actionType = actionTypes.find((item) => item.id === entry.actionTypeId);
                return (
                  <div key={entry.id} className="scheduleCard">
                    <div className="compactRow">
                      <strong>{actionType?.label ?? `Action ${entry.actionTypeId}`}</strong>
                      <span>{formatDate(entry.performedAt)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No actions logged yet.</p>
            )}
          </div>
        </section>

        <section>
          <h3>Notes</h3>
          <p>{plant.notes || 'No notes yet.'}</p>
        </section>
      </section>

      {planModalOpen ? (
        <div className="modalBackdrop" role="presentation" onClick={() => setPlanModalOpen(false)}>
          <section
            className="modalCard panel stack"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-action-plan-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sectionHeading">
              <h3 id="add-action-plan-title">Add action plan</h3>
              <button className="secondaryButton" type="button" onClick={() => setPlanModalOpen(false)}>
                Close
              </button>
            </div>
            <div className="form compactForm">
              <label>
                Action
                <select
                  value={planActionTypeId ?? ''}
                  onChange={(event) => setPlanActionTypeId(event.target.value ? Number(event.target.value) : undefined)}
                >
                  <option value="" disabled>
                    Choose an action
                  </option>
                  {actionTypes.map((actionType) => (
                    <option key={actionType.id} value={actionType.id}>
                      {actionType.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Interval days
                <input
                  type="number"
                  min={1}
                  value={planIntervalDays}
                  onChange={(event) => setPlanIntervalDays(Number(event.target.value))}
                />
              </label>
              <label>
                Notes
                <textarea value={planNotes} onChange={(event) => setPlanNotes(event.target.value)} rows={3} />
              </label>
              <button
                className="primaryButton"
                type="button"
                disabled={planActionTypeId === undefined}
                onClick={async () => {
                  if (planActionTypeId === undefined) return;
                  await createActionPlan({
                    actionTypeId: planActionTypeId,
                    intervalDays: planIntervalDays,
                    active: true,
                    notes: planNotes,
                  });
                  setPlanNotes('');
                  setPlanModalOpen(false);
                }}
              >
                Save plan
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {manualLogModalOpen ? (
        <div
          className="modalBackdrop"
          role="presentation"
          onClick={() => {
            setManualLogModalOpen(false);
            setManualActionTypeId(undefined);
          }}
        >
          <section
            className="modalCard panel stack"
            role="dialog"
            aria-modal="true"
            aria-labelledby="log-action-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sectionHeading">
              <h3 id="log-action-title">Log action</h3>
              <button
                className="secondaryButton"
                type="button"
                onClick={() => {
                  setManualLogModalOpen(false);
                  setManualActionTypeId(undefined);
                }}
              >
                Close
              </button>
            </div>
            <div className="form compactForm">
              <label>
                Action
                <select
                  value={manualActionTypeId ?? ''}
                  onChange={(event) =>
                    setManualActionTypeId(event.target.value ? Number(event.target.value) : undefined)
                  }
                >
                  <option value="" disabled>
                    Choose an action
                  </option>
                  {actionTypes.map((actionType) => (
                    <option key={actionType.id} value={actionType.id}>
                      {actionType.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="primaryButton"
                type="button"
                disabled={manualActionTypeId === undefined}
                onClick={async () => {
                  if (manualActionTypeId === undefined) return;
                  await logAction({
                    actionTypeId: manualActionTypeId,
                    performedAt: new Date(),
                  });
                  setManualLogModalOpen(false);
                  setManualActionTypeId(undefined);
                }}
              >
                Save action
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </Layout>
  );
}
