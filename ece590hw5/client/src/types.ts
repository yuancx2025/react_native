export type Favorite = {
  id: string;
  zip: string;
  name: string;
  region: string;
};

export type WeatherCondition = {
  text: string;
  icon: string;
};

export type HourData = {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: WeatherCondition;
};

export type ForecastDayData = {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    condition: WeatherCondition;
  };
  astro: {
    sunrise: string;
    sunset: string;
  };
  hour: HourData[];
};

export type WeatherData = {
  location: {
    name: string;
    region: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    feelslike_c: number;
    feelslike_f: number;
    wind_mph: number;
    wind_kph: number;
    wind_dir: string;
    condition: WeatherCondition;
  };
  forecast: {
    forecastday: ForecastDayData[];
  };
  error?: {
    message: string;
  };
};

export type SearchStatus = 'idle' | 'loading' | 'error' | 'found';
