/**
 * Klien HTTP tipis buat manggil Golang REST API. Belum dipakai di mana pun
 * hari ini (semua fitur masih jalan di atas mock data), tapi ini titik
 * sambung resmi begitu backend api-go siap.
 *
 * Kalau NEXT_PUBLIC_API_BASE_URL nggak diset, semua service di folder ini
 * tetap fallback ke data mock — jadi app tetap jalan tanpa backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const isApiConfigured = API_BASE_URL.length > 0;

interface RequestOptions extends RequestInit {
  authToken?: string;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!isApiConfigured) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL belum diset. Set env var ini kalau mau connect ke apps/api-go."
    );
  }

  const { authToken, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
