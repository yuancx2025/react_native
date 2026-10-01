import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Favorite } from '../types';

const STORAGE_KEY = 'favorites';

type FavoritesContextValue = {
  favorites: Favorite[];
  ready: boolean;
  addFavorite: (input: { zip: string; name: string; region: string }) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (zip: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

function isFavoriteList(value: unknown): value is Favorite[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.zip === 'string' &&
        typeof item.name === 'string' &&
        typeof item.region === 'string',
    )
  );
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [ready, setReady] = useState(false);
  const favoritesRef = useRef<Favorite[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) {
          return;
        }
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (isFavoriteList(parsed)) {
            favoritesRef.current = parsed;
            setFavorites(parsed);
          }
        }
      } catch {
        if (!cancelled) {
          favoritesRef.current = [];
          setFavorites([]);
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = async (next: Favorite[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    favoritesRef.current = next;
    setFavorites(next);
  };

  const addFavorite = async (input: { zip: string; name: string; region: string }) => {
    if (favoritesRef.current.some((item) => item.zip === input.zip)) {
      return;
    }
    const next = [
      ...favoritesRef.current,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        zip: input.zip,
        name: input.name,
        region: input.region,
      },
    ];
    await persist(next);
  };

  const removeFavorite = async (id: string) => {
    await persist(favoritesRef.current.filter((item) => item.id !== id));
  };

  const isFavorite = (zip: string) => favorites.some((item) => item.zip === zip);

  return (
    <FavoritesContext.Provider value={{ favorites, ready, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return value;
}
