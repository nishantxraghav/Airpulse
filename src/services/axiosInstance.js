import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const axiosInstance = axios.create({
  baseURL: 'https://api.openweathermap.org',
  timeout: 10000,
});

// Request interceptor: append API key to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      appid: API_KEY,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract data, handle errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred.';

    if (error.response) {
      const status = error.response.status;
      if (status === 401) message = 'Invalid API key. Please check your configuration.';
      else if (status === 404) message = 'Resource not found.';
      else if (status === 429) message = 'API rate limit exceeded. Please try again later.';
      else if (status >= 500) message = 'Weather service is temporarily unavailable.';
      else message = error.response.data?.message || message;
    } else if (error.request) {
      message = 'Network error. Please check your internet connection.';
    } else if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. Please try again.';
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
