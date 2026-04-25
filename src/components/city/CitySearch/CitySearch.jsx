import { useState, useCallback, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LuMapPin, LuSearch } from 'react-icons/lu';
import { searchCities, clearSearch } from '../../../store/citiesSlice';
import { useDebounce } from '../../../hooks/useDebounce';
import SearchBar from '../../common/SearchBar/SearchBar';
import styles from './CitySearch.module.css';

export default function CitySearch({ size = 'md', placeholder = 'Search for a city…', autoFocus = false }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const { searchResults, loading } = useSelector((s) => s.cities);
  const debouncedQuery = useDebounce(query, 350);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      dispatch(searchCities(debouncedQuery.trim()));
      setOpen(true);
    } else {
      dispatch(clearSearch());
      setOpen(false);
    }
  }, [debouncedQuery, dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback((city) => {
    setQuery('');
    setOpen(false);
    dispatch(clearSearch());
    navigate(`/dashboard/${city.lat}/${city.lon}`, { state: { city } });
  }, [dispatch, navigate]);

  const handleClear = () => {
    setQuery('');
    dispatch(clearSearch());
    setOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <SearchBar
        value={query}
        onChange={setQuery}
        onClear={handleClear}
        placeholder={placeholder}
        loading={loading}
        size={size}
        autoFocus={autoFocus}
      />

      {open && (
        <div className={styles.dropdown}>
          {searchResults.length > 0 ? (
            searchResults.map((city, i) => (
              <button
                key={`${city.lat}-${city.lon}-${i}`}
                className={styles.resultItem}
                onClick={() => handleSelect(city)}
              >
                <LuMapPin size={15} className={styles.resultIcon} />
                <div className={styles.resultText}>
                  <span className={styles.resultName}>{city.name}</span>
                  <span className={styles.resultSub}>
                    {[city.state, city.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              </button>
            ))
          ) : !loading ? (
            <div className={styles.noResults}>
              <LuSearch size={18} />
              <p>No cities found for "{query}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
