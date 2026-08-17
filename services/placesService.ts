import { apiGet } from './api';
import { Place } from '../types';

export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  radius: number,
  types: string[],
): Promise<Place[]> {
  const params: Record<string, string> = {
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
  };
  if (types.length === 1) {
    params.type = types[0];
  }
  return apiGet<Place[]>('/api/places', params);
}
