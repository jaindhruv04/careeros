const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && token) {
    localStorage.removeItem("token");

    if (window.location.pathname !== "/login") {
      window.location.replace("/login");
    }
  }

  return res;
}
