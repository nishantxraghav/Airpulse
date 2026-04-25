import { useEffect, useRef } from 'react';
import { getAqiLevel } from '../../../utils/aqiHelpers';
import styles from './AqiGauge.module.css';

const SIZE = 200;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// We use 75% of the circle (270 degrees)
const ARC = CIRCUMFERENCE * 0.75;

export default function AqiGauge({ value = 1, size = 200, animated = true }) {
  const circleRef = useRef(null);

  const level = getAqiLevel(value);
  const progress = (value - 1) / 4; // 0 to 1 across 1-5 scale
  const offset = ARC - progress * ARC;

  const scale = size / SIZE;

  useEffect(() => {
    if (!circleRef.current || !animated) return;
    const el = circleRef.current;
    el.style.strokeDashoffset = ARC;
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.strokeDashoffset = offset;
    });
  }, [value, offset, animated]);

  return (
    <div
      className={styles.gauge}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`AQI ${value}: ${level.label}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: 'rotate(135deg)' }}
      >
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--bg-secondary)"
          strokeWidth={STROKE}
          strokeDasharray={`${ARC} ${CIRCUMFERENCE}`}
          strokeLinecap="round"
        />
        {/* Fill */}
        <circle
          ref={circleRef}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={level.color}
          strokeWidth={STROKE}
          strokeDasharray={`${ARC} ${CIRCUMFERENCE}`}
          strokeDashoffset={animated ? ARC : offset}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${level.color}80)`,
          }}
        />
      </svg>

      <div className={styles.center}>
        <span className={styles.emoji}>{level.emoji}</span>
        <span className={styles.value} style={{ color: level.color }}>
          {value}
        </span>
        <span className={styles.label} style={{ color: level.color }}>
          {level.label}
        </span>
      </div>
    </div>
  );
}
