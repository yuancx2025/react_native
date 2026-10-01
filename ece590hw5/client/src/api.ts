import type { WeatherData } from './types';

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY ?? '';

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
