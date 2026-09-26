import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { addFavorite, deleteFavorite, fetchFavorites, fetchWeather, getWeatherApiKey } from './src/api';
import { MainScreen } from './src/components/MainScreen';
import { SearchModal } from './src/components/SearchModal';
import { colors } from './src/theme';
import type { Favorite, SearchStatus, WeatherData } from './src/types';

const US_ZIP = /^\d{5}$/;

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });

  const [weather, setWeather] = useState<WeatherData | undefined>(undefined);
  const [selectedZip, setSelectedZip] = useState<string | undefined>(undefined);
  const [useMetric, setUseMetric] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [draftZip, setDraftZip] = useState('');
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('idle');
  const [searchResult, setSearchResult] = useState<WeatherData | undefined>(undefined);
  const [loadingFavoriteId, setLoadingFavoriteId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const nextFavorites = await fetchFavorites();
        setFavorites(nextFavorites);
      } catch {
        setFavorites([]);
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    const zip = draftZip.trim();
    if (!modalVisible || !US_ZIP.test(zip)) {
      if (!US_ZIP.test(zip)) {
        setSearchStatus('idle');
        setSearchResult(undefined);
      }
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
  }, [draftZip, modalVisible]);

  const closeModal = () => {
    setModalVisible(false);
    setDraftZip('');
    setSearchStatus('idle');
    setSearchResult(undefined);
    setLoadingFavoriteId(undefined);
  };

  const handleSelectResult = () => {
    if (!searchResult || !US_ZIP.test(draftZip.trim())) {
      return;
    }
    setWeather(searchResult);
    setSelectedZip(draftZip.trim());
    setUseMetric(false);
    closeModal();
  };

  const handleSelectFavorite = async (favorite: Favorite) => {
    setLoadingFavoriteId(favorite.id);
    setSearchStatus('loading');
    try {
      const data = await fetchWeather(favorite.zip);
      setWeather(data);
      setSelectedZip(favorite.zip);
      setUseMetric(false);
      closeModal();
    } catch {
      setSearchStatus('error');
      setSearchResult(undefined);
      setLoadingFavoriteId(undefined);
    }
  };

  const handleAddFavorite = async () => {
    if (!weather || !selectedZip || !US_ZIP.test(selectedZip)) {
      return;
    }
    try {
      await addFavorite({
        zip: selectedZip,
        name: weather.location.name,
        region: weather.location.region,
      });
      setFavorites(await fetchFavorites());
    } catch {
      // Already a favorite or the server is unavailable.
    }
  };

  const handleRemoveFavorite = async (favorite: Favorite) => {
    try {
      await deleteFavorite(favorite.id);
      setFavorites(await fetchFavorites());
    } catch {
      // Favorite may already have been removed.
    }
  };

  const isFavorite = Boolean(selectedZip && favorites.some((item) => item.zip === selectedZip));

  if (!fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.navy} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <MainScreen
        weather={weather}
        selectedZip={selectedZip}
        isFavorite={isFavorite}
        useMetric={useMetric}
        onOpenSearch={() => setModalVisible(true)}
        onAddFavorite={handleAddFavorite}
        onToggleUnits={() => setUseMetric((current) => !current)}
      />
      <SearchModal
        visible={modalVisible}
        draftZip={draftZip}
        searchStatus={searchStatus}
        searchResult={searchResult}
        favorites={favorites}
        loadingFavoriteId={loadingFavoriteId}
        onChangeZip={(value) => setDraftZip(value.replace(/[^\d]/g, '').slice(0, 5))}
        onCancel={closeModal}
        onSelectResult={handleSelectResult}
        onSelectFavorite={handleSelectFavorite}
        onRemoveFavorite={handleRemoveFavorite}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
