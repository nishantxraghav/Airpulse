import axiosInstance from './axiosInstance';

/**
 * Fetches current air quality for given coordinates.
 */
export async function getAirQuality(lat, lon) {
  return axiosInstance.get('/data/2.5/air_pollution', {
    params: { lat, lon },
  });
}

/**
 * Fetches air quality forecast for given coordinates.
 */
export async function getAirQualityForecast(lat, lon) {
  return axiosInstance.get('/data/2.5/air_pollution/forecast', {
    params: { lat, lon },
  });
}
