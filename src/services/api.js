const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  const stored = localStorage.getItem("eventify_token");
  return stored || "";
}

function headers(extra = {}) {
  const h = { "Content-Type": "application/json", ...extra };
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: headers(options.headers),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

// ── Auth ──
export const authAPI = {
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  adminLogin: (body) =>
    request("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getMe: () => request("/auth/me"),
  updateProfile: (body) =>
    request("/auth/profile", { method: "PUT", body: JSON.stringify(body) }),
};

// ── Events ──
export const eventsAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/events${qs ? `?${qs}` : ""}`);
  },
  getOne: (id) => request(`/events/${id}`),
  create: (body) =>
    request("/events", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/events/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id) => request(`/events/${id}`, { method: "DELETE" }),
  updateBooked: (id, increment) =>
    request(`/events/${id}/booked`, {
      method: "PATCH",
      body: JSON.stringify({ increment }),
    }),
};

// ── Bookings ──
export const bookingsAPI = {
  create: async (body) => {
    // body can be FormData (with file upload) or plain object
    const isFormData = body instanceof FormData;
    const h = {};
    const token = getToken();
    if (token) h["Authorization"] = `Bearer ${token}`;
    if (!isFormData) h["Content-Type"] = "application/json";
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: h,
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(data.message || `Request failed (${res.status})`);
    return data;
  },
  getMy: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/bookings${qs ? `?${qs}` : ""}`);
  },
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/bookings/all${qs ? `?${qs}` : ""}`);
  },
  updateStatus: (id, body) =>
    request(`/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  exportCSV: () => {
    const token = getToken();
    return fetch(`${API_BASE}/bookings/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// ── Upload ──
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const token = getToken();
    const h = {};
    if (token) h["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: h,
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(data.message || `Upload failed (${res.status})`);
    return data;
  },
  deleteImage: (url) =>
    request("/upload", {
      method: "DELETE",
      body: JSON.stringify({ url }),
    }),
};

// ── Waitlist ──
export const waitlistAPI = {
  add: (body) =>
    request("/waitlist", { method: "POST", body: JSON.stringify(body) }),
};

// ── Favorites ──
export const favoritesAPI = {
  toggle: (eventId) => request(`/favorites/${eventId}`, { method: "POST" }),
  getAll: () => request("/favorites"),
};

// ── Promos ──
export const promosAPI = {
  getAll: () => request("/promos"),
  create: (body) =>
    request("/promos", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    request(`/promos/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id) => request(`/promos/${id}`, { method: "DELETE" }),
  validate: (body) =>
    request("/promos/validate", { method: "POST", body: JSON.stringify(body) }),
};

// ── Admin ──
export const adminAPI = {
  getSettings: () => request("/admin/settings"),
  updateSettings: (body) =>
    request("/admin/settings", { method: "PUT", body: JSON.stringify(body) }),
  getDashboard: () => request("/admin/dashboard"),
};

// ── Content ──
export const contentAPI = {
  getTestimonials: () => request("/testimonials"),
  getGallery: () => request("/gallery"),
  getStats: () => request("/stats"),
  getSiteInfo: () => request("/site-info"),
  submitContact: (body) =>
    request("/contact", { method: "POST", body: JSON.stringify(body) }),
};
