import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

export const lightColors = {
  background: '#ffffff',
  surface: '#f2f2f2',
  text: '#000000',
  muted: '#737373',
  navy: '#024878',
  forecast: '#a9cee7',
  error: '#a00',
  heart: '#c0392b',
  divider: '#d0d0d0',
};

export const darkColors = {
  background: '#121212',
  surface: '#2a2a2a',
  text: '#f5f5f5',
  muted: '#b0b0b0',
  navy: '#8ec5ef',
  forecast: '#1e4d73',
  error: '#ff8a80',
  heart: '#ff6b6b',
  divider: '#3a3a3a',
};

export type AppColors = typeof lightColors;

export const fonts = {
  regular: 'Inter_400Regular',
  bold: 'Inter_700Bold',
};

export function useAppColors(): AppColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}

export function getTheme(dark: boolean): Theme {
  const palette = dark ? darkColors : lightColors;
  const base = dark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.navy,
      background: palette.background,
      card: palette.background,
      text: palette.text,
      border: palette.divider,
      notification: palette.heart,
    },
  };
}
