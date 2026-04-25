import { configureStore } from '@reduxjs/toolkit';
import aqiReducer from './aqiSlice';
import citiesReducer from './citiesSlice';
import favoritesReducer from './favoritesSlice';
import preferencesReducer from './preferencesSlice';

const store = configureStore({
  reducer: {
    aqi: aqiReducer,
    cities: citiesReducer,
    favorites: favoritesReducer,
    preferences: preferencesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
