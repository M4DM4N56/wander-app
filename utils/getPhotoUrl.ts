import { API_BASE_URL } from '../constants';

export function getPhotoUrl(photoReference: string, maxwidth = 400): string {
  return `${API_BASE_URL}/api/places/photo/${encodeURIComponent(photoReference)}?maxwidth=${maxwidth}`;
}
