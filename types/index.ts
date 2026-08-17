export type TravelMode = 'walking' | 'driving' | 'transit' | 'cycling';

export interface Place {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  totalRatings: number;
  types: string[];
  openNow: boolean;
  closingTime: string | null;
  photoReferences: string[];
  priceLevel: number | null;
}

export interface DistanceResult {
  placeId: string;
  durationSeconds: number | null;
}

export interface Recommendation extends Place {
  travelTimeSeconds: number;
  timeAtVenueMinutes: number;
  score: number;
}
