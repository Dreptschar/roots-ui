import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDaysPast, formatUpcomingSchedule, isSameLocalDay } from '../lib/date';
import type { LogActionResult, PlantViewModel } from '../types';
import { useImageSource } from '../hooks/useImageSource';
import { WATERING_EMOJI } from '../lib/defaultTypes';

type PlantCardProps = {
  plant: PlantViewModel;
  showRoom?: boolean;
  onWater: (plantId: number) => Promise<LogActionResult>;
};

export function PlantCard({ plant, showRoom = true, onWater }: PlantCardProps) {
  const photoUrl = useImageSource(plant.photoBlob);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [waterStatus, setWaterStatus] = useState<'idle' | 'saving' | 'watered' | 'error'>('idle');
  const scheduleText = plant.nextWateringDueAt ? formatUpcomingSchedule(plant.nextWateringDueAt) : undefined;
  const wateredText = plant.lastWateredAt ? formatDaysPast(plant.lastWateredAt) : 'No watering logged';
  const wateredToday = plant.lastWateredAt ? isSameLocalDay(plant.lastWateredAt) : false;
  const waterButtonLabel =
    waterStatus === 'saving'
      ? `Watering ${plant.name}`
      : waterStatus === 'error'
        ? `Retry watering ${plant.name}`
        : waterStatus === 'watered' || wateredToday
          ? `${plant.name} watered today`
          : `Water ${plant.name}`;

  useEffect(
    () => () => {
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
      }
    },
    [],
  );

  async function handleWater() {
    setWaterStatus('saving');
    try {
      await onWater(plant.id);
      setWaterStatus('watered');
      feedbackTimeout.current = setTimeout(() => setWaterStatus('idle'), 2000);
    } catch {
      setWaterStatus('error');
    }
  }

  return (
    <article className="card plantCard">
      <Link to={`/plants/${plant.id}`} className="plantCardLink">
        <div className="cardMedia">
          {photoUrl ? <img src={photoUrl} alt="" /> : <div className="photoPlaceholder">No photo</div>}
        </div>
        <div className="cardHeader">
          <div>
            <div className="plantCardTitleRow">
              <h2>{plant.name}</h2>
              {showRoom ? <span className="inlineMeta">{plant.roomName ?? `Room #${plant.roomId}`}</span> : null}
            </div>
            <p>{plant.species}</p>
          </div>
          {scheduleText ? (
            <span
              className={scheduleText.startsWith('Overdue') || scheduleText === 'Due today' ? 'pill warning' : 'pill'}
            >
              {scheduleText}
            </span>
          ) : null}
        </div>
      </Link>
      <div className="plantCardFooter">
        <dl className="meta">
          <div>
            <dt>Last watered</dt>
            <dd>{wateredText}</dd>
          </div>
        </dl>
        <button
          className={`waterButton${waterStatus === 'watered' || wateredToday ? ' watered' : ''}`}
          type="button"
          disabled={waterStatus === 'saving' || wateredToday}
          aria-label={waterButtonLabel}
          onClick={() => void handleWater()}
        >
          <span className="waterButtonEmoji" aria-hidden="true">
            {WATERING_EMOJI}
          </span>
        </button>
      </div>
      <span className="srOnly" aria-live="polite">
        {waterStatus === 'watered'
          ? `${plant.name} watered`
          : waterStatus === 'error'
            ? `Could not water ${plant.name}`
            : ''}
      </span>
    </article>
  );
}
