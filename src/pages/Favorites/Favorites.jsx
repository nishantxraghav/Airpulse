import { useState, useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LuHeart, LuRefreshCw, LuFilter, LuArrowUpDown } from 'react-icons/lu';
import toast from 'react-hot-toast';

import { updateFavoriteAqi } from '../../store/favoritesSlice';
import { getAirQuality } from '../../services/aqiService';
import { getAqiLevel, getCityId } from '../../utils/aqiHelpers';
import { ITEMS_PER_PAGE } from '../../utils/constants';

import CityCard from '../../components/city/CityCard/CityCard';
import Pagination from '../../components/common/Pagination/Pagination';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import Button from '../../components/common/Button/Button';
import styles from './Favorites.module.css';

const AQI_FILTERS = ['All', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const SORT_OPTIONS = [
  { label: 'Name A–Z', value: 'name_asc' },
  { label: 'Name Z–A', value: 'name_desc' },
  { label: 'AQI Low–High', value: 'aqi_asc' },
  { label: 'AQI High–Low', value: 'aqi_desc' },
  { label: 'Recently Added', value: 'added_desc' },
];

export default function Favorites() {
  const dispatch = useDispatch();
  const { cities, aqiData } = useSelector((s) => s.favorites);

  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('added_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Reset page on filter/sort change
  useEffect(() => { setCurrentPage(1); }, [activeFilter, sortBy]);

  const handleRefreshAll = useCallback(async () => {
    if (cities.length === 0) return;
    setRefreshing(true);
    try {
      await Promise.allSettled(
        cities.map(async (city) => {
          const data = await getAirQuality(city.lat, city.lon);
          const item = data.list[0];
          dispatch(updateFavoriteAqi({
            cityId: city.id,
            data: { aqi: item.main.aqi, components: item.components, dt: item.dt },
          }));
        })
      );
      toast.success(`Refreshed ${cities.length} cities`);
    } catch {
      toast.error('Some cities failed to refresh');
    } finally {
      setRefreshing(false);
    }
  }, [cities, dispatch]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...cities];

    if (activeFilter !== 'All') {
      list = list.filter((c) => {
        const aqi = aqiData[c.id]?.aqi;
        if (!aqi) return false;
        return getAqiLevel(aqi).label === activeFilter;
      });
    }

    list.sort((a, b) => {
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      if (sortBy === 'aqi_asc') return (aqiData[a.id]?.aqi ?? 99) - (aqiData[b.id]?.aqi ?? 99);
      if (sortBy === 'aqi_desc') return (aqiData[b.id]?.aqi ?? 0) - (aqiData[a.id]?.aqi ?? 0);
      if (sortBy === 'added_desc') return (b.addedAt ?? 0) - (a.addedAt ?? 0);
      return 0;
    });

    return list;
  }, [cities, aqiData, activeFilter, sortBy]);

  // Paginate
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>
            <LuHeart size={22} className={styles.titleIcon} />
            Favorites
          </h1>
          <p className={styles.subtitle}>
            {cities.length} saved {cities.length === 1 ? 'city' : 'cities'}
          </p>
        </div>
        {cities.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={<LuRefreshCw size={14} />}
            onClick={handleRefreshAll}
            loading={refreshing}
          >
            Refresh All
          </Button>
        )}
      </div>

      {cities.length > 0 && (
        <div className={styles.controls}>
          {/* Filter chips */}
          <div className={styles.filters}>
            <LuFilter size={14} className={styles.controlIcon} />
            {AQI_FILTERS.map((f) => (
              <button
                key={f}
                className={[styles.chip, activeFilter === f ? styles.chipActive : ''].join(' ')}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className={styles.sortWrap}>
            <LuArrowUpDown size={14} className={styles.controlIcon} />
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {cities.length === 0 ? (
        <EmptyState
          icon={<LuHeart size={32} />}
          title="No saved cities yet"
          description="Search for a city and tap the heart icon to save it here for quick access."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={`No cities match "${activeFilter}"`}
          description="Try a different filter or save more cities."
          action={() => setActiveFilter('All')}
          actionLabel="Clear Filter"
        />
      ) : (
        <>
          <div className={styles.grid}>
            {paginated.map((city, i) => (
              <div key={city.id} className={styles.cardWrap} style={{ animationDelay: `${i * 50}ms` }}>
                <CityCard city={city} aqiData={aqiData[city.id] ?? null} />
              </div>
            ))}
          </div>
          <div className={styles.paginationWrap}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
