import { Link } from 'react-router-dom';
import { LuWind, LuBell, LuHeart } from 'react-icons/lu';
import ThemeToggle from '../../common/ThemeToggle/ThemeToggle';
import styles from './Header.module.css';
import { useSelector } from 'react-redux';

export default function Header({ onMobileMenuToggle }) {
  const favCount = useSelector((s) => s.favorites.cities.length);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}><LuWind size={20} /></span>
          <span className={styles.logoText}>AirPulse</span>
        </Link>
      </div>

      <div className={styles.right}>
        <Link to="/favorites" className={styles.favLink} aria-label={`Favorites (${favCount})`}>
          <LuHeart size={18} />
          {favCount > 0 && <span className={styles.badge}>{favCount}</span>}
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
