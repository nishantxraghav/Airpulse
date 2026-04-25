export const AQI_LEVELS = [
  {
    index: 1,
    label: 'Good',
    color: '#22C55E',
    cssVar: '--aqi-good',
    bgCssVar: '--aqi-good-bg',
    emoji: '😊',
    description: 'Air quality is satisfactory and poses little or no risk.',
    textColor: '#15803D',
  },
  {
    index: 2,
    label: 'Fair',
    color: '#EAB308',
    cssVar: '--aqi-moderate',
    bgCssVar: '--aqi-moderate-bg',
    emoji: '🙂',
    description: 'Acceptable air quality. Sensitive people may experience minor issues.',
    textColor: '#A16207',
  },
  {
    index: 3,
    label: 'Moderate',
    color: '#F97316',
    cssVar: '--aqi-unhealthy-sensitive',
    bgCssVar: '--aqi-unhealthy-sensitive-bg',
    emoji: '😐',
    description: 'Members of sensitive groups may experience health effects.',
    textColor: '#C2410C',
  },
  {
    index: 4,
    label: 'Poor',
    color: '#EF4444',
    cssVar: '--aqi-unhealthy',
    bgCssVar: '--aqi-unhealthy-bg',
    emoji: '😷',
    description: 'Everyone may begin to experience health effects. Limit outdoor activity.',
    textColor: '#B91C1C',
  },
  {
    index: 5,
    label: 'Very Poor',
    color: '#A855F7',
    cssVar: '--aqi-very-unhealthy',
    bgCssVar: '--aqi-very-unhealthy-bg',
    emoji: '🚨',
    description: 'Health warnings of emergency conditions. Avoid outdoor activity.',
    textColor: '#7E22CE',
  },
];

export const POLLUTANT_INFO = {
  co: {
    name: 'CO',
    fullName: 'Carbon Monoxide',
    unit: 'μg/m³',
    whoLimit: 4000,
    icon: 'LuFlame',
    description: 'Colorless, odorless gas from incomplete combustion',
  },
  no2: {
    name: 'NO₂',
    fullName: 'Nitrogen Dioxide',
    unit: 'μg/m³',
    whoLimit: 40,
    icon: 'LuWind',
    description: 'Reddish-brown gas from vehicle exhaust and power plants',
  },
  o3: {
    name: 'O₃',
    fullName: 'Ozone',
    unit: 'μg/m³',
    whoLimit: 100,
    icon: 'LuCloud',
    description: 'Reactive gas formed from sunlight reacting with pollutants',
  },
  pm2_5: {
    name: 'PM2.5',
    fullName: 'Fine Particulate Matter',
    unit: 'μg/m³',
    whoLimit: 15,
    icon: 'LuCircleDot',
    description: 'Fine particles 2.5 micrometers or smaller',
  },
  pm10: {
    name: 'PM10',
    fullName: 'Coarse Particulate Matter',
    unit: 'μg/m³',
    whoLimit: 45,
    icon: 'LuCircle',
    description: 'Coarse particles 10 micrometers or smaller',
  },
  so2: {
    name: 'SO₂',
    fullName: 'Sulfur Dioxide',
    unit: 'μg/m³',
    whoLimit: 20,
    icon: 'LuTriangleAlert',
    description: 'Sharp-smelling gas from burning fossil fuels',
  },
};

export const ITEMS_PER_PAGE = 6;

export const REFRESH_INTERVALS = [
  { label: '1 minute', value: 60 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
  { label: '30 minutes', value: 1800 },
];

export const FEATURED_CITIES = [
  { name: 'New Delhi', lat: 28.6139, lon: 77.2090, country: 'IN' },
  { name: 'Beijing', lat: 39.9042, lon: 116.4074, country: 'CN' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'US' },
];
