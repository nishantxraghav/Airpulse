import { useRef } from 'react';
import { LuSearch, LuX } from 'react-icons/lu';
import { InlineSpinner } from '../Loader/Loader';
import styles from './SearchBar.module.css';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search cities…',
  loading = false,
  className = '',
  autoFocus = false,
  size = 'md',
}) {
  const inputRef = useRef(null);

  const handleClear = () => {
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={[styles.wrapper, styles[size], className].join(' ')}>
      <span className={styles.searchIcon}>
        {loading ? <InlineSpinner size={18} /> : <LuSearch size={18} />}
      </span>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
        spellCheck={false}
      />
      {value && (
        <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
          <LuX size={16} />
        </button>
      )}
    </div>
  );
}
