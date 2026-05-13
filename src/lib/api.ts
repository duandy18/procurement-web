export const PROCUREMENT_API_BASE_URL = (
  import.meta.env.VITE_PROCUREMENT_API_BASE_URL ?? "http://127.0.0.1:8015"
).replace(/\/$/, "");

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${PROCUREMENT_API_BASE_URL}${normalizedPath}`;
}
