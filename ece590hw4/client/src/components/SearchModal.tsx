import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import type { Favorite, SearchStatus, WeatherData } from '../types';

interface SearchModalProps {
  visible: boolean;
  draftZip: string;
  searchStatus: SearchStatus;
  searchResult?: WeatherData;
  favorites: Favorite[];
  loadingFavoriteId?: string;
  onChangeZip: (zip: string) => void;
  onCancel: () => void;
  onSelectResult: () => void;
  onSelectFavorite: (favorite: Favorite) => void;
  onRemoveFavorite: (favorite: Favorite) => void;
}

export function SearchModal({
  visible,
  draftZip,
  searchStatus,
  searchResult,
  favorites,
  loadingFavoriteId,
  onChangeZip,
  onCancel,
  onSelectResult,
  onSelectFavorite,
  onRemoveFavorite,
}: SearchModalProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      const id = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(id);
    }
  }, [visible]);

  const renderFavorite = ({ item }: { item: Favorite }) => {
    const isLoading = loadingFavoriteId === item.id;

    return (
      <View style={styles.row}>
        <Pressable
          style={styles.rowPress}
          onPress={() => onSelectFavorite(item)}
          disabled={Boolean(loadingFavoriteId)}
          accessibilityRole="button"
        >
          {isLoading ? (
            <ActivityIndicator color={colors.navy} />
          ) : (
            <PlaceLabel name={item.name} region={item.region} zip={item.zip} />
          )}
        </Pressable>
        <Pressable
          onPress={() => onRemoveFavorite(item)}
          disabled={isLoading}
          accessibilityRole="button"
        >
          <Text style={styles.link}>Remove</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.searchRow}>
            <View style={styles.inputWrap}>
              <FontAwesome name="search" size={18} color={colors.muted} />
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={draftZip}
                onChangeText={onChangeZip}
                placeholder="Enter a Zip Code"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                maxLength={5}
                returnKeyType="search"
              />
            </View>
            <Pressable onPress={onCancel} accessibilityRole="button">
              <Text style={styles.link}>Cancel</Text>
            </Pressable>
          </View>

          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={renderFavorite}
            ItemSeparatorComponent={Divider}
            style={styles.flex}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View>
                <Text style={styles.sectionTitle}>Search Results:</Text>
                <View style={styles.results}>
                  {searchStatus === 'loading' && !loadingFavoriteId ? (
                    <ActivityIndicator size="large" color={colors.navy} style={styles.spinner} />
                  ) : null}

                  {searchStatus === 'error' ? (
                    <Text style={styles.notFound}>Location not found.</Text>
                  ) : null}

                  {searchStatus === 'found' && searchResult ? (
                    <Pressable
                      style={styles.row}
                      onPress={onSelectResult}
                      accessibilityRole="button"
                    >
                      <PlaceLabel
                        name={searchResult.location.name}
                        region={searchResult.location.region}
                        zip={draftZip.trim()}
                      />
                    </Pressable>
                  ) : null}
                </View>

                <Text style={styles.sectionTitle}>Favorites:</Text>
                {favorites.length === 0 ? (
                  <Text style={styles.emptyFavorites}>No favorites yet.</Text>
                ) : null}
              </View>
            }
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

function PlaceLabel({ name, region, zip }: { name: string; region: string; zip: string }) {
  return (
    <Text style={styles.place}>
      <Text style={styles.city}>{name}</Text>
      <Text>
        {' '}
        {region} ({zip})
      </Text>
    </Text>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 6,
  },
  link: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.navy,
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.text,
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
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.error,
    marginVertical: 8,
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
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.text,
  },
  city: {
    fontFamily: fonts.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  emptyFavorites: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.muted,
    marginBottom: 8,
  },
});
