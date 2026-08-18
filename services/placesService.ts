import { apiGet } from './api';
import { Place } from '../types';

export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  radius: number,
  types: string[],
): Promise<Place[]> {
  const baseParams = {
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
  };

  if (types.length === 0) {
    return apiGet<Place[]>('/api/places', baseParams);
  }

  if (types.length === 1) {
    return apiGet<Place[]>('/api/places', { ...baseParams, type: types[0] });
  }

  const results = await Promise.all(
    types.map(async (type) => {
      try {
        return await apiGet<Place[]>('/api/places', { ...baseParams, type });
      } catch (err) {
        console.warn(`Failed to fetch places for type: ${type}`, err);
        return [] as Place[];
      }
    })
  );

  const seen = new Set<string>();
  return results.flat().filter((place) => {
    if (seen.has(place.placeId)) return false;
    seen.add(place.placeId);
    return true;
  });
}
