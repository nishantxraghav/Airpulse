import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LuHeart, LuMapPin, LuArrowRight } from 'react-icons/lu';
import { addFavorite, removeFavorite } from '../../../store/favoritesSlice';
import { getAqiLevel } from '../../../utils/aqiHelpers';
import { getCityId } from '../../../utils/aqiHelpers';
import styles from './CityCard.module.css';

export default function CityCard({ city, aqiData, showRemove = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector((s) => s.favorites.cities);

  const cityId = getCityId(city.lat, city.lon);
  const isFavorite = favorites.some((f) => f.id === cityId);

  const aqi = aqiData?.aqi ?? null;
  const level = aqi ? getAqiLevel(aqi) : null;

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(cityId));
    } else {
      dispatch(addFavorite({ ...city, id: cityId }));
    }
  };

  const handleClick = () => {
    navigate(`/dashboard/${city.lat}/${city.lon}`, { state: { city } });
  };

  return (
    <div className={styles.card} onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      <div className={styles.header}>
        <div className={styles.location}>
          <LuMapPin size={14} className={styles.pinIcon} />
          <div>
            <p className={styles.cityName}>{city.name}</p>
            <p className={styles.countryState}>
              {[city.state, city.country].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>

        <button
          className={[styles.favBtn, isFavorite ? styles.favActive : ''].join(' ')}
          onClick={handleFavoriteToggle}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <LuHeart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className={styles.aqiRow}>
        {level ? (
          <>
            <span
              className={styles.aqiBadge}
              style={{ background: `${level.color}20`, color: level.color }}
            >
              AQI {aqi} · {level.label}
            </span>
            <span className={styles.emoji}>{level.emoji}</span>
          </>
        ) : (
          <span className={styles.noData}>No data yet</span>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.viewLink}>
          View Dashboard <LuArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}
