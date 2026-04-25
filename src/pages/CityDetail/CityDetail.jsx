import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LuArrowLeft, LuHeart, LuMapPin, LuUsers, LuGlobe } from 'react-icons/lu';
import toast from 'react-hot-toast';

import { fetchAqiByCoords } from '../../store/aqiSlice';
import { addFavorite, removeFavorite } from '../../store/favoritesSlice';
import { getCityId } from '../../utils/aqiHelpers';
import { getCountryByCode } from '../../services/countriesService';
import { generateAqiHistory, generateNearbyCities } from '../../utils/mockData';
import { formatNumber } from '../../utils/formatters';

import AqiGauge from '../../components/dashboard/AqiGauge/AqiGauge';
import HealthBanner from '../../components/dashboard/HealthBanner/HealthBanner';
import PollutantCard from '../../components/dashboard/PollutantCard/PollutantCard';
import AqiTrendChart from '../../components/charts/AqiTrendChart/AqiTrendChart';
import PollutantBarChart from '../../components/charts/PollutantBarChart/PollutantBarChart';
import { ErrorBoundary } from '../../components/common/ErrorFallback/ErrorFallback';
import Loader from '../../components/common/Loader/Loader';
import Button from '../../components/common/Button/Button';
import CityCard from '../../components/city/CityCard/CityCard';
import styles from './CityDetail.module.css';

export default function CityDetail() {
  const { lat, lon } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentData, loading } = useSelector((s) => s.aqi);
  const favorites = useSelector((s) => s.favorites.cities);

  const city = location.state?.city || { name: 'Unknown City', country: '' };
  const cityId = getCityId(lat, lon);
  const isFavorite = favorites.some((f) => f.id === cityId);

  const [countryInfo, setCountryInfo] = useState(null);
  const nearbyCities = generateNearbyCities(lat, lon);

  const doFetch = useCallback(() => {
    dispatch(fetchAqiByCoords({ lat: parseFloat(lat), lon: parseFloat(lon) }));
  }, [dispatch, lat, lon]);

  useEffect(() => { doFetch(); }, [doFetch]);

  useEffect(() => {
    if (city.country) {
      getCountryByCode(city.country)
        .then((d) => setCountryInfo(Array.isArray(d) ? d[0] : d))
        .catch(() => {});
    }
  }, [city.country]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(cityId));
      toast('Removed from favorites');
    } else {
      dispatch(addFavorite({ ...city, id: cityId, lat: parseFloat(lat), lon: parseFloat(lon) }));
      toast.success('Added to favorites ❤️');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <LuArrowLeft size={18} /> Back
        </button>
        <div className={styles.cityInfo}>
          <LuMapPin size={16} className={styles.pin} />
          <div>
            <h1 className={styles.cityName}>
              {city.name}
              {countryInfo?.flags?.emoji && <span> {countryInfo.flags.emoji}</span>}
            </h1>
            <p className={styles.cityMeta}>{[city.state, city.country].filter(Boolean).join(', ')}</p>
          </div>
        </div>
        <Button variant={isFavorite ? 'danger' : 'secondary'} size="sm"
          icon={<LuHeart size={14} fill={isFavorite ? 'currentColor' : 'none'} />}
          onClick={handleFavoriteToggle}>
          {isFavorite ? 'Saved' : 'Save City'}
        </Button>
      </div>

      {loading && !currentData && <Loader variant="card" />}

      {currentData && (
        <>
          {/* Country info card */}
          {countryInfo && (
            <ErrorBoundary>
              <div className={styles.countryCard}>
                {countryInfo.flags?.png && (
                  <img src={countryInfo.flags.png} alt={`${countryInfo.name?.common} flag`} className={styles.flagImg} />
                )}
                <div className={styles.countryStats}>
                  <div className={styles.statItem}>
                    <LuGlobe size={14} />
                    <span><strong>{countryInfo.name?.common}</strong></span>
                  </div>
                  <div className={styles.statItem}>
                    <LuMapPin size={14} />
                    <span>Capital: <strong>{countryInfo.capital?.[0] ?? '—'}</strong></span>
                  </div>
                  <div className={styles.statItem}>
                    <LuUsers size={14} />
                    <span>Population: <strong>{formatNumber(countryInfo.population / 1e6, 1)}M</strong></span>
                  </div>
                  <div className={styles.statItem}>
                    <LuGlobe size={14} />
                    <span>Region: <strong>{countryInfo.region}</strong></span>
                  </div>
                </div>
              </div>
            </ErrorBoundary>
          )}

          {/* AQI Gauge */}
          <ErrorBoundary>
            <div className={styles.gaugeSection}>
              <div className={styles.gaugeWrap}>
                <AqiGauge value={currentData.aqi} size={200} />
              </div>
              <HealthBanner aqiIndex={currentData.aqi} />
            </div>
          </ErrorBoundary>

          {/* Pollutants */}
          <ErrorBoundary>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Pollutant Breakdown</h2>
              <div className={styles.pollutantsGrid}>
                {Object.entries(currentData.components).map(([key, val]) => (
                  <PollutantCard key={key} pollutant={key} value={val} />
                ))}
              </div>
            </section>
          </ErrorBoundary>

          {/* Charts */}
          <ErrorBoundary>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Historical Trends</h2>
              <div className={styles.chartsGrid}>
                <AqiTrendChart days={14} />
                <PollutantBarChart components={currentData.components} />
              </div>
            </section>
          </ErrorBoundary>

          {/* Nearby cities */}
          <ErrorBoundary>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Nearby Areas <span className={styles.mockBadge}>Mock</span></h2>
              <div className={styles.nearbyGrid}>
                {nearbyCities.map((c) => (
                  <CityCard key={`${c.lat}-${c.lon}`} city={c} aqiData={{ aqi: c.aqi }} />
                ))}
              </div>
            </section>
          </ErrorBoundary>
        </>
      )}
    </div>
  );
}
