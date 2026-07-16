import { type FormEvent, useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { createActionType, deleteActionType } from '../lib/localDb';
import { useReferenceData } from '../hooks/useReferenceData';
import { SwipeableCard } from '../components/SwipeableCard';
import { DEFAULT_ACTION_TYPES } from '../lib/defaultTypes';

export function SettingsPage() {
  const { actionTypes, loading, refresh } = useReferenceData();
  const [actionTypeLabel, setActionTypeLabel] = useState('');
  const [actionTypeModalOpen, setActionTypeModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!actionTypeModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [actionTypeModalOpen]);

  async function handleCreateActionType(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await createActionType({ label: actionTypeLabel });
      setActionTypeLabel('');
      setActionTypeModalOpen(false);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteActionType(id: number) {
    setSaving(true);
    try {
      await deleteActionType(id);
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout title="Settings">
      <section className="panel stack">
        <div className="panelHeader">
          <h2>Actions</h2>
          <button className="primaryButton" type="button" onClick={() => setActionTypeModalOpen(true)}>
            Add action
          </button>
        </div>
        <div className="scheduleList">
          {actionTypes.map((actionType) => {
            const card = (
              <div className="scheduleCard">
                <strong>{actionType.label}</strong>
              </div>
            );

            if (actionType.id === DEFAULT_ACTION_TYPES[0].id) {
              return <div key={actionType.id}>{card}</div>;
            }

            return (
              <SwipeableCard key={actionType.id} onDelete={() => handleDeleteActionType(actionType.id)}>
                {card}
              </SwipeableCard>
            );
          })}
        </div>
      </section>

      {actionTypeModalOpen ? (
        <div className="modalBackdrop" role="presentation" onClick={() => setActionTypeModalOpen(false)}>
          <section
            className="modalCard panel stack"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-action-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sectionHeading">
              <h3 id="add-action-title">Add action</h3>
              <button className="secondaryButton" type="button" onClick={() => setActionTypeModalOpen(false)}>
                Close
              </button>
            </div>
            <form className="form compactForm" onSubmit={handleCreateActionType}>
              <label>
                Name
                <input
                  value={actionTypeLabel}
                  onChange={(event) => setActionTypeLabel(event.target.value)}
                  required
                  autoFocus
                />
              </label>
              <button className="primaryButton" type="submit" disabled={saving || !actionTypeLabel.trim()}>
                {saving ? 'Saving…' : 'Add action'}
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </Layout>
  );
}
