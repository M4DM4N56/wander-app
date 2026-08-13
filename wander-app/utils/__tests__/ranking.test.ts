import { describe, it, expect } from 'vitest';
import { rankPlaces } from '../ranking';
import { Place, DistanceResult } from '../../types';
import { MAX_RECOMMENDATIONS } from '../../constants';

function makePlace(overrides: Partial<Place> & { placeId: string }): Place {
  return {
    name: 'Test Place',
    lat: 0,
    lng: 0,
    rating: 4.0,
    totalRatings: 100,
    types: ['cafe'],
    openNow: true,
    ...overrides,
  };
}

function makeDistance(placeId: string, durationSeconds: number | null): DistanceResult {
  return { placeId, durationSeconds };
}

describe('rankPlaces', () => {
  it('filters out places where round-trip travel exceeds the budget', () => {
    // 30 min each way = 60 min round-trip, leaving 0 min at venue (≤ MIN_VENUE_TIME_MINUTES)
    const candidates = [makePlace({ placeId: 'p1' })];
    const distances = [makeDistance('p1', 1800)];
    const results = rankPlaces(candidates, distances, 60);
    expect(results).toHaveLength(0);
  });

  it('filters out closed places', () => {
    const candidates = [makePlace({ placeId: 'p1', openNow: false })];
    const distances = [makeDistance('p1', 60)];
    const results = rankPlaces(candidates, distances, 60);
    expect(results).toHaveLength(0);
  });

  it('returns results sorted by score descending', () => {
    const candidates = [
      // p1: low score — little time at venue, low rating
      makePlace({ placeId: 'p1', rating: 3.0, totalRatings: 10 }),
      // p2: high score — lots of time at venue, high rating
      makePlace({ placeId: 'p2', rating: 5.0, totalRatings: 1000 }),
    ];
    const distances = [
      makeDistance('p1', 1200), // 20 min one-way → 40 min round-trip → 20 min at venue
      makeDistance('p2', 120),  // 2 min one-way → 4 min round-trip → 56 min at venue
    ];
    const results = rankPlaces(candidates, distances, 60);
    expect(results).toHaveLength(2);
    expect(results[0].placeId).toBe('p2');
    expect(results[1].placeId).toBe('p1');
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it('returns no more than MAX_RECOMMENDATIONS results', () => {
    const candidates = Array.from({ length: MAX_RECOMMENDATIONS + 2 }, (_, i) =>
      makePlace({ placeId: `p${i}` })
    );
    const distances = candidates.map((c) => makeDistance(c.placeId, 60));
    const results = rankPlaces(candidates, distances, 60);
    expect(results.length).toBeLessThanOrEqual(MAX_RECOMMENDATIONS);
  });

  it('filters out places where durationSeconds is null', () => {
    const candidates = [makePlace({ placeId: 'p1' })];
    const distances = [makeDistance('p1', null)];
    const results = rankPlaces(candidates, distances, 60);
    expect(results).toHaveLength(0);
  });

  it('returns an empty array when candidates is empty', () => {
    const results = rankPlaces([], [], 60);
    expect(results).toHaveLength(0);
  });
});
