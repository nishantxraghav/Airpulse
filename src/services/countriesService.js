import axios from 'axios';

const countriesAxios = axios.create({
  baseURL: 'https://restcountries.com/v3.1',
  timeout: 8000,
});

countriesAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.status === 404
      ? 'Country not found.'
      : 'Failed to load country data.';
    return Promise.reject(new Error(message));
  }
);

/**
 * Fetches country info by ISO country code.
 */
export async function getCountryByCode(code) {
  return countriesAxios.get(`/alpha/${code}`, {
    params: { fields: 'name,flags,population,region,capital' },
  });
}
