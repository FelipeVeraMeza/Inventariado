import { API_BASE_URL } from "./config";

// Wrapper mínimo sobre fetch para hablar con el backend propio.
export async function apiFetch(path, { method = "GET", body, params } = {}) {
  let url = `${API_BASE_URL}${path}`;

  if (params) {
    const entries = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    );
    const qs = new URLSearchParams(entries).toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json())?.error || "";
    } catch {
      /* respuesta sin JSON */
    }
    const error = new Error(detail || `HTTP ${res.status}`);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}
