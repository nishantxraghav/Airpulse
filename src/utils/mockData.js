/**
 * Generates realistic AQI history data for the past N days.
 */
export function generateAqiHistory(days = 7) {
  const data = [];
  const now = Date.now();
  const dayMs = 86400000;

  // Start with a base AQI and drift realistically
  let baseAqi = 2 + Math.random() * 2;
  let basePm25 = 10 + Math.random() * 20;

  for (let i = days - 1; i >= 0; i--) {
    const timestamp = now - i * dayMs;
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    // Add realistic daily drift
    baseAqi = Math.max(1, Math.min(5, baseAqi + (Math.random() - 0.5) * 0.8));
    basePm25 = Math.max(2, Math.min(150, basePm25 + (Math.random() - 0.5) * 8));

    const pm10 = basePm25 * (1.5 + Math.random() * 0.5);
    const no2 = 10 + Math.random() * 50;
    const o3 = 30 + Math.random() * 80;
    const so2 = 2 + Math.random() * 30;
    const co = 200 + Math.random() * 800;

    data.push({
      date: dateStr,
      timestamp,
      aqi: Math.round(baseAqi * 10) / 10,
      pm2_5: Math.round(basePm25 * 10) / 10,
      pm10: Math.round(pm10 * 10) / 10,
      no2: Math.round(no2 * 10) / 10,
      o3: Math.round(o3 * 10) / 10,
      so2: Math.round(so2 * 10) / 10,
      co: Math.round(co * 10) / 10,
    });
  }

  return data;
}

/**
 * Generates mock city comparison data.
 */
export function generateCityComparison(count = 5) {
  const cities = [
    { name: 'New Delhi', country: 'IN' },
    { name: 'Beijing', country: 'CN' },
    { name: 'London', country: 'GB' },
    { name: 'New York', country: 'US' },
    { name: 'Tokyo', country: 'JP' },
    { name: 'Paris', country: 'FR' },
    { name: 'Mumbai', country: 'IN' },
    { name: 'Sydney', country: 'AU' },
  ];

  return cities.slice(0, count).map((city) => ({
    ...city,
    aqi: Math.floor(Math.random() * 5) + 1,
    pm2_5: Math.round((Math.random() * 80 + 5) * 10) / 10,
    pm10: Math.round((Math.random() * 120 + 10) * 10) / 10,
  }));
}

/**
 * Generates mock nearby cities for a given lat/lon.
 */
export function generateNearbyCities(lat, lon) {
  const directions = [
    { name: 'North City', latOff: 0.5, lonOff: 0 },
    { name: 'East Town', latOff: 0, lonOff: 0.6 },
    { name: 'South Village', latOff: -0.4, lonOff: 0.1 },
    { name: 'West Borough', latOff: 0.1, lonOff: -0.5 },
  ];

  return directions.map((d) => ({
    name: d.name,
    lat: parseFloat(lat) + d.latOff,
    lon: parseFloat(lon) + d.lonOff,
    aqi: Math.floor(Math.random() * 5) + 1,
    country: 'XX',
  }));
}
