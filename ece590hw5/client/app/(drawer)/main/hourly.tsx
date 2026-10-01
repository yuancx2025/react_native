import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { conditionIconUrl, formatDay, formatHour, formatTemp, visibleHours } from '../../../src/format';
import { useWeather } from '../../../src/context/WeatherContext';
import { fonts, useAppColors } from '../../../src/theme';

export default function HourlyScreen() {
  const colors = useAppColors();
  const { weather, useMetric } = useWeather();
  const params = useLocalSearchParams<{ date?: string | string[] }>();
  const date = Array.isArray(params.date) ? params.date[0] : params.date;
  const day = weather?.forecast.forecastday.find((item) => item.date === date);
  const hours = day ? visibleHours(day, weather?.location.localtime) : [];

  if (!day) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.text, fontFamily: fonts.regular }]}>
          Search for a location to see the hourly forecast.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.date, { color: colors.text, fontFamily: fonts.bold }]}>
        {formatDay(day.date)}
      </Text>
      {hours.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.muted, fontFamily: fonts.regular }]}>
          No hours to show.
        </Text>
      ) : (
        hours.map((hour) => {
          const temp = formatTemp(useMetric ? hour.temp_c : hour.temp_f, useMetric);
          return (
            <View key={hour.time} style={[styles.row, { backgroundColor: colors.forecast }]}>
              <Text style={[styles.time, { color: colors.text, fontFamily: fonts.regular }]}>
                {formatHour(hour.time)}
              </Text>
              <Image
                style={styles.icon}
                source={{ uri: conditionIconUrl(hour.condition.icon) }}
                accessibilityLabel={hour.condition.text}
              />
              <Text style={[styles.temp, { color: colors.text, fontFamily: fonts.regular }]}>
                {temp}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 10,
  },
  date: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  time: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    width: 48,
    height: 48,
  },
  temp: {
    fontSize: 16,
    minWidth: 72,
    textAlign: 'right',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
