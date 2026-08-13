export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
console.log('[constants] API_BASE_URL:', API_BASE_URL);

export const TRAVEL_SPEED_MPM: Record<string, number> = {
  walking: 83,    // ~5 km/h
  cycling: 250,   // ~15 km/h
  driving: 500,   // ~30 km/h in urban areas
  transit: 333,   // ~20 km/h average
};

export const MIN_VENUE_TIME_MINUTES = 5;

export const MAX_RECOMMENDATIONS = 10;

export const SCORE_WEIGHTS = {
  timeAtVenue: 0.5,
  rating: 0.3,
  popularity: 0.2,
};

export const PLACE_CATEGORIES = [
  { label: 'All', value: null },
  { label: 'Food & Drink', value: 'restaurant' },
  { label: 'Coffee', value: 'cafe' },
  { label: 'Nature', value: 'park' },
  { label: 'Culture', value: 'museum' },
  { label: 'Shopping', value: 'shopping_mall' },
  { label: 'Library', value: 'library' },
];
