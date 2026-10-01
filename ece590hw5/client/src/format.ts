import type { ForecastDayData, HourData } from './types';

export function formatTemp(value: number, useMetric: boolean): string {
  const rounded = Math.round(value * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text} ${useMetric ? 'C' : 'F'}`;
}

export function formatDay(dateStr: string): string {
  const parts = dateStr.split('-');
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatClock(value: string): string {
  return value.replace(/^0/, '').replace(' ', '');
}

export function formatWindSpeed(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function conditionIconUrl(icon: string): string {
  if (icon.startsWith('http')) {
    return icon;
  }
  return `https:${icon}`;
}

export function formatHour(time: string): string {
  const hour = Number(time.slice(11, 13));
  if (Number.isNaN(hour)) {
    return time;
  }
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12} ${suffix}`;
}

export function visibleHours(day: ForecastDayData, localtime?: string): HourData[] {
  const hours = day.hour ?? [];
  if (!localtime) {
    return hours;
  }

  const [localDate, localClock = ''] = localtime.split(' ');
  if (day.date !== localDate) {
    return hours;
  }

  const currentHour = Number(localClock.slice(0, 2));
  if (Number.isNaN(currentHour)) {
    return hours;
  }

  return hours.filter((hour) => {
    const hourNum = Number(hour.time.slice(11, 13));
    return hourNum >= currentHour && hourNum <= 23;
  });
}
