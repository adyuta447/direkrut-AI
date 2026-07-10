import type { User, UserRole } from "../types";
import { apiFetch, isApiConfigured } from "./apiClient";

/**
 * Layer auth. apps/api-go bakal handle JWT + role-based access control
 * (lihat internal/auth). Sampai itu siap, login/register cuma bikin
 * user lokal di memori (persis perilaku AuthScreen sekarang).
 */

interface AuthResponse {
  user: User;
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  if (isApiConfigured) {
    return apiFetch<AuthResponse>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }
  return {
    user: { id: crypto.randomUUID(), name: email.split("@")[0], email, role: "applicant" },
    token: "mock-token",
  };
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<AuthResponse> {
  if (isApiConfigured) {
    return apiFetch<AuthResponse>("/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  }
  return {
    user: { id: crypto.randomUUID(), name, email, role },
    token: "mock-token",
  };
}
