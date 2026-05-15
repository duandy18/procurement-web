export const PROCUREMENT_API_BASE_URL = (
  import.meta.env.VITE_PROCUREMENT_API_BASE_URL ?? "http://127.0.0.1:8015"
).replace(/\/$/, "");

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${PROCUREMENT_API_BASE_URL}${normalizedPath}`;
}

/* procurement auth runtime API helpers */
const PROCUREMENT_ACCESS_TOKEN_KEY = "procurement_access_token";

export function getAccessToken(): string | null {
  return window.localStorage.getItem(PROCUREMENT_ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null): void {
  if (token) {
    window.localStorage.setItem(PROCUREMENT_ACCESS_TOKEN_KEY, token);
    return;
  }

  window.localStorage.removeItem(PROCUREMENT_ACCESS_TOKEN_KEY);
}

async function procurementRuntimeApiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers);

  if (!headers.has("content-type") && init.body) {
    headers.set("content-type", "application/json");
  }

  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(apiUrl(path), {
    ...init,
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${body}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.text();
  if (!body) {
    return undefined as T;
  }

  return JSON.parse(body) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return procurementRuntimeApiRequest<T>(path);
}

export function apiPost<T = void>(path: string, payload: unknown): Promise<T> {
  return procurementRuntimeApiRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function apiPatch<T>(path: string, payload: unknown): Promise<T> {
  return procurementRuntimeApiRequest<T>(path, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function apiPut<T>(path: string, payload: unknown): Promise<T> {
  return procurementRuntimeApiRequest<T>(path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

