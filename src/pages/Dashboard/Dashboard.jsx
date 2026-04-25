import { useEffect, useCallback, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LuHeart, LuArrowLeft, LuMapPin } from 'react-icons/lu';
import toast from 'react-hot-toast';

import { fetchAqiByCoords } from '../../store/aqiSlice';
import { addFavorite, removeFavorite } from '../../store/favoritesSlice';
import { getCityId } from '../../utils/aqiHelpers';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { getCountryByCode } from '../../services/countriesService';

import AqiGauge from '../../components/dashboard/AqiGauge/AqiGauge';
import HealthBanner from '../../components/dashboard/HealthBanner/HealthBanner';
import PollutantCard from '../../components/dashboard/PollutantCard/PollutantCard';
import RefreshTimer from '../../components/dashboard/RefreshTimer/RefreshTimer';
import AqiTrendChart from '../../components/charts/AqiTrendChart/AqiTrendChart';
import PollutantBarChart from '../../components/charts/PollutantBarChart/PollutantBarChart';
import Loader from '../../components/common/Loader/Loader';
import { ErrorBoundary } from '../../components/common/ErrorFallback/ErrorFallback';
import Button from '../../components/common/Button/Button';

import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { lat, lon } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentData, loading, error, lastFetched } = useSelector((s) => s.aqi);
  const favorites = useSelector((s) => s.favorites.cities);
  const refreshInterval = useSelector((s) => s.preferences.refreshInterval);

  const city = location.state?.city || { name: 'Unknown City', country: '' };
  const cityId = getCityId(lat, lon);
  const isFavorite = favorites.some((f) => f.id === cityId);

  const [countryInfo, setCountryInfo] = useState(null);

  const doFetch = useCallback(() => {
    dispatch(fetchAqiByCoords({ lat: parseFloat(lat), lon: parseFloat(lon) }));
  }, [dispatch, lat, lon]);

  // Initial fetch
  useEffect(() => { doFetch(); }, [doFetch]);

  // Fetch country info
  useEffect(() => {
    if (city.country) {
      getCountryByCode(city.country)
        .then((data) => setCountryInfo(Array.isArray(data) ? data[0] : data))
        .catch(() => {});
    }
  }, [city.country]);

  const { secondsUntilRefresh, refresh } = useAutoRefresh(doFetch, refreshInterval * 1000);

  const handleRefresh = () => {
    refresh();
    toast.success('Data refreshed');
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(cityId));
      toast('Removed from favorites');
    } else {
      dispatch(addFavorite({ ...city, id: cityId, lat: parseFloat(lat), lon: parseFloat(lon) }));
      toast.success('Added to favorites ❤️');
    }
  };

  const pollutants = currentData?.components
    ? Object.entries(currentData.components)
    : [];

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <LuArrowLeft size={18} />
          Back
        </button>

        <div className={styles.cityInfo}>
          <LuMapPin size={16} className={styles.pinIcon} />
          <div>
            <h1 className={styles.cityName}>
              {city.name}
              {countryInfo?.flags?.emoji && (
                <span className={styles.flag}>{countryInfo.flags.emoji}</span>
              )}
            </h1>
            <p className={styles.cityMeta}>
              {[city.state, city.country].filter(Boolean).join(', ')}
              {countryInfo?.name?.common && ` · ${countryInfo.name.common}`}
            </p>
          </div>
        </div>

        <Button
          variant={isFavorite ? 'danger' : 'secondary'}
          size="sm"
          icon={<LuHeart size={14} fill={isFavorite ? 'currentColor' : 'none'} />}
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? 'Saved' : 'Save'}
        </Button>
      </div>

      {/* Error state */}
      {error && !currentData && (
        <div className={styles.errorBox}>
          <p>⚠️ {error}</p>
          <Button variant="secondary" size="sm" onClick={doFetch}>Retry</Button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !currentData && (
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Loader key={i} variant="card" />
          ))}
        </div>
      )}

      {/* Dashboard content */}
      {currentData && (
        <>
          {/* AQI + health */}
          <ErrorBoundary>
            <div className={`${styles.gaugeSection} ${styles.fadeIn}`}>
              <div className={styles.gaugeWrap}>
                <AqiGauge value={currentData.aqi} size={220} />
              </div>
              <div className={styles.gaugeSide}>
                <HealthBanner aqiIndex={currentData.aqi} />
                <RefreshTimer
                  secondsUntilRefresh={secondsUntilRefresh}
                  intervalSeconds={refreshInterval}
                  lastFetched={lastFetched}
                  onRefresh={handleRefresh}
                  loading={loading}
                />
              </div>
            </div>
          </ErrorBoundary>

          {/* Pollutant cards */}
          <ErrorBoundary>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Pollutant Breakdown</h2>
              <div className={styles.pollutantsGrid}>
                {pollutants.map(([key, value], i) => (
                  <div key={key} className={styles.cardAnim} style={{ animationDelay: `${i * 60}ms` }}>
                    <PollutantCard pollutant={key} value={value} />
                  </div>
                ))}
              </div>
            </section>
          </ErrorBoundary>

          {/* Charts */}
          <ErrorBoundary>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Trends & Analysis</h2>
              <div className={styles.chartsGrid}>
                <AqiTrendChart days={7} />
                <PollutantBarChart components={currentData.components} />
              </div>
            </section>
          </ErrorBoundary>
        </>
      )}
    </div>
  );
}
