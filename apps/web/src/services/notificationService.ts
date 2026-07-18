import { apiFetch, isApiConfigured } from "./apiClient";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

interface ApiNotificationListResponse {
  items: AppNotification[];
}

export async function listNotifications(): Promise<AppNotification[]> {
  if (!isApiConfigured) return [];
  try {
    const data = await apiFetch<ApiNotificationListResponse>("/v1/notifications");
    return data.items;
  } catch (err) {
    console.error("[notificationService] gagal ambil notifikasi:", err);
    return [];
  }
}

export async function markAsRead(id: string): Promise<void> {
  if (!isApiConfigured) return;
  try {
    await apiFetch<{ status: string }>(`/v1/notifications/${id}/read`, { method: "POST" });
  } catch (err) {
    console.error("[notificationService] gagal tandai notifikasi:", err);
  }
}
