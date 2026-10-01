import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchWeather, getWeatherApiKey } from '../src/api';
import { FavoriteList, PlaceLabel } from '../src/components/FavoriteList';
import { useFavorites } from '../src/context/FavoritesContext';
import { useWeather } from '../src/context/WeatherContext';
import { fonts, useAppColors } from '../src/theme';
import type { Favorite, SearchStatus, WeatherData } from '../src/types';

const US_ZIP = /^\d{5}$/;

export default function SearchScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const { favorites, ready, removeFavorite } = useFavorites();
  const { selectWeather } = useWeather();

  const [draftZip, setDraftZip] = useState('');
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const [searchResult, setSearchResult] = useState<WeatherData | undefined>(undefined);
  const [loadingFavoriteId, setLoadingFavoriteId] = useState<string | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      setDraftZip('');
      setSearchStatus('idle');
      setSearchResult(undefined);
      setLoadingFavoriteId(undefined);
    }, []),
  );

  useEffect(() => {
    const zip = draftZip.trim();
    if (!US_ZIP.test(zip)) {
      setSearchStatus('idle');
      setSearchResult(undefined);
      return;
    }

    if (!getWeatherApiKey()) {
      setSearchStatus('error');
      setSearchResult(undefined);
      return;
    }

    let cancelled = false;
    setSearchStatus('loading');
    setSearchResult(undefined);

    const load = async () => {
      try {
        const data = await fetchWeather(zip);
        if (!cancelled) {
          setSearchResult(data);
          setSearchStatus('found');
        }
      } catch {
        if (!cancelled) {
          setSearchResult(undefined);
          setSearchStatus('error');
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [draftZip]);

  const handleSelectResult = () => {
    if (!searchResult || !US_ZIP.test(draftZip.trim())) {
      return;
    }
    selectWeather(searchResult, draftZip.trim());
    router.back();
  };

  const handleSelectFavorite = async (favorite: Favorite) => {
    setLoadingFavoriteId(favorite.id);
    setSearchStatus('loading');
    try {
      const data = await fetchWeather(favorite.zip);
      selectWeather(data, favorite.zip);
      router.back();
    } catch {
      setSearchStatus('error');
      setSearchResult(undefined);
      setLoadingFavoriteId(undefined);
    }
  };

  const handleRemoveFavorite = (favorite: Favorite) => {
    removeFavorite(favorite.id).catch(() => {
      // Leave the row in place if storage cannot be updated.
    });
  };

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: colors.background }]}
      edges={['bottom', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.searchRow}>
          <View style={[styles.inputWrap, { backgroundColor: colors.surface }]}>
            <FontAwesome name="search" size={18} color={colors.muted} />
            <TextInput
              style={[styles.input, { color: colors.text, fontFamily: fonts.regular }]}
              value={draftZip}
              onChangeText={(value) => setDraftZip(value.replace(/[^\d]/g, '').slice(0, 5))}
              placeholder="Enter a Zip Code"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              maxLength={5}
              returnKeyType="search"
              autoFocus
            />
          </View>
          <Pressable onPress={() => router.back()} accessibilityRole="button">
            <Text style={[styles.link, { color: colors.navy, fontFamily: fonts.regular }]}>
              Cancel
            </Text>
          </Pressable>
        </View>

        <FavoriteList
          favorites={favorites}
          loadingId={loadingFavoriteId}
          onSelect={handleSelectFavorite}
          onRemove={handleRemoveFavorite}
          emptyText={ready ? 'No favorites yet.' : undefined}
          listHeader={
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.regular }]}>
                Search Results:
              </Text>
              <View style={styles.results}>
                {searchStatus === 'loading' && !loadingFavoriteId ? (
                  <ActivityIndicator size="large" color={colors.navy} style={styles.spinner} />
                ) : null}
                {searchStatus === 'error' ? (
                  <Text style={[styles.notFound, { color: colors.error, fontFamily: fonts.regular }]}>
                    Location not found.
                  </Text>
                ) : null}
                {searchStatus === 'found' && searchResult ? (
                  <Pressable onPress={handleSelectResult} accessibilityRole="button" style={styles.result}>
                    <PlaceLabel
                      name={searchResult.location.name}
                      region={searchResult.location.region}
                      zip={draftZip.trim()}
                    />
                  </Pressable>
                ) : null}
              </View>
              <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: fonts.regular }]}>
                Favorites:
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
  },
  link: {
    fontSize: 16,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  results: {
    minHeight: 48,
    marginBottom: 20,
  },
  spinner: {
    marginVertical: 16,
  },
  notFound: {
    fontSize: 16,
    marginVertical: 8,
  },
  result: {
    paddingVertical: 12,
  },
});
