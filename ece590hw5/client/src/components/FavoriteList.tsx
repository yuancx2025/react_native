import type { ReactElement } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, useAppColors } from '../theme';
import type { Favorite } from '../types';

interface FavoriteListProps {
  favorites: Favorite[];
  loadingId?: string;
  onSelect: (favorite: Favorite) => void;
  onRemove: (favorite: Favorite) => void;
  listHeader?: ReactElement;
  emptyText?: string;
}

export function PlaceLabel({ name, region, zip }: { name: string; region: string; zip: string }) {
  const colors = useAppColors();

  return (
    <Text style={[styles.place, { color: colors.text, fontFamily: fonts.regular }]}>
      <Text style={{ fontFamily: fonts.bold }}>{name}</Text>
      <Text>{` ${region} (${zip})`}</Text>
    </Text>
  );
}

export function FavoriteList({
  favorites,
  loadingId,
  onSelect,
  onRemove,
  listHeader,
  emptyText,
}: FavoriteListProps) {
  const colors = useAppColors();

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      style={styles.flex}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      ItemSeparatorComponent={() => (
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      )}
      ListHeaderComponent={
        <View>
          {listHeader}
          {favorites.length === 0 && emptyText ? (
            <Text style={[styles.empty, { color: colors.muted, fontFamily: fonts.regular }]}>
              {emptyText}
            </Text>
          ) : null}
        </View>
      }
      renderItem={({ item }) => {
        const isLoading = loadingId === item.id;

        return (
          <View style={styles.row}>
            <Pressable
              style={styles.rowPress}
              onPress={() => onSelect(item)}
              disabled={Boolean(loadingId)}
              accessibilityRole="button"
            >
              {isLoading ? (
                <ActivityIndicator color={colors.navy} />
              ) : (
                <PlaceLabel name={item.name} region={item.region} zip={item.zip} />
              )}
            </Pressable>
            <Pressable
              onPress={() => onRemove(item)}
              disabled={isLoading}
              accessibilityRole="button"
            >
              <Text style={[styles.link, { color: colors.navy, fontFamily: fonts.regular }]}>
                Remove
              </Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  rowPress: {
    flex: 1,
    minHeight: 28,
    justifyContent: 'center',
  },
  place: {
    fontSize: 16,
  },
  link: {
    fontSize: 16,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  divider: {
    height: 1,
  },
  empty: {
    fontSize: 16,
    marginBottom: 8,
  },
});
