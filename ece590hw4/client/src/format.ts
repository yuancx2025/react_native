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
