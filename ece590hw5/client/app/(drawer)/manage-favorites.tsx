import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchWeather } from '../../src/api';
import { FavoriteList } from '../../src/components/FavoriteList';
import { useFavorites } from '../../src/context/FavoritesContext';
import { useWeather } from '../../src/context/WeatherContext';
import { fonts, useAppColors } from '../../src/theme';
import type { Favorite } from '../../src/types';

export default function ManageFavoritesScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const { favorites, ready, removeFavorite } = useFavorites();
  const { selectWeather } = useWeather();
  const [loadingId, setLoadingId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSelect = async (favorite: Favorite) => {
    setError(undefined);
    setLoadingId(favorite.id);
    try {
      const data = await fetchWeather(favorite.zip);
      selectWeather(data, favorite.zip);
      router.navigate('/main');
    } catch {
      setError('Location not found.');
    } finally {
      setLoadingId(undefined);
    }
  };

  const handleRemove = (favorite: Favorite) => {
    removeFavorite(favorite.id).catch(() => {
      // Leave the row in place if storage cannot be updated.
    });
  };

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      {error ? (
        <Text style={[styles.error, { color: colors.error, fontFamily: fonts.regular }]}>{error}</Text>
      ) : null}
      <FavoriteList
        favorites={favorites}
        loadingId={loadingId}
        onSelect={handleSelect}
        onRemove={handleRemove}
        emptyText={ready ? 'No favorites yet.' : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 8,
  },
  error: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
