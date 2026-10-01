import 'react-native-gesture-handler';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { Inter_400Regular, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { WeatherProvider } from '../src/context/WeatherContext';
import { fonts, getTheme, useAppColors } from '../src/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = useAppColors();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  const dark = colorScheme === 'dark';

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.navy} />
      </View>
    );
  }

  return (
    <FavoritesProvider>
      <WeatherProvider>
        <ThemeProvider value={getTheme(dark)}>
          <StatusBar style={dark ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(drawer)" />
            <Stack.Screen
              name="search"
              options={{
                headerShown: true,
                title: 'Search by Zip Code',
                presentation: 'modal',
                headerTintColor: colors.text,
                headerStyle: { backgroundColor: colors.background },
                headerTitleStyle: { fontFamily: fonts.bold, color: colors.text },
                contentStyle: { backgroundColor: colors.background },
              }}
            />
          </Stack>
        </ThemeProvider>
      </WeatherProvider>
    </FavoritesProvider>
  );
}
