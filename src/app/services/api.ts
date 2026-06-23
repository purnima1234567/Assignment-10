const API_BASE = "http://localhost:5000/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message);
  }
  return res.json();
}

export const api = {
  users: {
    list: () => request<any[]>("/users"),
    updateStatus: (id: string, status: string) =>
      request<any>(`/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    delete: (id: string) =>
      request<any>(`/users/${id}`, { method: "DELETE" }),
  },
  doctors: {
    list: (params?: Record<string, any>) => {
      const q = new URLSearchParams(params).toString();
      return request<any>(`/doctors${q ? `?${q}` : ""}`);
    },
    verify: (id: string, status: "verified" | "rejected") =>
      request<any>(`/doctors/${id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },
  appointments: {
    list: () => request<any[]>("/appointments"),
    create: (data: any) => request<any>("/appointments", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) => request<any>(`/appointments/${id}/status`, { method: "PATCH", body: JSON.stringify({ appointmentStatus: status }) }),
  },
  payments: {
    list: () => request<any[]>("/payments"),
    createIntent: (amount: number) => request<any>("/payments/create-intent", { method: "POST", body: JSON.stringify({ amount }) }),
    confirm: (data: any) => request<any>("/payments/confirm", { method: "POST", body: JSON.stringify(data) }),
  },
  prescriptions: {
    list: () => request<any[]>("/prescriptions"),
    create: (data: any) => request<any>("/prescriptions", { method: "POST", body: JSON.stringify(data) }),
  },
  reviews: {
    list: () => request<any[]>("/reviews"),
    create: (data: any) => request<any>("/reviews", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/reviews/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/reviews/${id}`, { method: "DELETE" }),
  },
  analytics: {
    stats: () => request<any>("/analytics/stats"),
    data: () => request<any>("/analytics/data"),
  },
};
