import { createSlice } from '@reduxjs/toolkit';
import { getCityId } from '../utils/aqiHelpers';

const STORAGE_KEY = 'airpulse_favorites';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(cities) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {
    console.warn('Failed to persist favorites');
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    cities: loadFromStorage(),
    aqiData: {},
  },
  reducers: {
    addFavorite(state, action) {
      const city = action.payload;
      const id = getCityId(city.lat, city.lon);
      const exists = state.cities.some((c) => c.id === id);
      if (!exists) {
        const newCity = { ...city, id, addedAt: Date.now() };
        state.cities.unshift(newCity);
        saveToStorage(state.cities);
      }
    },
    removeFavorite(state, action) {
      const id = action.payload;
      state.cities = state.cities.filter((c) => c.id !== id);
      delete state.aqiData[id];
      saveToStorage(state.cities);
    },
    updateFavoriteAqi(state, action) {
      const { cityId, data } = action.payload;
      state.aqiData[cityId] = { ...data, fetchedAt: Date.now() };
    },
    clearAllFavorites(state) {
      state.cities = [];
      state.aqiData = {};
      saveToStorage([]);
    },
  },
});

export const { addFavorite, removeFavorite, updateFavoriteAqi, clearAllFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
