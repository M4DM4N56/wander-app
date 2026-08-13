import { apiGet } from './api';
import { Place } from '../types';

export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  radius: number,
  type?: string | null,
): Promise<Place[]> {
  const params: Record<string, string> = {
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
  };
  if (type) {
    params.type = type;
  }
  return apiGet<Place[]>('/api/places', params);
}
