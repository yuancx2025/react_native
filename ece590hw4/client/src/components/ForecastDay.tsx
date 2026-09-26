import { Image, StyleSheet, Text, View } from 'react-native';
import { conditionIconUrl, formatDay, formatTemp } from '../format';
import { colors, fonts } from '../theme';
import type { ForecastDayData } from '../types';

interface ForecastDayProps {
  day: ForecastDayData;
  useMetric: boolean;
}

export function ForecastDay({ day, useMetric }: ForecastDayProps) {
  const high = useMetric ? day.day.maxtemp_c : day.day.maxtemp_f;
  const low = useMetric ? day.day.mintemp_c : day.day.mintemp_f;

  return (
    <View style={styles.row}>
      <Text style={styles.date}>{formatDay(day.date)}</Text>
      <Image
        style={styles.icon}
        source={{ uri: conditionIconUrl(day.day.condition.icon) }}
        accessibilityLabel={day.day.condition.text}
      />
      <Text style={styles.temp}>H: {formatTemp(high, useMetric)}</Text>
      <Text style={styles.temp}>L: {formatTemp(low, useMetric)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.forecast,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  date: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  icon: {
    width: 48,
    height: 48,
  },
  temp: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    minWidth: 72,
    textAlign: 'right',
  },
});
