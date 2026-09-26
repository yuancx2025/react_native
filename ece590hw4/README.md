# ECE 590 HW4 — React Native Weather App

A mobile weather app built with Expo (Blank TypeScript) and the same favorites API as HW3.

## Setup

Install the Android Emulator and/or iOS Simulator first:
https://docs.expo.dev/get-started/set-up-your-environment/

```bash
cd ece590hw4

cd server
npm install

cd ../client
npm install
cp .env.example .env
```

`.env` needs a WeatherAPI key:

```
EXPO_PUBLIC_WEATHER_API_KEY=your-weatherapi-key
```

## Start

**Terminal 1 — favorites API (port 4000):**

```bash
cd server
npm run dev
```

If `nodemon` fails with a file-watch error (`EMFILE`), start the API directly:

```bash
cd server
npx ts-node src/server.ts
```

**Terminal 2 — Expo app:**

```bash
cd client
npm start
```

Then:

- Press `i` to open the iOS Simulator (macOS)
- Press `a` to open the Android Emulator (start an AVD in Android Studio first)

The app calls [WeatherAPI](https://www.weatherapi.com/) for current conditions and the 3-day forecast. Favorites go to the local Express server.

The Android emulator cannot use `localhost` for the host machine. The client uses `http://10.0.2.2:4000` on Android and `http://localhost:4000` on iOS.

## How to use

1. Tap the search bar. Enter a 5-digit US zip code. A valid zip loads automatically.
2. While the request is in flight, an activity indicator appears. An unknown zip shows **Location not found.**
3. A match appears under **Search Results:** as the city in bold, then the state and zip. Tap that row to show the location on the main screen. **Cancel** closes the modal and leaves the previous location in place.
4. The main screen shows the temperature, feels-like, city, and state. Sunrise and sunset share one bar. Wind is on the next bar. The 3-day forecast is three stacked rows. The search bar stays **Enter a Zip Code**.
5. Use **Switch to Metric** / **Switch to Imperial** for C/KPH vs F/MPH.
6. Tap **Add to Favorites** (outline heart) to save the current place. A saved location shows a filled heart and no add button.
7. Saved places are listed under **Favorites:** in the same city, state, and zip format. Tap a row to load it (spinner while it fetches). **Remove** deletes it from the server.

Empty main screen copy: `Touch the search bar to enter a zip code`.

## Project layout

| Path | Role |
|------|------|
| `server/` | Express favorites API with CORS |
| `client/` | Expo React Native app |
| `client/.env` | WeatherAPI key (`EXPO_PUBLIC_WEATHER_API_KEY`) |
| `client/App.tsx` | App state: weather, units, favorites, modal |
| `client/src/api.ts` | WeatherAPI + favorites fetch helpers |
| `client/src/components/` | Main screen, search modal, stacked forecast rows |

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/favorites` | List all favorites |
| `POST` | `/favorites` | Add `{ "zip": "27513", "name": "Cary", "region": "North Carolina" }` |
| `DELETE` | `/favorites/:id` | Remove a favorite by id |
