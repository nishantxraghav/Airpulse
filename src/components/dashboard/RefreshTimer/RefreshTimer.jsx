import { LuRefreshCw, LuClock } from 'react-icons/lu';
import { formatCountdown, formatRelativeTime } from '../../../utils/formatters';
import styles from './RefreshTimer.module.css';

export default function RefreshTimer({
  secondsUntilRefresh,
  intervalSeconds,
  lastFetched,
  onRefresh,
  loading = false,
}) {
  const progress = intervalSeconds > 0
    ? ((intervalSeconds - secondsUntilRefresh) / intervalSeconds) * 100
    : 0;

  return (
    <div className={styles.timer}>
      <div className={styles.info}>
        <div className={styles.row}>
          <LuClock size={14} />
          <span className={styles.text}>
            Last updated: <strong>{formatRelativeTime(lastFetched)}</strong>
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.text}>
            Refreshing in <strong className={styles.mono}>{formatCountdown(secondsUntilRefresh)}</strong>
          </span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <button
        className={[styles.refreshBtn, loading ? styles.spinning : ''].join(' ')}
        onClick={onRefresh}
        disabled={loading}
        aria-label="Refresh data now"
        title="Refresh now"
      >
        <LuRefreshCw size={16} />
      </button>
    </div>
  );
}
