/** Dashboard constants */

export const ISS_POLL_INTERVAL = 15000; // 15 seconds
export const GEOCODE_DEBOUNCE = 10000; // 10 seconds
export const NEWS_CACHE_DURATION = 900000; // 15 minutes
export const CHAT_MAX_MESSAGES = 30;
export const ISS_ALTITUDE_KM = 408;
export const MAX_TRAJECTORY_POINTS = 15;
export const MAX_SPEED_HISTORY = 30;

export const NEWS_CATEGORIES = [
  { id: 'breaking-news', label: 'Breaking', icon: 'Zap', color: 'var(--danger)' },
  { id: 'technology', label: 'Technology', icon: 'Cpu', color: 'var(--accent-500)' },
  { id: 'science', label: 'Science', icon: 'FlaskConical', color: 'var(--cyan-500)' },
  { id: 'business', label: 'Business', icon: 'TrendingUp', color: 'var(--success)' },
  { id: 'sports', label: 'Sports', icon: 'Trophy', color: 'var(--hot-500)' },
];

export const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'source', label: 'By Source' },
];

export const SUGGESTED_PROMPTS = [
  { icon: 'MapPin', text: 'Where is the ISS right now?' },
  { icon: 'Gauge', text: 'How fast is the ISS moving?' },
  { icon: 'Users', text: 'Who is in space today?' },
  { icon: 'Newspaper', text: "Summarize today's tech news" },
];

export const CATEGORY_COLORS = {
  'breaking-news': '#EF4444',
  technology: '#6366F1',
  science: '#06B6D4',
  business: '#10B981',
  sports: '#EC4899',
};
