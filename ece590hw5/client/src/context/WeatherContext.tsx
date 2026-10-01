import { createContext, useContext, useState, type ReactNode } from 'react';
import type { WeatherData } from '../types';

type WeatherContextValue = {
  weather?: WeatherData;
  selectedZip?: string;
  useMetric: boolean;
  toggleUnits: () => void;
  selectWeather: (weather: WeatherData, zip: string) => void;
};

const WeatherContext = createContext<WeatherContextValue | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | undefined>(undefined);
  const [selectedZip, setSelectedZip] = useState<string | undefined>(undefined);
  const [useMetric, setUseMetric] = useState(false);

  const selectWeather = (next: WeatherData, zip: string) => {
    setWeather(next);
    setSelectedZip(zip);
    setUseMetric(false);
  };

  const toggleUnits = () => setUseMetric((current) => !current);

  return (
    <WeatherContext.Provider
      value={{ weather, selectedZip, useMetric, toggleUnits, selectWeather }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather(): WeatherContextValue {
  const value = useContext(WeatherContext);
  if (!value) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return value;
}
