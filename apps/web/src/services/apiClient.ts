const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const ACCESS_TOKEN_KEY = "direkrut_access_token";
const REFRESH_TOKEN_KEY = "direkrut_refresh_token";
const USER_KEY = "direkrut_user";

export const isApiConfigured = API_BASE_URL.length > 0;

export function setAuthTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setCachedUser<T>(user: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getCachedUser<T>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearAuthTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

interface RequestOptions extends RequestInit {
  authToken?: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  if (!isApiConfigured) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL belum diset. Set env var ini kalau mau connect ke apps/api-go.",
    );
  }

  const { authToken, headers, ...rest } = options;
  const token = authToken ?? getAuthToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message: string | undefined = body?.error?.message;
    throw new ApiError(res.status, message || `API error ${res.status}: ${res.statusText}`, body?.error?.code);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
