import type { User, UserRole } from "../lib/types";
import { apiFetch, isApiConfigured, setAuthTokens, clearAuthTokens, setCachedUser, getCachedUser, getAuthToken, ApiError } from "./apiClient";

/**
 * Layer auth beneran ngobrol ke apps/api-go (internal/auth): register/login
 * balikin access+refresh token asli, disimpan lewat setAuthTokens biar
 * request selanjutnya (create job, submit lamaran, dst) otomatis ke-attach
 * Authorization header (lihat apiClient.ts).
 *
 * Register/login harus selalu lewat backend. Kalau API gak dikonfigurasi atau
 * gak kejangkau, error dilempar apa adanya supaya UI gak pernah membuat akun
 * lokal yang terlihat sukses padahal tidak tersimpan di database.
 *
 * Gak ada endpoint /v1/auth/me di backend, jadi `name` sesudah login cuma
 * placeholder dari prefix email (persis kayak mock lama) -- nama lengkap
 * asli ada di flow profil yang terpisah, bukan bagian dari identitas auth.
 */

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
}

function decodeJwtPayload(token: string): { sub: string; role: UserRole } | null {
  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const parsed = JSON.parse(json);
    return { sub: parsed.sub, role: parsed.role };
  } catch {
    return null;
  }
}

function buildUserFromToken(accessToken: string, email: string, name?: string): AuthResult {
  const claims = decodeJwtPayload(accessToken);
  return {
    user: {
      id: claims?.sub ?? crypto.randomUUID(),
      name: name || email.split("@")[0],
      email,
      role: claims?.role ?? "candidate",
    },
    accessToken,
  };
}

function normalizeEmailInput(email: string): string {
  return email.trim().toLowerCase();
}

export async function login(email: string, password: string): Promise<AuthResult> {
  if (!isApiConfigured) {
    throw new Error("Backend auth belum terhubung. Set NEXT_PUBLIC_API_BASE_URL.");
  }
  const normalizedEmail = normalizeEmailInput(email);
  try {
    const { accessToken, refreshToken } = await apiFetch<TokenPair>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
    setAuthTokens(accessToken, refreshToken);
    const result = buildUserFromToken(accessToken, normalizedEmail);
    setCachedUser(result.user);
    return result;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error("Gagal terhubung ke server auth. Coba lagi nanti.");
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: UserRole,
  companyName?: string
): Promise<AuthResult> {
  if (!isApiConfigured) {
    throw new Error("Backend auth belum terhubung. Set NEXT_PUBLIC_API_BASE_URL.");
  }
  const normalizedEmail = normalizeEmailInput(email);
  try {
    const { accessToken, refreshToken } = await apiFetch<TokenPair>("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email: normalizedEmail,
        password,
        role,
        ...(role === "hrd" ? { companyName } : {}),
      }),
    });
    setAuthTokens(accessToken, refreshToken);
    const result = buildUserFromToken(accessToken, normalizedEmail, name);
    setCachedUser(result.user);
    return result;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new Error("Gagal terhubung ke server auth. Coba lagi nanti.");
  }
}

export function logout(): void {
  clearAuthTokens();
}

/** changePassword/changeEmail/deleteAccount butuh backend beneran -- gak
 * ada fallback mock buat mutasi akun kayak gini, errornya (ApiError atau
 * network) langsung dilempar ke pemanggil apa adanya. */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await apiFetch<{ status: string }>("/v1/auth/me/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function changeEmail(newEmail: string): Promise<void> {
  await apiFetch<{ email: string }>("/v1/auth/me/email", {
    method: "PATCH",
    body: JSON.stringify({ newEmail: normalizeEmailInput(newEmail) }),
  });
}

export async function deleteAccount(password: string): Promise<void> {
  await apiFetch<void>("/v1/auth/me", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiFetch<{ status: string }>("/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email: normalizeEmailInput(email) }),
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await apiFetch<{ status: string }>("/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}

/** Dipanggil sekali pas app mount: kalau ada token + user yang di-cache dari
 * login/register sebelumnya, kembalikan biar currentUser ke-restore tanpa
 * user harus login ulang tiap refresh halaman. */
export function restoreSession(): User | null {
  if (!getAuthToken()) return null;
  return getCachedUser<User>();
}
