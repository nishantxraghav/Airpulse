import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { LuHouse, LuHeart, LuSettings } from 'react-icons/lu';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.appShell}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className={styles.bottomNav} aria-label="Mobile navigation">
        <NavLink to="/" end className={({ isActive }) => [styles.bottomItem, isActive ? styles.bottomActive : ''].join(' ')}>
          <LuHouse size={22} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => [styles.bottomItem, isActive ? styles.bottomActive : ''].join(' ')}>
          <LuHeart size={22} />
          <span>Saved</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => [styles.bottomItem, isActive ? styles.bottomActive : ''].join(' ')}>
          <LuSettings size={22} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}
