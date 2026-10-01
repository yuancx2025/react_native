import { Image, StyleSheet, Text, View } from 'react-native';
import { conditionIconUrl, formatDay, formatTemp } from '../format';
import { fonts, useAppColors } from '../theme';
import type { ForecastDayData } from '../types';

interface ForecastDayProps {
  day: ForecastDayData;
  useMetric: boolean;
}

export function ForecastDay({ day, useMetric }: ForecastDayProps) {
  const colors = useAppColors();
  const high = useMetric ? day.day.maxtemp_c : day.day.maxtemp_f;
  const low = useMetric ? day.day.mintemp_c : day.day.mintemp_f;

  return (
    <View style={[styles.row, { backgroundColor: colors.forecast }]}>
      <Text style={[styles.date, { color: colors.text, fontFamily: fonts.regular }]}>
        {formatDay(day.date)}
      </Text>
      <Image
        style={styles.icon}
        source={{ uri: conditionIconUrl(day.day.condition.icon) }}
        accessibilityLabel={day.day.condition.text}
      />
      <Text style={[styles.temp, { color: colors.text, fontFamily: fonts.regular }]}>
        H: {formatTemp(high, useMetric)}
      </Text>
      <Text style={[styles.temp, { color: colors.text, fontFamily: fonts.regular }]}>
        L: {formatTemp(low, useMetric)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  date: {
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
});
