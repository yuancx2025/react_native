# ECE 590 HW5 — Weather Navigation

A mobile weather app built with Expo Router. Current conditions and the 3-day forecast come from WeatherAPI. Favorites are stored on the device with AsyncStorage.

## Setup

Install the Android Emulator and/or iOS Simulator first:
https://docs.expo.dev/get-started/set-up-your-environment/

```bash
cd ece590hw5/client
npm install
cp .env.example .env
```

`.env` needs a WeatherAPI key:

```
EXPO_PUBLIC_WEATHER_API_KEY=your-weatherapi-key
```

## Start

```bash
cd ece590hw5/client
npm start
```

Then:

- Press `i` to open the iOS Simulator (macOS)
- Press `a` to open the Android Emulator (start an AVD in Android Studio first)

There is no favorites server. Saved places stay on the device.

## How to use

1. Open the drawer from the Weather header. **Weather** and **Manage Favorites** are the two items.
2. Tap the search bar. A modal sheet titled **Search by Zip Code** opens. Enter a 5-digit US zip code. A valid zip loads automatically.
3. While the request is in flight, an activity indicator appears. An unknown zip shows **Location not found.**
4. A match appears under **Search Results:** as the city in bold, then the state and zip. Tap that row to dismiss the sheet and show the location. **Cancel** closes the sheet and leaves the previous location in place.
5. Saved places are listed under **Favorites:** on the search sheet and on **Manage Favorites**. Tap a row to load it. **Remove** deletes it from the device.
6. The Weather screen shows the temperature, feels-like, city, and state. Sunrise and sunset share one bar. Wind is on the next bar. The 3-day forecast is three stacked rows.
7. Tap **Add Favorite** to save the current place. A saved location shows a filled heart.
8. Use **Switch to Metric** / **Switch to Imperial** for C/KPH vs F/MPH. The hourly screen uses the same units.
9. Tap a day in the 3-day forecast to open **Hourly Forecast**. Today starts at the current hour and runs through 11 PM. The next two days show all 24 hours. The list scrolls.
10. The back button on Hourly Forecast returns to Weather.

Empty Weather screen copy: `Touch the search bar to enter a zip code`.

Light mode follows the Figma colors. Dark mode follows the device appearance and keeps the text readable. Switch the simulator appearance to check both.

## Project layout

| Path | Role |
|------|------|
| `client/app/_layout.tsx` | Root stack, theme, favorites and weather context |
| `client/app/(drawer)/` | Drawer: Weather and Manage Favorites |
| `client/app/(drawer)/main/` | Stack: Weather and Hourly Forecast |
| `client/app/search.tsx` | Zip search presented as a modal |
| `client/src/context/` | AsyncStorage favorites and shared weather state |
| `client/.env` | WeatherAPI key (`EXPO_PUBLIC_WEATHER_API_KEY`) |
