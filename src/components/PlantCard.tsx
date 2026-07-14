import { Link } from 'react-router-dom';
import { formatDaysPast, formatUpcomingSchedule } from '../lib/date';
import type { PlantViewModel } from '../types';
import { useObjectUrl } from '../hooks/useObjectUrl';

type PlantCardProps = {
  plant: PlantViewModel;
  showRoom?: boolean;
};

export function PlantCard({ plant, showRoom = true }: PlantCardProps) {
  const photoUrl = useObjectUrl(plant.photoBlob);
  const scheduleText = plant.nextWateringDueAt ? formatUpcomingSchedule(plant.nextWateringDueAt) : undefined;
  const wateredText = plant.lastWateredAt ? formatDaysPast(plant.lastWateredAt) : 'No watering logged';

  return (
    <Link to={`/plants/${plant.id}`} className="card">
      <div className="cardMedia">
        {photoUrl ? <img src={photoUrl} alt="" /> : <div className="photoPlaceholder">No photo</div>}
      </div>
      <div className="cardHeader">
        <div>
          <h2>{plant.name}</h2>
          <p>{plant.species}</p>
        </div>
        {scheduleText ? <span className={scheduleText.startsWith('Overdue') || scheduleText === 'Due today' ? 'pill warning' : 'pill'}>{scheduleText}</span> : null}
      </div>
      <dl className="meta">
        <div>
          <dt>Last watered</dt>
          <dd>{wateredText}</dd>
        </div>
        {showRoom ? (
          <div>
            <dt>Room</dt>
            <dd>{plant.roomName ?? `Room #${plant.roomId}`}</dd>
          </div>
        ) : null}
      </dl>
    </Link>
  );
}
