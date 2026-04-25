import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LuWind, LuGlobe, LuTrendingUp } from 'react-icons/lu';
import CitySearch from '../../components/city/CitySearch/CitySearch';
import CityCard from '../../components/city/CityCard/CityCard';
import Loader from '../../components/common/Loader/Loader';
import { searchCities, clearSearch } from '../../store/citiesSlice';
import { fetchAqiByCoords } from '../../store/aqiSlice';
import { updateFavoriteAqi } from '../../store/favoritesSlice';
import { FEATURED_CITIES } from '../../utils/constants';
import styles from './Home.module.css';

export default function Home() {
  const dispatch = useDispatch();
  const { searchResults, loading: searchLoading } = useSelector((s) => s.cities);
  const favAqiData = useSelector((s) => s.favorites.aqiData);

  // Fetch AQI for featured cities on mount
  useEffect(() => {
    FEATURED_CITIES.forEach(async (city) => {
      try {
        const result = await dispatch(fetchAqiByCoords({ lat: city.lat, lon: city.lon })).unwrap();
        const cityId = `${city.lat.toFixed(4)},${city.lon.toFixed(4)}`;
        dispatch(updateFavoriteAqi({ cityId, data: result }));
      } catch (_) {}
    });
  }, [dispatch]);

  // Build featured city AQI map
  const featuredAqi = useMemo(() => {
    const map = {};
    FEATURED_CITIES.forEach((city) => {
      const id = `${city.lat.toFixed(4)},${city.lon.toFixed(4)}`;
      if (favAqiData[id]) map[id] = favAqiData[id];
    });
    return map;
  }, [favAqiData]);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <LuWind size={14} />
            <span>Real-Time Air Quality Monitor</span>
          </div>
          <h1 className={styles.heroTitle}>
            Monitor air quality<br />
            <span className={styles.heroAccent}>worldwide</span> in real-time
          </h1>
          <p className={styles.heroSub}>
            Search any city to get instant AQI readings, pollutant breakdowns,
            and health recommendations powered by OpenWeatherMap.
          </p>
        </div>

        <div className={styles.searchWrap}>
          <CitySearch size="lg" placeholder="Search for a city, e.g. London, Mumbai…" autoFocus />
        </div>

        <div className={styles.stats}>
          {[
            { icon: <LuGlobe size={16} />, label: '196+ Countries' },
            { icon: <LuTrendingUp size={16} />, label: 'Live Updates' },
            { icon: <LuWind size={16} />, label: '6 Pollutants' },
          ].map((s) => (
            <div key={s.label} className={styles.statChip}>
              {s.icon}
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Search results */}
      {searchResults.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Search Results</h2>
          <div className={styles.grid}>
            {searchResults.map((city, i) => (
              <div
                key={`${city.lat}-${city.lon}`}
                className={styles.cardWrap}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CityCard city={city} aqiData={null} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured cities */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Major Cities</h2>
        <p className={styles.sectionSub}>Current air quality in key cities around the world</p>
        <div className={styles.grid}>
          {FEATURED_CITIES.map((city, i) => {
            const id = `${city.lat.toFixed(4)},${city.lon.toFixed(4)}`;
            return (
              <div
                key={id}
                className={styles.cardWrap}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CityCard city={city} aqiData={featuredAqi[id] ?? null} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
