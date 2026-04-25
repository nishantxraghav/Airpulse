import { NavLink } from 'react-router-dom';
import {
  LuHouse,
  LuLayoutDashboard,
  LuHeart,
  LuSettings,
  LuWind,
} from 'react-icons/lu';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/', icon: <LuHouse size={20} />, label: 'Home', end: true },
  { to: '/favorites', icon: <LuHeart size={20} />, label: 'Favorites' },
  { to: '/settings', icon: <LuSettings size={20} />, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}><LuWind size={20} /></span>
        <span className={styles.brandName}>AirPulse</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [styles.navItem, isActive ? styles.active : ''].join(' ')
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <p className={styles.footerText}>AirPulse v1.0</p>
        <p className={styles.footerSub}>Powered by OpenWeatherMap</p>
      </div>
    </aside>
  );
}
