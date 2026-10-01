import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CurrentConditions } from '../../../src/components/CurrentConditions';
import { FavoriteHeart } from '../../../src/components/FavoriteHeart';
import { Forecast } from '../../../src/components/Forecast';
import { SearchBar } from '../../../src/components/SearchBar';
import { UnitToggle } from '../../../src/components/UnitToggle';
import { useFavorites } from '../../../src/context/FavoritesContext';
import { useWeather } from '../../../src/context/WeatherContext';
import { fonts, useAppColors } from '../../../src/theme';

export default function WeatherScreen() {
  const colors = useAppColors();
  const router = useRouter();
  const { weather, selectedZip, useMetric, toggleUnits } = useWeather();
  const { addFavorite, isFavorite } = useFavorites();
  const saved = Boolean(selectedZip && isFavorite(selectedZip));

  const handleAddFavorite = () => {
    if (!weather || !selectedZip) {
      return;
    }
    addFavorite({
      zip: selectedZip,
      name: weather.location.name,
      region: weather.location.region,
    }).catch(() => {
      // Storage may be unavailable. The heart stays outlined until a save succeeds.
    });
  };

  return (
    <View style={[styles.page, { backgroundColor: colors.background }]}>
      <SearchBar label="Enter a Zip Code" onPress={() => router.push('/search')} />

      {weather && selectedZip ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <CurrentConditions weather={weather} useMetric={useMetric} />
          <Forecast
            days={weather.forecast.forecastday}
            useMetric={useMetric}
            onSelectDay={(day) =>
              router.push({ pathname: '/main/hourly', params: { date: day.date } })
            }
          />
          <View style={styles.actions}>
            <FavoriteHeart isFavorite={saved} onAddFavorite={handleAddFavorite} />
            <UnitToggle useMetric={useMetric} onToggle={toggleUnits} />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.text, fontFamily: fonts.regular }]}>
            Touch the search bar to enter a zip code
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  content: {
    paddingTop: 28,
    paddingBottom: 32,
    gap: 24,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
