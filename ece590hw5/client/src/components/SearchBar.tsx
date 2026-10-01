import { Pressable, StyleSheet, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { fonts, useAppColors } from '../theme';

interface SearchBarProps {
  label: string;
  onPress: () => void;
}

export function SearchBar({ label, onPress }: SearchBarProps) {
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.bar, { backgroundColor: colors.surface }]}
      accessibilityRole="button"
    >
      <FontAwesome name="search" size={18} color={colors.muted} />
      <Text style={[styles.label, { color: colors.muted, fontFamily: fonts.regular }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
});
