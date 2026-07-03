import type { OrderState } from "./types";

export async function fetchCurrentOrder() {
  const res = await fetch("/api/orders/current", { cache: "no-store" });
  if (res.status === 401) return { mode: "demo" as const };
  if (!res.ok) throw new Error("Failed to load order");
  return res.json() as Promise<{ mode: "demo" | "production"; order?: Partial<OrderState> & { orderId: string } }>;
}

export async function fetchMe() {
  const res = await fetch("/api/me", { cache: "no-store" });
  if (!res.ok) return { user: null, isAdmin: false };
  return res.json() as Promise<{ user: { id: string; email: string; name?: string } | null; isAdmin: boolean }>;
}

export async function createNewOrder() {
  const res = await fetch("/api/orders/new", { method: "POST" });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json() as Promise<{ orderId: string; orderNo: string }>;
}

export async function patchOrder(orderId: string, patch: Record<string, unknown>) {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to save order");
  return res.json();
}

export async function adminAdvanceOrder(orderId: string) {
  const res = await fetch(`/api/orders/${orderId}/advance`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to advance order");
  return res.json() as Promise<{ order: { stageIndex: number } }>;
}

export async function uploadOrderPhoto(orderId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`/api/orders/${orderId}/photos`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload photo");
  return res.json() as Promise<{ photo: { id: string; url: string; name: string } }>;
}

export async function deleteOrderPhotoApi(orderId: string, photoId: string) {
  const res = await fetch(`/api/orders/${orderId}/photos/${photoId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete photo");
}

export async function startCheckout(orderId: string, state: OrderState) {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, state }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Checkout failed");
  }
  return data as { mode: "demo" | "stripe"; url?: string; orderId: string };
}

export async function registerAccount(name: string, email: string, password: string) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Registration failed");
  }
}

export async function requestPasswordReset(email: string) {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Could not send reset email");
  }
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Reset failed");
  }
}

export type AuthConfig = {
  database: boolean;
  credentials: boolean;
  otp: boolean;
  google: boolean;
  apple: boolean;
};

export async function fetchAuthConfig() {
  const res = await fetch("/api/auth/config", { cache: "no-store" });
  if (!res.ok) {
    return { database: false, credentials: false, otp: false, google: false, apple: false };
  }
  return res.json() as Promise<AuthConfig>;
}

export async function sendOtpCode(email: string) {
  const res = await fetch("/api/auth/otp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Could not send sign-in code");
  }
  return data as { ok: true; mode: "dev" | "resend"; devCode?: string };
}
