# 🌬️ AirPulse — Real-Time Air Quality Dashboard

> A production-ready React capstone project for monitoring air quality worldwide.

![AirPulse](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## ✨ Features

- 🔍 **City Search** — Debounced live search using the OpenWeatherMap Geocoding API
- 📊 **AQI Dashboard** — Animated SVG gauge, pollutant breakdown cards, and health banner
- 📈 **Charts** — 7-day AQI trend (area chart) and pollutant bar chart via Recharts
- ❤️ **Favorites** — Save cities to localStorage with filter, sort, and pagination (6/page)
- 🌙 **Dark Mode** — CSS variable theming with `prefers-color-scheme` detection
- ⏱️ **Auto-Refresh** — Configurable interval (1–30 min) with live countdown timer
- ⚙️ **Settings** — Multi-step alert configuration with per-section persistence
- 🗺️ **City Detail** — Country info from REST Countries API, forecast charts, nearby cities
- 📱 **Responsive** — Sidebar → icon-only → bottom nav across desktop/tablet/mobile
- ⚡ **Performance** — Lazy routes, `useMemo`, `useCallback`, skeleton loaders
- 🛡️ **Error Handling** — Per-section `ErrorBoundary`, loading/error/empty states, toasts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Build Tool | Vite 5 |
| Framework | React 18 |
| Language | JavaScript (ES6+) |
| State Management | Redux Toolkit (slices + async thunks) |
| Routing | React Router v6 (lazy + `createBrowserRouter`) |
| HTTP Client | Axios (interceptors for auth + errors) |
| Styling | CSS Modules + global `variables.css` |
| Charts | Recharts |
| Icons | React Icons (Lucide set) |
| Toasts | React Hot Toast |
| Deployment | Vercel (SPA rewrites configured) |

---

## 🚀 Quick Start

### 1. Clone & install
```bash
git clone https://github.com/your-username/airpulse.git
cd airpulse
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and add your OpenWeatherMap API key
```

Get a free API key at [openweathermap.org/api](https://openweathermap.org/api).  
The **Air Pollution API** and **Geocoding API** are both available on the free tier.

### 3. Run dev server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── assets/
├── components/
│   ├── common/          # Button, Card, Loader, ErrorFallback, EmptyState, Pagination, SearchBar, ThemeToggle
│   ├── layout/          # Header, Sidebar, Layout (shell with responsive bottom nav)
│   ├── dashboard/       # AqiGauge (SVG), PollutantCard, HealthBanner, RefreshTimer
│   ├── charts/          # AqiTrendChart (area), PollutantBarChart
│   └── city/            # CityCard, CitySearch (debounced dropdown)
├── pages/
│   ├── Home/            # Hero + city search + featured cities
│   ├── Dashboard/       # Full AQI view with auto-refresh
│   ├── CityDetail/      # Extended view with country info + nearby cities
│   ├── Favorites/       # Saved cities with filter/sort/pagination
│   ├── Settings/        # Multi-step alert config + preferences
│   └── NotFound/        # 404
├── store/               # Redux: aqiSlice, citiesSlice, favoritesSlice, preferencesSlice
├── services/            # axiosInstance, aqiService, geoService, countriesService
├── hooks/               # useDebounce, useLocalStorage, useAutoRefresh
├── utils/               # constants, aqiHelpers, formatters, mockData
├── styles/              # variables.css, global.css, animations.css
└── router/              # AppRouter with lazy Suspense routes
```

---

## 🌐 APIs Used

### OpenWeatherMap Air Pollution API
```
GET https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={key}
```
Returns AQI index (1–5) and concentrations: `co`, `no2`, `o3`, `pm2_5`, `pm10`, `so2`.

### OpenWeatherMap Geocoding API
```
GET https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=5&appid={key}
```
Converts city name to lat/lon for all subsequent queries.

### REST Countries API
```
GET https://restcountries.com/v3.1/alpha/{code}?fields=name,flags,population,region,capital
```
No API key required. Used for country flags and metadata on the detail page.

---

## 🎨 AQI Scale

| Index | Label | Color | Description |
|---|---|---|---|
| 1 | Good | 🟢 #22C55E | Satisfactory, no risk |
| 2 | Fair | 🟡 #EAB308 | Acceptable; sensitive people may notice |
| 3 | Moderate | 🟠 #F97316 | Sensitive groups affected |
| 4 | Poor | 🔴 #EF4444 | Everyone may experience effects |
| 5 | Very Poor | 🟣 #A855F7 | Emergency conditions; avoid outdoors |

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_OPENWEATHER_API_KEY` | ✅ | OpenWeatherMap API key |

---

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add `VITE_OPENWEATHER_API_KEY` in Environment Variables
4. Deploy — SPA routing is pre-configured in `vercel.json`

---

## 📝 License

MIT © 2024 AirPulse
