export function daysUntilNextWatering(lastWateredAt: Date | string, waterEveryDays: number) {
  const last = new Date(lastWateredAt);
  const next = new Date(last);
  next.setDate(next.getDate() + waterEveryDays);
  const diffMs = next.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}
