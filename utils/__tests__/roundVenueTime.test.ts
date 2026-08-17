import { describe, it, expect } from 'vitest';
import { roundVenueTime } from '../roundVenueTime';

describe('roundVenueTime', () => {
  it('rounds to nearest whole number when <= 40', () => {
    expect(roundVenueTime(12.7)).toBe(13);
    expect(roundVenueTime(38.2)).toBe(38);
  });

  it('rounds to nearest 5-minute interval when > 40', () => {
    expect(roundVenueTime(43)).toBe(45);
    expect(roundVenueTime(67)).toBe(65);
    expect(roundVenueTime(89)).toBe(90);
  });
});
