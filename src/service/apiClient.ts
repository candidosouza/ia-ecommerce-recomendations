const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

type JsonValue = Record<string, unknown> | unknown[] | undefined;

export async function apiClient<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  if (!response.ok) {
    const payload = (await readJsonSafely(response)) as { message?: string } | null;
    throw new Error(payload?.message ?? `Request failed with status ${response.status}`);
  }

  return (await readJsonSafely(response)) as T;
}

async function readJsonSafely(response: Response) {
  const text = await response.text();

  if (!text) {
    return undefined as JsonValue;
  }

  return JSON.parse(text) as JsonValue;
}
