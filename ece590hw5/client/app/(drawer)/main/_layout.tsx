import { Stack } from 'expo-router';
import { DrawerToggleButton } from 'expo-router/drawer';
import { fonts, useAppColors } from '../../../src/theme';

export default function WeatherStackLayout() {
  const colors = useAppColors();

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.navy,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { fontFamily: fonts.bold, color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Weather',
          headerLeft: () => <DrawerToggleButton tintColor={colors.text} />,
        }}
      />
      <Stack.Screen name="hourly" options={{ title: 'Hourly Forecast' }} />
    </Stack>
  );
}
