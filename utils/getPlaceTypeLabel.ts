import { PLACE_TYPE_LABELS } from '../constants';

export function getPlaceTypeLabel(types: string[]): string | null {
  for (const type of types) {
    if (PLACE_TYPE_LABELS[type]) {
      return PLACE_TYPE_LABELS[type];
    }
  }
  return null;
}
