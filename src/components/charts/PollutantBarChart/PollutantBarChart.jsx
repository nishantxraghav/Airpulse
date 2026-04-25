import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { POLLUTANT_INFO } from '../../../utils/constants';
import { getPollutantStatus, getPollutantColor } from '../../../utils/aqiHelpers';
import { formatNumber } from '../../../utils/formatters';
import styles from './PollutantBarChart.module.css';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className={styles.tooltip}>
      <p className={styles.ttName}>{d.fullName}</p>
      <p className={styles.ttValue}>
        {formatNumber(d.value, 2)} <span>{d.unit}</span>
      </p>
      <p className={styles.ttLimit}>WHO limit: {d.whoLimit} {d.unit}</p>
    </div>
  );
};

export default function PollutantBarChart({ components = {} }) {
  const data = Object.entries(POLLUTANT_INFO).map(([key, info]) => {
    const value = components[key] ?? 0;
    const status = getPollutantStatus(key, value);
    return {
      key,
      name: info.name,
      fullName: info.fullName,
      value,
      unit: info.unit,
      whoLimit: info.whoLimit,
      color: getPollutantColor(status),
    };
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Pollutant Levels</h3>
        <div className={styles.legend}>
          {[
            { label: 'Good', color: 'var(--aqi-good)' },
            { label: 'Moderate', color: 'var(--aqi-moderate)' },
            { label: 'Poor', color: 'var(--aqi-unhealthy)' },
          ].map((l) => (
            <span key={l.label} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-secondary)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
