import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ForecastDayData } from '../types';
import { fonts, useAppColors } from '../theme';
import { ForecastDay } from './ForecastDay';

interface ForecastProps {
  days: ForecastDayData[];
  useMetric: boolean;
  onSelectDay: (day: ForecastDayData) => void;
}

export function Forecast({ days, useMetric, onSelectDay }: ForecastProps) {
  const colors = useAppColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text, fontFamily: fonts.regular }]}>
        3 Day Forecast
      </Text>
      <View style={styles.list}>
        {days.map((day) => (
          <Pressable
            key={day.date}
            onPress={() => onSelectDay(day)}
            accessibilityRole="button"
          >
            <ForecastDay day={day} useMetric={useMetric} />
          </Pressable>
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
    fontSize: 22,
    textAlign: 'center',
  },
  list: {
    gap: 10,
  },
});
