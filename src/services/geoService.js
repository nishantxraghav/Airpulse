import axiosInstance from './axiosInstance';

/**
 * Searches for cities by name using OpenWeatherMap Geocoding API.
 */
export async function searchCity(query) {
  return axiosInstance.get('/geo/1.0/direct', {
    params: { q: query, limit: 5 },
  });
}

/**
 * Reverse geocodes coordinates to a location name.
 */
export async function reverseGeocode(lat, lon) {
  return axiosInstance.get('/geo/1.0/reverse', {
    params: { lat, lon, limit: 1 },
  });
}
