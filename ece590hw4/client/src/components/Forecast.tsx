import { StyleSheet, Text, View } from 'react-native';
import type { ForecastDayData } from '../types';
import { colors, fonts } from '../theme';
import { ForecastDay } from './ForecastDay';

interface ForecastProps {
  days: ForecastDayData[];
  useMetric: boolean;
}

export function Forecast({ days, useMetric }: ForecastProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>3 Day Forecast</Text>
      <View style={styles.list}>
        {days.map((day) => (
          <ForecastDay key={day.date} day={day} useMetric={useMetric} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.text,
    textAlign: 'center',
  },
  list: {
    gap: 10,
  },
});
