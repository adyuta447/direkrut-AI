import type { User, UserRole } from "../lib/types";
import { apiFetch, isApiConfigured, setAuthTokens, clearAuthTokens, setCachedUser, getCachedUser, getAuthToken, ApiError } from "./apiClient";

/**
 * Layer auth beneran ngobrol ke apps/api-go (internal/auth): register/login
 * balikin access+refresh token asli, disimpan lewat setAuthTokens biar
 * request selanjutnya (create job, submit lamaran, dst) otomatis ke-attach
 * Authorization header (lihat apiClient.ts).
 *
 * Fallback ke mock CUMA buat backend yang beneran gak kejangkau (network
 * error, atau NEXT_PUBLIC_API_BASE_URL emang belum diset) -- kalau
 * backend-nya nyambung dan NOLAK (401 salah kredensial, 409 email
 * kepake, dst / ApiError), error itu dilempar apa adanya ke pemanggil.
 * Tanpa pembeda ini, kredensial ngasal bisa "login" lewat fallback tanpa
 * pernah beneran register.
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

export async function login(email: string, password: string): Promise<AuthResult> {
  if (isApiConfigured) {
    try {
      const { accessToken, refreshToken } = await apiFetch<TokenPair>("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuthTokens(accessToken, refreshToken);
      const result = buildUserFromToken(accessToken, email);
      setCachedUser(result.user);
      return result;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error("[authService] backend gak kejangkau, fallback ke mock:", err);
    }
  }
  const accessToken = "mock-token";
  setAuthTokens(accessToken, "mock-refresh-token");
  const result = { user: { id: crypto.randomUUID(), name: email.split("@")[0], email, role: "candidate" as const }, accessToken };
  setCachedUser(result.user);
  return result;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: UserRole,
  companyName?: string
): Promise<AuthResult> {
  if (isApiConfigured) {
    try {
      const { accessToken, refreshToken } = await apiFetch<TokenPair>("/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          ...(role === "hrd" ? { companyName } : {}),
        }),
      });
      setAuthTokens(accessToken, refreshToken);
      const result = buildUserFromToken(accessToken, email, name);
      setCachedUser(result.user);
      return result;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      console.error("[authService] backend gak kejangkau, fallback ke mock:", err);
    }
  }
  const accessToken = "mock-token";
  setAuthTokens(accessToken, "mock-refresh-token");
  const result = { user: { id: crypto.randomUUID(), name, email, role }, accessToken };
  setCachedUser(result.user);
  return result;
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
    body: JSON.stringify({ newEmail }),
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
    body: JSON.stringify({ email }),
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
