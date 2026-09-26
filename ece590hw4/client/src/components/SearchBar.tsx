import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

interface SearchBarProps {
  label: string;
  onPress: () => void;
}

export function SearchBar({ label, onPress }: SearchBarProps) {
  return (
    <Pressable onPress={onPress} style={styles.bar} accessibilityRole="button">
      <FontAwesome name="search" size={18} color={colors.muted} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  label: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.muted,
  },
});
