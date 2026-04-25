import { useDispatch, useSelector } from 'react-redux';
import { LuSun, LuMoon } from 'react-icons/lu';
import { toggleTheme } from '../../../store/preferencesSlice';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.preferences.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      className={styles.toggle}
      onClick={handleToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={[styles.icon, theme === 'dark' ? styles.rotated : ''].join(' ')}>
        {theme === 'light' ? <LuMoon size={18} /> : <LuSun size={18} />}
      </span>
    </button>
  );
}
