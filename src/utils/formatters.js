/**
 * Format helpers for the Mission Control dashboard
 */

/** Format a number with commas (e.g., 27580 → "27,580") */
export function formatNumber(num, decimals = 0) {
  if (num == null || isNaN(num)) return '—';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Format coordinate with direction (e.g., 12.4521 → "+12.4521°") */
export function formatCoordinate(value, type = 'lat') {
  if (value == null) return '—';
  const abs = Math.abs(value).toFixed(4);
  if (type === 'lat') {
    return `${value >= 0 ? '+' : '-'}${abs}°`;
  }
  return `${value >= 0 ? '+' : '-'}${abs}°`;
}

/** Format coordinate with N/S/E/W */
export function formatCoordDisplay(lat, lng) {
  if (lat == null || lng == null) return '—';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir} ${Math.abs(lng).toFixed(2)}°${lngDir}`;
}

/** Format time as HH:mm:ss */
export function formatTime(date) {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString('en-US', { hour12: false });
}

/** Format relative time (e.g., "3 seconds ago", "2 hours ago") */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return '—';
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 1000) return 'just now';
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

/** Format a news article date */
export function formatArticleDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffHours < 1) return `${Math.floor(diffMs / 60000)} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffHours < 48) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Truncate text with ellipsis */
export function truncate(str, maxLen = 100) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen).trim() + '…';
}
