import { apiPost } from './api';
import { DistanceResult, TravelMode } from '../types';

export async function fetchTravelTimes(
  originLat: number,
  originLng: number,
  destinations: { placeId: string; lat: number; lng: number }[],
  mode: TravelMode,
): Promise<DistanceResult[]> {
  return apiPost<DistanceResult[]>('/api/distance', { originLat, originLng, destinations, mode });
}
