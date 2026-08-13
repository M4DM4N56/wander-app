import { describe, it, expect } from 'vitest';
import { formatTime } from '../formatTime';

describe('formatTime', () => {
  it('returns seconds for values under 60', () => {
    expect(formatTime(45)).toBe('45 sec');
  });

  it('returns minutes for values under 3600', () => {
    expect(formatTime(720)).toBe('12 min');
  });

  it('returns hours and minutes for exactly 1 hour', () => {
    expect(formatTime(3600)).toBe('1 hr 0 min');
  });

  it('returns hours and minutes for 1 hr 15 min', () => {
    expect(formatTime(4500)).toBe('1 hr 15 min');
  });
});
