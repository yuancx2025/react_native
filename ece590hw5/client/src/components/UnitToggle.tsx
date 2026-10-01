import { Pressable, StyleSheet, Text } from 'react-native';
import { fonts, useAppColors } from '../theme';

interface UnitToggleProps {
  useMetric: boolean;
  onToggle: () => void;
}

export function UnitToggle({ useMetric, onToggle }: UnitToggleProps) {
  const colors = useAppColors();

  return (
    <Pressable onPress={onToggle} style={styles.action} accessibilityRole="button">
      <Text style={[styles.text, { color: colors.navy, fontFamily: fonts.regular }]}>
        {useMetric ? 'Switch to Imperial' : 'Switch to Metric'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    minHeight: 44,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});
