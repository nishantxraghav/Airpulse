import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAirQuality } from '../services/aqiService';

export const fetchAqiByCoords = createAsyncThunk(
  'aqi/fetchByCoords',
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const data = await getAirQuality(lat, lon);
      const item = data.list[0];
      return {
        aqi: item.main.aqi,
        components: item.components,
        dt: item.dt,
        coord: data.coord,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const aqiSlice = createSlice({
  name: 'aqi',
  initialState: {
    currentData: null,
    history: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearAqiData(state) {
      state.currentData = null;
      state.error = null;
      state.lastFetched = null;
    },
    addToHistory(state, action) {
      state.history = [action.payload, ...state.history].slice(0, 48);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAqiByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAqiByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.currentData = action.payload;
        state.lastFetched = Date.now();
        state.history = [action.payload, ...state.history].slice(0, 48);
      })
      .addCase(fetchAqiByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch AQI data';
      });
  },
});

export const { clearAqiData, addToHistory } = aqiSlice.actions;
export default aqiSlice.reducer;
