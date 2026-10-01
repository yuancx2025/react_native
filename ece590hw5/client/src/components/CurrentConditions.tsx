import { StyleSheet, Text, View } from 'react-native';
import { formatClock, formatTemp, formatWindSpeed } from '../format';
import { fonts, useAppColors } from '../theme';
import type { WeatherData } from '../types';

interface CurrentConditionsProps {
  weather: WeatherData;
  useMetric: boolean;
}

export function CurrentConditions({ weather, useMetric }: CurrentConditionsProps) {
  const colors = useAppColors();
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
      <Text style={[styles.temp, { color: colors.text, fontFamily: fonts.regular }]}>{temp}</Text>
      <Text style={[styles.feelsLike, { color: colors.text, fontFamily: fonts.regular }]}>
        Feels like {feelsLike}
      </Text>
      <Text style={[styles.place, { color: colors.text, fontFamily: fonts.regular }]}>
        {weather.location.name}
      </Text>
      <Text style={[styles.place, { color: colors.text, fontFamily: fonts.regular }]}>
        {weather.location.region}
      </Text>

      <View style={[styles.bar, { backgroundColor: colors.forecast }]}>
        <Text style={[styles.barText, { color: colors.text, fontFamily: fonts.regular }]}>
          Sunrise: {today ? formatClock(today.astro.sunrise) : ''}
        </Text>
        <Text style={[styles.barText, { color: colors.text, fontFamily: fonts.regular }]}>
          Sunset: {today ? formatClock(today.astro.sunset) : ''}
        </Text>
      </View>
      <View style={[styles.bar, { backgroundColor: colors.forecast }]}>
        <Text style={[styles.barText, { color: colors.text, fontFamily: fonts.regular }]}>
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
    fontSize: 64,
    lineHeight: 72,
  },
  feelsLike: {
    fontSize: 18,
  },
  place: {
    fontSize: 20,
    textAlign: 'center',
  },
  bar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  barText: {
    fontSize: 16,
  },
});
