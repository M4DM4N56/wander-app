import { TRAVEL_SPEED_MPM } from '../constants';

export function radiusFromBudget(timeBudgetMinutes: number, travelMode: string): number {
  const speed = TRAVEL_SPEED_MPM[travelMode] ?? 83;
  const radius = (timeBudgetMinutes / 2) * speed;
  return Math.min(radius, 10000);
}
