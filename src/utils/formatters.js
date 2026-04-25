/**
 * Formats a number with locale-appropriate separators.
 */
export function formatNumber(n, decimals = 1) {
  if (n === null || n === undefined) return '—';
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Formats a Unix timestamp to a human-readable date string.
 */
export function formatDate(timestamp) {
  if (!timestamp) return '—';
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  return new Date(ms).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a Unix timestamp to HH:MM.
 */
export function formatTime(timestamp) {
  if (!timestamp) return '—';
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  return new Date(ms).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a Unix timestamp to a short date for charts.
 */
export function formatChartDate(timestamp) {
  if (!timestamp) return '';
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  return new Date(ms).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Returns a relative time string ("2 minutes ago", "just now", etc.)
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Never';
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  const diff = (Date.now() - ms) / 1000;

  if (diff < 5) return 'Just now';
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Truncates a string to given length with ellipsis.
 */
export function truncate(str, len = 30) {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.slice(0, len).trimEnd() + '…';
}

/**
 * Formats countdown seconds to MM:SS string.
 */
export function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
