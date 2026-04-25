import styles from './Loader.module.css';

/**
 * Versatile loader component.
 * @param {('spinner'|'skeleton'|'card'|'chart')} variant
 */
export default function Loader({ variant = 'spinner', count = 1, className = '' }) {
  if (variant === 'spinner') {
    return (
      <div className={[styles.spinnerWrap, className].join(' ')}>
        <div className={styles.spinner} role="status" aria-label="Loading">
          <span className="sr-only">Loading…</span>
        </div>
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className={[styles.skeletonGroup, className].join(' ')}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={styles.skeletonLine} style={{ '--delay': `${i * 80}ms` }} />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={[styles.cardSkeleton, className].join(' ')} aria-hidden="true">
        <div className={styles.skeletonCircle} />
        <div className={styles.skeletonLines}>
          <div className={styles.skeletonLine} style={{ width: '60%' }} />
          <div className={styles.skeletonLine} style={{ width: '40%' }} />
        </div>
        <div className={styles.skeletonBlock} />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={[styles.chartSkeleton, className].join(' ')} aria-hidden="true">
        <div className={styles.chartBars}>
          {[70, 45, 80, 55, 90, 40, 75].map((h, i) => (
            <div
              key={i}
              className={`${styles.chartBar} shimmer`}
              style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}

/** Inline spinner for use inside buttons etc. */
export function InlineSpinner({ size = 16 }) {
  return (
    <span
      className={styles.inlineSpinner}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
