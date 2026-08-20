import { API_BASE_URL } from '../constants';

const TIMEOUT_MS = 20000;

async function fetchWithTimeout<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal, ...options });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.text();
      console.error('[api] error response:', response.status, body);
      throw new Error(`API error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw err;
  }
}

export async function apiGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(API_BASE_URL + path);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return fetchWithTimeout<T>(url.toString());
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return fetchWithTimeout<T>(API_BASE_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
