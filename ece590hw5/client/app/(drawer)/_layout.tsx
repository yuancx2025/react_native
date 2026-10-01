import { type ColorValue, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { fonts, useAppColors } from '../../src/theme';

function DrawerLabel({
  label,
  color,
  focused,
}: {
  label: string;
  color: ColorValue;
  focused: boolean;
}) {
  return (
    <Text
      style={{
        color,
        fontSize: 16,
        fontFamily: focused ? fonts.bold : fonts.regular,
      }}
    >
      {label}
    </Text>
  );
}

export default function DrawerLayout() {
  const colors = useAppColors();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontFamily: fonts.bold, color: colors.text },
          drawerActiveTintColor: colors.text,
          drawerInactiveTintColor: colors.text,
          drawerActiveBackgroundColor: 'transparent',
          drawerStyle: { backgroundColor: colors.background },
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Drawer.Screen
          name="main"
          options={{
            title: 'Weather',
            headerShown: false,
            drawerLabel: ({ color, focused }) => (
              <DrawerLabel label="Weather" color={color} focused={focused} />
            ),
          }}
        />
        <Drawer.Screen
          name="manage-favorites"
          options={{
            title: 'Manage Favorites',
            drawerLabel: ({ color, focused }) => (
              <DrawerLabel label="Manage Favorites" color={color} focused={focused} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
