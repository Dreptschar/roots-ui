import { Link } from 'react-router-dom';
import { daysUntilNextWatering, formatDate } from '../lib/date';
import type { PlantViewModel } from '../types';

type PlantCardProps = {
  plant: PlantViewModel;
};

export function PlantCard({ plant }: PlantCardProps) {
  const daysLeft =
    plant.lastWateredAt && plant.wateringIntervalDays
      ? daysUntilNextWatering(plant.lastWateredAt, plant.wateringIntervalDays)
      : undefined;
  const wateredText = plant.lastWateredAt ? formatDate(plant.lastWateredAt) : 'No watering logged';

  return (
    <Link to={`/plants/${plant.id}`} className="card">
      <div className="cardHeader">
        <div>
          <h2>{plant.name}</h2>
          <p>{plant.species}</p>
        </div>
        {daysLeft === undefined ? null : (
          <span className={daysLeft <= 1 ? 'pill warning' : 'pill'}>{daysLeft <= 0 ? 'Due now' : `${daysLeft}d`}</span>
        )}
      </div>
      <dl className="meta">
        <div>
          <dt>Last watered</dt>
          <dd>{wateredText}</dd>
        </div>
        <div>
          <dt>Room</dt>
          <dd>{plant.roomName ?? `Room #${plant.roomId}`}</dd>
        </div>
      </dl>
    </Link>
  );
}
