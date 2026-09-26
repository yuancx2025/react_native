import { Platform } from 'react-native';
import type { Favorite, WeatherData } from './types';

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY ?? '';

const FAVORITES_BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

export function getWeatherApiKey(): string {
  return WEATHER_API_KEY;
}

export async function fetchWeather(zip: string): Promise<WeatherData> {
  const url =
    'https://api.weatherapi.com/v1/forecast.json?key=' +
    encodeURIComponent(WEATHER_API_KEY) +
    '&q=' +
    encodeURIComponent(zip) +
    '&days=3';

  const res = await fetch(url);
  const data = (await res.json()) as WeatherData;

  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? 'Could not load the forecast.');
  }

  return data;
}

export async function fetchFavorites(): Promise<Favorite[]> {
  const res = await fetch(`${FAVORITES_BASE}/favorites`);
  if (!res.ok) {
    throw new Error('Could not load favorites.');
  }
  return (await res.json()) as Favorite[];
}

export async function addFavorite(favorite: {
  zip: string;
  name: string;
  region: string;
}): Promise<Favorite> {
  const res = await fetch(`${FAVORITES_BASE}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favorite),
  });
  const data = (await res.json()) as Favorite & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? 'Could not add favorite.');
  }
  return data;
}

export async function deleteFavorite(id: string): Promise<void> {
  const res = await fetch(`${FAVORITES_BASE}/favorites/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const data = (await res.json()) as { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? 'Could not delete favorite.');
  }
}
