import { useMemo } from 'react';
import {
  LuFlame, LuWind, LuCloud, LuCircleDot, LuCircle, LuTriangleAlert,
} from 'react-icons/lu';
import { POLLUTANT_INFO } from '../../../utils/constants';
import {
  getPollutantStatus,
  getPollutantPercent,
  getPollutantColor,
} from '../../../utils/aqiHelpers';
import { formatNumber } from '../../../utils/formatters';
import styles from './PollutantCard.module.css';

const ICON_MAP = {
  LuFlame: <LuFlame size={18} />,
  LuWind: <LuWind size={18} />,
  LuCloud: <LuCloud size={18} />,
  LuCircleDot: <LuCircleDot size={18} />,
  LuCircle: <LuCircle size={18} />,
  LuTriangleAlert: <LuTriangleAlert size={18} />,
};

export default function PollutantCard({ pollutant, value }) {
  const info = POLLUTANT_INFO[pollutant];
  const status = useMemo(() => getPollutantStatus(pollutant, value), [pollutant, value]);
  const percent = useMemo(() => getPollutantPercent(pollutant, value), [pollutant, value]);
  const color = getPollutantColor(status);

  if (!info) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon} style={{ color }}>
          {ICON_MAP[info.icon]}
        </span>
        <span className={styles.name}>{info.name}</span>
        <span className={[styles.badge, styles[status]].join(' ')}>
          {status}
        </span>
      </div>

      <div className={styles.valueRow}>
        <span className={styles.value}>{formatNumber(value, 1)}</span>
        <span className={styles.unit}>{info.unit}</span>
      </div>

      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{
            '--progress-width': `${percent}%`,
            background: color,
            width: `${percent}%`,
          }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className={styles.footer}>
        <span className={styles.limitLabel}>WHO limit</span>
        <span className={styles.limitValue}>{info.whoLimit} {info.unit}</span>
      </div>
    </div>
  );
}
