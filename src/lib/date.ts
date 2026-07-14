export function daysUntilNextWatering(lastWateredAt: Date | string, waterEveryDays: number) {
  const last = new Date(lastWateredAt);
  const next = new Date(last);
  next.setDate(next.getDate() + waterEveryDays);
  const diffMs = next.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDaysPast(value: Date | string) {
  const date = new Date(value);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return 'today';
  }

  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

export function formatUpcomingSchedule(value: Date | string) {
  const date = new Date(value);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round((startOfDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return `Overdue ${overdueDays} day${overdueDays === 1 ? '' : 's'}`;
  }

  if (diffDays === 0) {
    return 'Due today';
  }

  return `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}
