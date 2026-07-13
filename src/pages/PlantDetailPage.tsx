import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { formatDate } from '../lib/date';
import { usePlant } from '../hooks/usePlant';
import { useReferenceData } from '../hooks/useReferenceData';

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

  const roomName = useMemo(
    () => rooms.find((room) => room.id === plant?.roomId)?.name ?? plant?.room?.name ?? 'Unassigned',
    [rooms, plant]
  );

  const actionTypeOptions = actionTypes;
  const wateringActionTypeId = actionTypes.find((actionType) => actionType.key === 'watering')?.id;

  useEffect(() => {
    if (!planModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [planModalOpen]);

  if (loading || referenceLoading) {
    return (
      <Layout title="Plant detail">
        <p>Loading…</p>
      </Layout>
    );
  }

  if (!plant) {
    return (
      <Layout title="Plant detail">
        <section className="panel">
          <p>Plant not found.</p>
          <Link to="/">Back to dashboard</Link>
        </section>
      </Layout>
    );
  }

  const wateringPlan = plant.actionPlans?.find((plan) => plan.actionTypeId === wateringActionTypeId);

  return (
    <Layout title={plant.name} subtitle={plant.species}>
      <section className="panel stack">
        <div className="detailHero">
          <div>
            <h2>{plant.name}</h2>
            <p>{roomName}</p>
          </div>
          <div className="detailStats">
            <div>
              <strong>{formatDate(plant.updatedAt)}</strong>
              <span>updated</span>
            </div>
            <div>
              <strong>{plant.notes ? 'Notes set' : 'No notes'}</strong>
              <span>plant notes</span>
            </div>
          </div>
        </div>

        <div className="buttonRow">
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
        </div>

        <section>
          <h3>Room</h3>
          <p>{roomName}</p>
        </section>

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
                  <div key={plan.id} className="scheduleCard">
                    <div className="compactRow">
                      <strong>{actionType?.label ?? `Action ${plan.actionTypeId}`}</strong>
                      <span>Every {plan.intervalDays} days</span>
                    </div>
                    <span>Last done {plan.lastPerformedAt ? formatDate(plan.lastPerformedAt) : 'Not set'}</span>
                    <div className="buttonRow compactButtons">
                      <button
                        className="secondaryButton"
                        type="button"
                        onClick={async () => {
                          await logAction({
                            actionTypeId: plan.actionTypeId,
                            actionPlanId: plan.id,
                            performedAt: new Date(),
                            notes: 'Logged from schedule'
                          });
                        }}
                      >
                        Log now
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No action plans yet.</p>
            )}
          </div>
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
                    <div className="compactRow">
                      <p>{entry.notes || 'No notes.'}</p>
                      <button
                        className="secondaryButton"
                        type="button"
                        onClick={async () => {
                          await logAction({
                            actionTypeId: entry.actionTypeId,
                            actionPlanId: entry.actionPlanId,
                            performedAt: new Date(),
                            notes: entry.notes ?? ''
                          });
                        }}
                      >
                        Repeat
                      </button>
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
        <div
          className="modalBackdrop"
          role="presentation"
          onClick={() => setPlanModalOpen(false)}
        >
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
                Action type
                <select
                  value={planActionTypeId ?? ''}
                  onChange={(event) => setPlanActionTypeId(event.target.value ? Number(event.target.value) : undefined)}
                >
                  <option value="" disabled>
                    Choose an action type
                  </option>
                  {actionTypeOptions.map((actionType) => (
                    <option key={actionType.id} value={actionType.id}>
                      {actionType.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Interval days
                <input type="number" min={1} value={planIntervalDays} onChange={(event) => setPlanIntervalDays(Number(event.target.value))} />
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
                    lastPerformedAt: wateringPlan?.lastPerformedAt,
                    active: true,
                    notes: planNotes
                  });
                  setPlanNotes('');
                  setPlanModalOpen(false);
                }}
              >
                Save action plan
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </Layout>
  );
}
