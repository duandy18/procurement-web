import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const rawBasePath = process.env.VITE_APP_BASE_PATH || "/";

function normalizeBasePath(value: string): string {
  const trimmed = value.trim();

  if (!trimmed || trimmed === "/") {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

const appBasePath = normalizeBasePath(rawBasePath);

export default defineConfig({
  base: appBasePath,
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5176,
    strictPort: true,
  },
});
