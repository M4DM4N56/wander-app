import { describe, it, expect } from 'vitest';
import { radiusFromBudget } from '../radiusFromBudget';

describe('radiusFromBudget', () => {
  it('returns the correct radius for 60 minutes walking', () => {
    // (60 / 2) * 83 = 2490
    expect(radiusFromBudget(60, 'walking')).toBe(2490);
  });

  it('returns radius capped at 10000 for 60 minutes driving', () => {
    // (60 / 2) * 500 = 15000, capped at 10000
    expect(radiusFromBudget(60, 'driving')).toBe(10000);
  });

  it('defaults to walking speed for an unknown travel mode', () => {
    // falls back to 83 m/min, same as walking
    expect(radiusFromBudget(60, 'teleportation')).toBe(2490);
  });
});
