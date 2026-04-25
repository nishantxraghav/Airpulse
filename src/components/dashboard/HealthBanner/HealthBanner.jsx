import { LuShieldCheck, LuTriangleAlert, LuOctagonAlert, LuActivity } from 'react-icons/lu';
import { getAqiLevel, getHealthRecommendation } from '../../../utils/aqiHelpers';
import styles from './HealthBanner.module.css';

const ICONS = {
  1: <LuShieldCheck size={24} />,
  2: <LuActivity size={24} />,
  3: <LuTriangleAlert size={24} />,
  4: <LuTriangleAlert size={24} />,
  5: <LuOctagonAlert size={24} />,
};

export default function HealthBanner({ aqiIndex }) {
  const level = getAqiLevel(aqiIndex);
  const recommendation = getHealthRecommendation(aqiIndex);

  return (
    <div
      className={styles.banner}
      style={{
        '--banner-color': level.color,
        '--banner-bg': `${level.color}12`,
        '--banner-border': `${level.color}30`,
      }}
    >
      <span className={styles.icon}>{ICONS[aqiIndex] || ICONS[1]}</span>
      <div className={styles.content}>
        <p className={styles.title}>
          <span className={styles.emoji}>{level.emoji}</span>
          Air quality is <strong>{level.label}</strong>
        </p>
        <p className={styles.rec}>{recommendation}</p>
      </div>
    </div>
  );
}
