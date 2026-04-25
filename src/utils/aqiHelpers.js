import { AQI_LEVELS, POLLUTANT_INFO } from './constants';

/**
 * Returns the full AQI level object for a given 1-5 index.
 */
export function getAqiLevel(index) {
  const idx = Math.max(1, Math.min(5, Math.round(index)));
  return AQI_LEVELS[idx - 1] || AQI_LEVELS[0];
}

/**
 * Returns the CSS color string for a given AQI index.
 */
export function getAqiColor(index) {
  return getAqiLevel(index).color;
}

/**
 * Returns a health recommendation string for a given AQI index.
 */
export function getHealthRecommendation(index) {
  const recommendations = {
    1: 'Great day to be outside! Air quality is excellent. Enjoy outdoor activities freely.',
    2: 'Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion.',
    3: 'Sensitive groups should reduce prolonged outdoor exertion. Consider wearing a mask if you have respiratory issues.',
    4: 'Everyone should reduce prolonged outdoor exertion. People with lung or heart disease should avoid outdoor activity.',
    5: 'Avoid all outdoor physical activity. Keep windows closed. Wear N95 mask if you must go outside.',
  };
  const idx = Math.max(1, Math.min(5, Math.round(index)));
  return recommendations[idx] || recommendations[1];
}

/**
 * Returns 'good' | 'moderate' | 'poor' based on pollutant value vs WHO limits.
 */
export function getPollutantStatus(pollutant, value) {
  const info = POLLUTANT_INFO[pollutant];
  if (!info) return 'good';
  const ratio = value / info.whoLimit;
  if (ratio <= 0.5) return 'good';
  if (ratio <= 1.0) return 'moderate';
  return 'poor';
}

/**
 * Normalizes pollutant value to a 0-100 percentage of WHO limit (capped at 100).
 */
export function getPollutantPercent(pollutant, value) {
  const info = POLLUTANT_INFO[pollutant];
  if (!info || info.whoLimit === 0) return 0;
  return Math.min(100, (value / info.whoLimit) * 100);
}

/**
 * Returns a CSS color based on pollutant status.
 */
export function getPollutantColor(status) {
  const colors = {
    good: 'var(--aqi-good)',
    moderate: 'var(--aqi-moderate)',
    poor: 'var(--aqi-unhealthy)',
  };
  return colors[status] || colors.good;
}

/**
 * Generates a city ID from lat/lon coordinates.
 */
export function getCityId(lat, lon) {
  return `${parseFloat(lat).toFixed(4)},${parseFloat(lon).toFixed(4)}`;
}
