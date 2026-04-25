import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'airpulse_preferences';

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePrefs(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn('Failed to persist preferences');
  }
}

const defaultState = {
  theme: window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  refreshInterval: 300,
  alertThreshold: 3,
  temperatureUnit: 'celsius',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: { ...defaultState, ...(loadPrefs() || {}) },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      savePrefs(state);
    },
    setTheme(state, action) {
      state.theme = action.payload;
      savePrefs(state);
    },
    setRefreshInterval(state, action) {
      state.refreshInterval = action.payload;
      savePrefs(state);
    },
    setAlertThreshold(state, action) {
      const val = Math.max(1, Math.min(5, Number(action.payload)));
      state.alertThreshold = val;
      savePrefs(state);
    },
    setTemperatureUnit(state, action) {
      state.temperatureUnit = action.payload;
      savePrefs(state);
    },
    saveAllPreferences(state, action) {
      Object.assign(state, action.payload);
      savePrefs(state);
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setRefreshInterval,
  setAlertThreshold,
  setTemperatureUnit,
  saveAllPreferences,
} = preferencesSlice.actions;
export default preferencesSlice.reducer;
