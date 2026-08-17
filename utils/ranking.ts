import { Place, DistanceResult, Recommendation } from '../types';
import { MIN_VENUE_TIME_MINUTES, MAX_RECOMMENDATIONS, SCORE_WEIGHTS, PLACE_TYPE_LABELS } from '../constants';

const wantedTypes = new Set(Object.keys(PLACE_TYPE_LABELS));

export function rankPlaces(
  candidates: Place[],
  distanceResults: DistanceResult[],
  timeBudgetMinutes: number
): Recommendation[] {
  const durationMap = new Map<string, number | null>(
    distanceResults.map((r) => [r.placeId, r.durationSeconds])
  );

  const recommendations: Recommendation[] = [];

  for (const candidate of candidates) {
    if (!candidate.openNow) continue;
    if (!candidate.types.some((t) => wantedTypes.has(t))) continue;

    const durationSeconds = durationMap.get(candidate.placeId);
    if (durationSeconds == null) continue;

    const roundTripSeconds = durationSeconds * 2;
    const timeAtVenueMinutes = timeBudgetMinutes - roundTripSeconds / 60;
    if (timeAtVenueMinutes <= MIN_VENUE_TIME_MINUTES) continue;

    const score =
      timeAtVenueMinutes * SCORE_WEIGHTS.timeAtVenue +
      candidate.rating * 10 * SCORE_WEIGHTS.rating +
      Math.log(candidate.totalRatings + 1) * SCORE_WEIGHTS.popularity;

    recommendations.push({
      ...candidate,
      travelTimeSeconds: durationSeconds,
      timeAtVenueMinutes,
      score,
    });
  }

  recommendations.sort((a, b) => b.score - a.score);
  return recommendations.slice(0, MAX_RECOMMENDATIONS);
}

if (require.main === module) {
  const places: Place[] = [
    { placeId: 'p1', name: 'Central Park', lat: 40.785, lng: -73.968, rating: 4.8, totalRatings: 5000, types: ['park'], openNow: true, closingTime: null, photoReferences: [], priceLevel: null },
    { placeId: 'p2', name: 'Corner Cafe', lat: 40.712, lng: -74.006, rating: 4.2, totalRatings: 300, types: ['cafe'], openNow: true, closingTime: null, photoReferences: [], priceLevel: 1 },
    { placeId: 'p3', name: 'Closed Museum', lat: 40.779, lng: -73.963, rating: 4.5, totalRatings: 1200, types: ['museum'], openNow: false, closingTime: null, photoReferences: [], priceLevel: null },
  ];

  const distanceResults: DistanceResult[] = [
    { placeId: 'p1', durationSeconds: 900 },
    { placeId: 'p2', durationSeconds: 600 },
    { placeId: 'p3', durationSeconds: 300 },
  ];

  const results = rankPlaces(places, distanceResults, 60);
  console.log(JSON.stringify(results, null, 2));
}
