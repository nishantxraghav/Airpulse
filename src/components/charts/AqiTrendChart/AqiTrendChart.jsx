import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts';
import { generateAqiHistory } from '../../../utils/mockData';
import { getAqiLevel } from '../../../utils/aqiHelpers';
import { useMemo } from 'react';
import styles from './AqiTrendChart.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  const level = val ? getAqiLevel(val) : null;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: level?.color }} />
          <span>AQI: </span>
          <strong style={{ color: level?.color }}>{entry.value?.toFixed(1)}</strong>
          {level && <span className={styles.tooltipLabel}> · {level.label}</span>}
        </p>
      ))}
    </div>
  );
};

export default function AqiTrendChart({ days = 7 }) {
  const data = useMemo(() => generateAqiHistory(days), [days]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>7-Day AQI Trend</h3>
        <span className={styles.badge}>Mock data</span>
      </div>
      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={3} stroke="var(--aqi-unhealthy-sensitive)" strokeDasharray="4 4" strokeOpacity={0.5} />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="var(--accent)"
              strokeWidth={2.5}
              fill="url(#aqiGrad)"
              dot={{ r: 3, fill: 'var(--accent)', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: 'var(--accent)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
