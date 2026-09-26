import { StyleSheet, Text, View } from 'react-native';
import { formatClock, formatTemp, formatWindSpeed } from '../format';
import { colors, fonts } from '../theme';
import type { WeatherData } from '../types';

interface CurrentConditionsProps {
  weather: WeatherData;
  useMetric: boolean;
}

export function CurrentConditions({ weather, useMetric }: CurrentConditionsProps) {
  const today = weather.forecast.forecastday[0];
  const temp = formatTemp(useMetric ? weather.current.temp_c : weather.current.temp_f, useMetric);
  const feelsLike = formatTemp(
    useMetric ? weather.current.feelslike_c : weather.current.feelslike_f,
    useMetric,
  );
  const windSpeed = formatWindSpeed(useMetric ? weather.current.wind_kph : weather.current.wind_mph);
  const unit = useMetric ? 'KPH' : 'MPH';

  return (
    <View style={styles.container}>
      <Text style={styles.temp}>{temp}</Text>
      <Text style={styles.feelsLike}>Feels like {feelsLike}</Text>
      <Text style={styles.place}>{weather.location.name}</Text>
      <Text style={styles.place}>{weather.location.region}</Text>

      <View style={styles.bar}>
        <Text style={styles.barText}>
          Sunrise: {today ? formatClock(today.astro.sunrise) : ''}
        </Text>
        <Text style={styles.barText}>Sunset: {today ? formatClock(today.astro.sunset) : ''}</Text>
      </View>
      <View style={styles.bar}>
        <Text style={styles.barText}>
          Wind: {weather.current.wind_dir} {windSpeed} {unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },
  temp: {
    fontFamily: fonts.regular,
    fontSize: 64,
    lineHeight: 72,
    color: colors.text,
  },
  feelsLike: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.text,
  },
  place: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },
  bar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.forecast,
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  barText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
});
