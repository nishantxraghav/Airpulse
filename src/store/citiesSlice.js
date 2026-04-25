import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchCity } from '../services/geoService';

export const searchCities = createAsyncThunk(
  'cities/search',
  async (query, { rejectWithValue }) => {
    try {
      const data = await searchCity(query);
      return data.map((city) => ({
        name: city.name,
        lat: city.lat,
        lon: city.lon,
        country: city.country,
        state: city.state || null,
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const citiesSlice = createSlice({
  name: 'cities',
  initialState: {
    searchResults: [],
    selectedCity: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCity(state, action) {
      state.selectedCity = action.payload;
    },
    clearSearch(state) {
      state.searchResults = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to search cities';
        state.searchResults = [];
      });
  },
});

export const { setSelectedCity, clearSearch } = citiesSlice.actions;
export default citiesSlice.reducer;
