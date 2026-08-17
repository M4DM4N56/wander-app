export function roundVenueTime(minutes: number): number {
  if (minutes <= 40) {
    return Math.round(minutes);
  }
  return Math.round(minutes / 5) * 5;
}
