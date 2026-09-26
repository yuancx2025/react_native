import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';

interface UnitToggleProps {
  useMetric: boolean;
  onToggle: () => void;
}

export function UnitToggle({ useMetric, onToggle }: UnitToggleProps) {
  return (
    <Pressable onPress={onToggle} style={styles.action} accessibilityRole="button">
      <Text style={styles.text}>{useMetric ? 'Switch to Imperial' : 'Switch to Metric'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    minHeight: 44,
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.navy,
  },
});
