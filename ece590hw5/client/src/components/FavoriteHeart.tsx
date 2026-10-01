import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { fonts, useAppColors } from '../theme';

interface FavoriteHeartProps {
  isFavorite: boolean;
  onAddFavorite: () => void;
}

export function FavoriteHeart({ isFavorite, onAddFavorite }: FavoriteHeartProps) {
  const colors = useAppColors();

  if (isFavorite) {
    return (
      <View style={styles.saved}>
        <FontAwesome name="heart" size={22} color={colors.heart} />
      </View>
    );
  }

  return (
    <Pressable onPress={onAddFavorite} style={styles.action} accessibilityRole="button">
      <FontAwesome name="heart-o" size={18} color={colors.navy} />
      <Text style={[styles.actionText, { color: colors.navy, fontFamily: fonts.regular }]}>
        Add Favorite
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  saved: {
    minHeight: 44,
    justifyContent: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
  },
  actionText: {
    fontSize: 16,
  },
});
